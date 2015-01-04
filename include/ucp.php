<?php

require_once('core.php');


use Fenom\Provider;

$fenom = new Fenom(new Provider('../ucp/themes'));
$fenom->setCompileDir('../cache');

if (defined('DEBUG'))
{
  $fenom->setOptions(Fenom::AUTO_RELOAD);
}

if (isset($_GET['lang']))
{
  $currentLanguage=$_GET['lang'];
  setcookie('lang', $currentLanguage);
}
else if (isset($_COOKIE['lang']))
{
  $currentLanguage=$_COOKIE['lang'];
}
else
{
  $currentLanguage = configgetvalue('system', 'main', NULL, 'ucpLocale');
}
loadLocale ( 'ucp', $currentLanguage);


$ipRequest=" WHERE iplist LIKE '%\"".$_SERVER['REMOTE_ADDR']."\"%'";
function formatCash($sum)
{
  $currency=configgetvalue('system', 'main', NULL, 'currency');
  return sprintf(_ngettext("%s $currency", "%s $currency", $sum), $sum);
}

class User
{
  private $data=array();
  private $valid=false;
  private $table=false;
  public $isRestricted=false;
  function __construct($cond=false)
  {
    if ($cond!==false)
    {
      $this->table=new table('user');
      $req=$this->table->load($cond." LIMIT 1");
      if (count($req))
      {
        $this->data=$req[0];
        $this->valid=true;
      }
    }
  }
  function isEnabled()
  {
    return !intval($this->data['disabled']);
  }
  function isRestricted()
  {
    return $this->isRestricted;
  }
  function isValid()
  {
    return $this->valid;
  }
  function getName()
  {

    $fullName=$this->data['sname'];
    if ($this->data['fname'])
    {
      $fullName.=" ". strtoupper( my_mb_substr($this->data['fname'], 0, 2) ).".";
      if ($this->data['pname'])
      {
        $fullName.=" ". strtoupper( my_mb_substr($this->data['pname'], 0, 2) ).".";
      }
    }
    return $fullName;
  }
  function getDiscount()
  {
    return $this->data['discount'];
  }
  function getField($field)
  {
    return $this->data[$field];
  }
  function changeField($name, $value)
  {
    $this->table->edit(
      array(
        'id'  => $this->getId(),
        $name => $value
      )
    );
  }
  function getId()
  {
    return $this->data['id'];
  }
  function getFormattedId()
  {
    $idrenderer=configgetvalue('system', 'grid', NULL, 'user-idrenderer');
    $idfunc='formatUserId'.$idrenderer;
    return $idfunc($this->data);
  }
 
  function getFullName()
  {
    return smoneyf($this->data['cash']);
  }
  function getCurrentTariff()
  {
    $tariff=getCurrentTariff($this->getId());
    if ($tariff)
    {
      $tariffTable=new table('tariff');
      $row=$tariffTable->loadById($tariff['detailsid']);
      return $row;
    }
  }
  function getSelectedTariff()
  {
    $tariffId=$this->data['tariff'];
    if ($tariffId)
    {
      $tariffTable=new table('tariff');
      $row=$tariffTable->loadById($tariffId);
      return $row;
    }
  }

  function getCash()
  {
    return smoneyf($this->data['cash']);
  }
  function calculateTariffPrice()
  {
    global $mysqlTimeDateFormat;

    return getCashToPay($this->getId() );
  }

  function getCashToPay()
  {
    $tariffPrice=$this->calculateTariffPrice();
    $cash=money($this->data['cash']);
    $cashToPay=$tariffPrice-$cash;
    return smoneyf($cashToPay);
  }

  function getFormattedCash()
  {
    $currency=configgetvalue('system', 'main', NULL, 'currency');
    $cash=smoneyf($this->data['cash']);
    return sprintf(_ngettext("%s $currency", "%s $currency", $cash), $cash);
  }
  function getFormattedCashToPay()
  {
    $currency=configgetvalue('system', 'main', NULL, 'currency');
    $cashToPay=$this->getCashToPay();
    return sprintf(_ngettext("%s $currency", "%s $currency", $cashToPay), $cashToPay);
  }

  function getAvailableTariffs()
  {
    $tariffTable=new table('tariff');
    $allTariffs= $tariffTable->load();
    $availableTariffs=array();
    $userCity=$this->data['city'];
    for ($i=0; $i<count($allTariffs); $i++)
    {
      $tariff=$allTariffs[$i];
      if (in_array($userCity, $tariff['city']) && $tariff['public']===1)
      {
        $availableTariffs[$tariff['id']]= $tariff;
      }
    }
    return $availableTariffs;
  }
}

checkUpdate();
session_start();
if (strpos($_SERVER['REQUEST_URI'], 'auth.php')===false && strpos($_SERVER['REQUEST_URI'], '/login.php')===false)
{
 $_SESSION['url'] = substr ($_SERVER['REQUEST_URI'], strrpos( $_SERVER['REQUEST_URI'], '/' ) ); 
}

if (!isset($_SESSION['id']) && configgetvalue('system', 'ucp', NULL, 'IPautoLogin') )
{
  $user=new User($ipRequest);
  if (configgetvalue('system', 'ucp', NULL, 'restrictUsersLoggedByIP'))
  {
    $user->isRestricted=true;
    $_SESSION['is_restricted']=true;
  }
}
else if (!isset($_SESSION['id']))
{
  $user=new User();
}
else if ($_SESSION['id']===0)
{
  $user=new User();
}
else if ($_SESSION['id'])
{
  $user=new User("WHERE id=".$_SESSION['id']);
  if (isset($_SESSION['is_restricted']) && $_SESSION['is_restricted']===true)
  {
    $user->isRestricted=true;
  }
}

if ($user->isValid())
{
  $_SESSION['id']=$user->getId();
}

session_write_close();





/* languages */



$checkFn=function($el)
{
  $target='locale';
  $domain='ucp';
  if (file_exists("../$target/$el/LC_MESSAGES/$domain.mo") || file_exists("../$target/$el/LC_MESSAGES/$domain.po")) return true;
};

$target='locale';
$languages=getDirs("../$target", $checkFn);

$params=$_GET;
for($i=0; $i<count($languages); $i++) 
{  
  $language=$languages[$i];
  $params['lang']=$language;
  $href='?'.http_build_query($params);
  $icon="themes/default/flags/".strtolower(substr($language, 3)).".png";
  $languages[$i]=array($language, $href, $icon);
}



/* Generate menu */


$menu=array();

$menu['index.php']=array( __('Home'), 0);

if ($user->isValid())
{
  $menu['info.php']=array( __('My info'), 0);
  if ($user->isEnabled())
  {
    if (configgetvalue('system', 'ucp', NULL, 'showMoneyflow'))
    {
      $menu['moneyflow.php']=array( __('Moneyflow'), 0);
    }
    if (pluginExists('scratchcard'))
    {
      $menu['paywithcard.php']=array( __('Fund by card'), 0);
    }
  }
}
if (configgetvalue('system', 'ucp', NULL, 'showTariffs'))
{
  $menu['tariffs.php']=array(__( 'Tariffs'), 0);
}
if (configgetvalue('system', 'ucp', NULL, 'showDocuments'))
{
  $menu['documents.php']=array( __('Documents'), 0);
}
if ($user->isValid() && pluginExists('message')) 
{
  if ($user->isEnabled())
  {
    $messageText=__('Messages');

    $messageTable=new table('message');
    $request = "WHERE `recipient`=".$user->getId()." AND `recipient_is_admin`=0 AND `is_new`=1";
    $newMessages=$messageTable->load($request);
    $newMessagesCount=count($newMessages);

    if ($newMessagesCount)
    {
      $messageText .= ' <span id="messages-count">'.$newMessagesCount.'</span>';
    }
    $menu['message.php']=array($messageText , 0);
  }
}
$menu['contacts.php']=array( __('Contacts'), 0);


$scriptName=substr($_SERVER['SCRIPT_NAME'], 1);
if (isset($menu[$scriptName]))
{
  $menu[$scriptName][1]=1;
}
if ($user->isValid())
{
  $userName=$user->getName();
  if ($userName)
  {
    $displayName=$userName;
  }
  else
  {
    $displayName=$user->getFormattedId();
  }
}
else
{
  $displayName = false;
}


$headerData=array(
  "htmlTitle" => sprintf(__("%s - Nuance - User panel"), configgetvalue('system', 'main', NULL, 'companyName')),
  "languages" => $languages,
  "menu" => $menu,
  "user" => $user,
  "logoPath" => "themes/".$theme->getTemplateLocation("images/logo.png"),
  "css" => $theme->css,
  "themeName" => $theme->name,
  "displayName" => $displayName,
  "currentLanguage" => $currentLanguage,
);


?>
