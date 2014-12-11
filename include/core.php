<?php

// Set runtime preferences

$sessionId=isset($_SESSION['user_id']) ? $_SESSION['user_id'] : false;

$path=dirname(__FILE__);

function __autoload($classname) 
{
  global $path;
  $classname=str_replace("\\", "/", $classname);
  $filename = $path."/../include/". $classname .".php";
  if (file_exists($filename))
  {
    include_once($filename);
  }
}


set_time_limit(0);


// Include config
include $path."/default.php";
include_once $path."/cache.php";
include $path."/../config.php";


$loggedTables=array(
      'user' => array ('editdate'),
      'tariff' => true,
      'street' => true,
      'city' => true,
      'router' => true,
      'master' => true,
      'group' => true
    );
function is_windows()
{
  if(PHP_OS == 'WINNT' || PHP_OS == 'WIN32')
  {
    return true;
  }
  return false;
}


if (!function_exists('my_mb_substr'))
{
  function my_mb_substr($str, $s, $l = null)
  {
    $l=$l/2;
    return join("", array_slice(
        preg_split("//u", $str, -1, PREG_SPLIT_NO_EMPTY), $s, $l));
  }
}
else
{
  function my_mb_substr($str, $s, $l = null)
  {
    return mb_substr($str, $s, $l);
  }
}

function registerModule($class, $moduleName)
{
}


$usertheme="./themes/default";
$dateFormat='d.m.Y';
$routerObj=array();
$errors=array();
$timeDateFormat='H:i d.m.Y';
$mysqlTimeDateFormat='Y-m-d H:i:s';
if (!isset($cash_fractional_part)) $cash_fractional_part=2;
// Enable debug during development
if (defined('DEBUG') && DEBUG===true)
{
  ini_set('display_errors', 1);
  error_reporting(E_ALL);
}

// Creating PDO

$connect_str = DB_DRIVER . ':host='. DB_HOST . ';dbname=' . DB_NAME;
try
{
  $db = new PDO($connect_str,DB_USER,DB_PASS);
  $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
  $db->exec('SET NAMES utf8');
}
catch(PDOException $e)
{
  $errorText="Cannot connect to database<br>";
  require_once $usertheme."/error.php";
  die();
}
// Check if tables exists

$query="SHOW TABLES LIKE '".DB_TABLE_PREFIX."%'";
$res=$db->query($query);
$rows=array();
if ($res)
{
  $rows=$res->fetchAll();
}
if (!count($rows))
{
  $errorText="Cannot find tables<br>";
  require_once $usertheme."/error.php";
  die();
}

$timezone=configgetvalue('system', 'main', NULL, 'timezone');
date_default_timezone_set($timezone);
$logTable=new table('log');
$logTable->setLogging(false);
$columnCache=array();
$columnCacheAssoc=array();

function d($a)
{
  if (defined('DEBUG') && DEBUG===true)
  {
    echo "<pre>";
    var_dump($a);
    echo "</pre>";
  }
}

$aclCache='';


function get_password_hash($password)
{
  if (defined('USE_PHPASS'))
  {
  	require_once('class-phpass.php');
    $wp_hasher = new PasswordHash(8, true);
    return $wp_hasher->HashPassword($password);
  }
  else
  {
    return md5($password);
  }
}

function check_password_hash($password, $hash)
{
  if (defined('USE_PHPASS'))
  {
  	require_once('class-phpass.php');
    $wp_hasher = new PasswordHash(8, true);
    return $wp_hasher->CheckPassword($password, $hash);
  }
  else
  {
    return ($hash===md5($password));
  }
}


$runningFolder=explode('/', $_SERVER['DOCUMENT_ROOT']);
$domain = array_pop( $runningFolder );

$selectedTheme = configgetvalue('system', 'main', NULL, $domain.'Theme');


$theme=new Theme($selectedTheme);

function loadLocale($domain, $locale=null)
{
  define('PROJECT_DIR', realpath('./'));
  define('LOCALE_DIR', PROJECT_DIR .'/../locale');
  require_once('gettext/gettext.inc');

  $encoding = 'UTF-8';

  if (!$locale)
  {
    $locale = configgetvalue('system', 'main', NULL, $domain.'Locale');
  }
  T_setlocale(LC_MESSAGES, $locale);
  T_bindtextdomain($domain, LOCALE_DIR);
  T_bind_textdomain_codeset($domain, $encoding);
  T_textdomain($domain);
}


function l($type, $subtype, $targetsection=NULL, $targetid=NULL, $olddata='', $newdata='')
{
  global $logTable, $sessionId, $mysqlTimeDateFormat;
  if (is_array($olddata)) $olddata=json_encode($olddata);
  if (is_array($newdata)) $newdata=json_encode($newdata);
  $logTable->add(
    array(
      'type'=> $type,
      'subtype' => $subtype,
      'master' => $sessionId,
      'targetsection' => $targetsection,
      'targetid' => $targetid,
      'olddata' => $olddata,
      'newdata' =>$newdata,
      'date' => date($mysqlTimeDateFormat)
    )
  );
}
function getBrowser()
{
  $u_agent = $_SERVER['HTTP_USER_AGENT'];
  $bname = 'Unknown';
  $platform = 'Unknown';
  $version= "";
  $majorVersion="";

  //First get the platform?
  if (preg_match('/linux/i', $u_agent)) {
      $platform = 'linux';
  }
  elseif (preg_match('/macintosh|mac os x/i', $u_agent)) {
      $platform = 'mac';
  }
  elseif (preg_match('/windows|win32/i', $u_agent)) {
      $platform = 'windows';
  }
 
  // Next get the name of the useragent yes seperately and for good reason
  if(preg_match('/MSIE/i',$u_agent) && !preg_match('/Opera/i',$u_agent))
  {
    $bname = 'Internet Explorer';
    $ub = "MSIE";
  }
  elseif(preg_match('/Firefox/i',$u_agent))
  {
      $bname = 'Mozilla Firefox';
      $ub = "Firefox";
  }
  elseif(preg_match('/Chrome/i',$u_agent))
  {
      $bname = 'Google Chrome';
      $ub = "Chrome";
  }
  elseif(preg_match('/Safari/i',$u_agent))
  {
      $bname = 'Apple Safari';
      $ub = "Safari";
  }
  elseif(preg_match('/Opera/i',$u_agent))
  {
      $bname = 'Opera';
      $ub = "Opera";
  }
  elseif(preg_match('/Netscape/i',$u_agent))
  {
      $bname = 'Netscape';
      $ub = "Netscape";
  }
 
  // finally get the correct version number
  $known = array('Version', $ub, 'other');
  $pattern = '#(?<browser>' . join('|', $known) .
  ')[/ ]+(?<version>[0-9.|a-zA-Z.]*)#';
  if (!preg_match_all($pattern, $u_agent, $matches)) {
      // we have no matching number just continue
  }
 
  // see how many we have
  $i = count($matches['browser']);
  if ($i != 1) {
      //we will have two since we are not using 'other' argument yet
      //see if version is before or after the name
      if (strripos($u_agent,"Version") < strripos($u_agent,$ub)){
          $version= $matches['version'][0];
      }
      else {
          $version= $matches['version'][1];
      }
  }
  else {
      $version= $matches['version'][0];
  }
 
  // check if we have a number
  if ($version==null || $version=="") {$version="?";}
 
  $majVer=explode('.', $version);
  $majVer=$majVer[0];
  return array(
      'userAgent'    => $u_agent,
      'name'         => $ub,
      'fullName'     => $bname,
      'version'      => $version,
      'majorVersion' => strpos ($version, '.') ? intval($majVer) : 0,
      'platform'     => $platform,
      'pattern'      => $pattern
  );
} 
$fractionalPart=configgetvalue('system', 'cash', NULL, 'fractionalPart');
function smoneyf($cash)
{
  global $fractionalPart;
  return sprintf("%01.".$fractionalPart."f", $cash);
}
function money($cash)
{
  global $fractionalPart;
  return round(floatval($cash), $fractionalPart);
}

$verbose=(isset($_GET['verbose']) && $_GET['verbose']=='true') ? true : false;
function c($o, $force=false)
{
	global $verbose;
  if ($verbose || $force)
	{
    echo "<pre>";
    if (is_string($o))
      echo $o;
    else 
      var_dump($o);
	  echo "</pre>";
	}
}
function redirect($file='/', $otherDomain=false)
{
  if (!$otherDomain)
  {
    $srvName=$_SERVER['SERVER_NAME'];
    if (substr($file, 0, 1)==='/') $file=substr($file, 1);
    $url=parse_url($_SERVER['REQUEST_URI']);
    $dirPath=$url['path'];
    if (strrpos($dirPath, '/') && strpos($dirPath, '/') !==strrpos($dirPath, '/'))
    {
      $dirPath=substr($dirPath, 0, strrpos($dirPath, '/')+1);
    }
    else if (substr($dirPath, -1)!=='/')
    {
      $dirPath='/';
    }
    $href="http".((isset($_SERVER['HTTPS']) && isset($_SERVER['HTTPS']))?"s":"")."://".$srvName.":".$_SERVER['SERVER_PORT'].$dirPath.$file;
  }
  else
  {
    $href=$file;
  }

  if ($_SERVER['REQUEST_URI']!=='/auth.php')
  {
    $_SESSION['redirected_from'] = $_SERVER['REQUEST_URI'];
  }

  header("Location: $href");
}

function tableExists($table)
{
  global $db;
	return $db->query("SHOW TABLES like '".DB_TABLE_PREFIX.$table."'")->rowCount();
}
function controllerRouter($routerId, $mode, $userId=false)
{
	global $path, $routerObj, $response;

  if (!$routerId) return;
  $routerTable=new table('router');
  $devres=$routerTable->load($routerId ? "WHERE id=$routerId" : "");
  $returnValue=true;
  if (count($devres))
  {
    $devrow = $devres[0];
    $type=$devrow['routertype'];
    $libPath="$path/../modules/$type/$type.php";
    if (!file_exists($libPath)) return true;
    require_once $libPath;
    if (array_key_exists($devrow['id'], $routerObj))
    {
      $module=$routerObj[$devrow['id']];
    }
    else
    {
      $module=new $type($devrow['ip'], $devrow['port'], $devrow['login'], $devrow['pass'], $devrow['id']);
      $routerObj[$devrow['id']]=$module;
    }
    if (method_exists($module, $mode))
    {
      $returnValue=$module->$mode($userId);
    } 
  }
  return $returnValue;
}

function controllerRouterFork($routerId, $mode, $userid=false)
{
  $result=fork("./updaterouter.php", "$routerId $mode $userid");
  $colonPos=strpos($result, '::');
  $resultType=substr($result, 0, $colonPos);
  $resultValue=substr($result, $colonPos+2);
  switch ($resultType)
  {
    case 'array':
    case 'object':
      $resultValue=json_decode($resultValue);
    break;
    case 'bool':
      $resultValue=$resultValue === 'true';
    break;
    case 'integer':
    case 'double':
      $resultValue=floatval($resultValue);
    break;
    case 'NULL':
      $resultValue=null;
    break;
  }
  return $resultValue;
}

function fork($scriptName, $arguments, $sync=true)
{
  $scriptPath=realpath(__DIR__.$scriptName);


  if (exec('php -v'))
  {
     // PHP_BINARY

    if ($sync)
    {
      $path="php $scriptPath $arguments";
    }
    else
    {
      if (is_windows())
      {
        $path="start php $scriptPath $arguments";
      }
      else
      {
        $path="php $scriptPath $arguments &";
      }
    }
    $handle=popen($path, 'r');
    $output='';
    if ($sync)
    {
      while(!feof($handle)) 
      {
        $buffer = fgets($handle);
        $output .= $buffer;
      }
    }
    pclose($handle);

    return $output;
  }
  else
  {
    include $scriptPath;
  }
}

function controllerRouterQueue($routerId, $mode, $userId=false)
{
  if (!$routerId) return;
  //Add entry to updqueue table
  $updqueueTable=new table('routerupdatequeue');
  $updqueueTable->setLogging(false);
  // Check for the same action records
  $req="WHERE router=$routerId AND mode='$mode'";
  if ($userId)
  {
    $req.=" AND user=$userId";
  }
  $similarRes=$updqueueTable->load($req);
  if  (!count($similarRes))
  {
    $updqueueTable->add( array ('router' => $routerId, 'mode' => $mode, 'user' => $userId) );
  }


  //fork('/updaterouter.php', false);


  $unavailableRouters=array();
  $queRes=$updqueueTable->load("WHERE `router`=$routerId");
  foreach ($queRes as $queRow)
  {
    if (controllerRouter($queRow['router'], $queRow['mode'], $queRow['user']) ||
        controllerRouter($queRow['router'], 'checkConnection', $queRow['user'])
    )
    {
      $updqueueTable->delete(array('id'=>$queRow['id']));
    }
    else
    {
      break;
    }
  }
}
function getDirs($path)
{
  if (!$path) return;
  $list=scandir($path);
  array_shift($list);
  array_shift($list);
  return $list;
}
function getModules()
{
  return getDirs('../modules');
}
function getDirsAsStore($path, $checkFn)
{
  $list=getDirs($path);
  $arr=array();
  for ($i=0; $i<count($list); $i++)
  {
    $el=$list[$i];
    if ($checkFn && !$checkFn($el))
    {
      continue;
    }
    else
    {
      $arr[$el]=array($el, $el);
    }
  }
  return $arr;
}
function getPlugins()
{
  return getDirs('../plugins');
}
function loadPlugin($part, $name)
{
  include_once "../plugins/$name/$part/$name.php";
}
$licenseManager=new LicenseManager;
$allowedPlugins=$licenseManager->checkPermission('allowedPlugins');
function pluginExists($name)
{
  global $allowedPlugins;
  return array_search($name, getPlugins())!==false && array_search($name, $allowedPlugins)!==false;
}
class response
{
	public $header = array();
	public $data = array();
	public $sortOrder = array();
	public $debug=array();
	public $errors=array();
	public $default=array();
	public $length=null;
	public $success = false;
	public $message = array();
	public $deleted=array();
	public function __construct ($tableName=NULL)
	{
    if ($tableName) $this->header=getFields($tableName);
	}
};

$addRenderers=array(
  'user'=>  function($newFields)
  {
    global $mysqlTimeDateFormat;
    if (!isset($newFields['regdate']) || $newFields['regdate']==='0000-00-00 00:00:00') 
    {
      $newFields['regdate']=date("Y-m-d");
    }
    $newFields['editdate']=date($mysqlTimeDateFormat);
    return $newFields;
  },
  'order' => function ($newFields)
  {
    global $mysqlTimeDateFormat;
    $newFields['date']=date($mysqlTimeDateFormat);
    if (!isset($newFields['canceled']))
    {
      $newFields['canceled']=0;
    }
    if (!isset($newFields['temp']))
    {
      $newFields['temp']=0;
    }
    return $newFields;
  },
  'moneyflow' => function ($newFields)
  {
    global $mysqlTimeDateFormat, $sessionId;
    $newFields['date']=date($mysqlTimeDateFormat);
    if (isset($newFields['detailsname']) && $newFields['detailsname']==='adminpay')
    {
      $newFields['detailsid']=$sessionId;
    }
    return $newFields;
  },
  'message' => function($newFields)
  {
    global $mysqlTimeDateFormat, $sessionId;
    if (isset($newFields['user'])) // Sending from ACP
    {
      $recipients=$newFields['user'];
      $recipients=explode(',', $recipients);
      $messageTable=new table('message');
      foreach ($recipients as $recipient)
      {
        $separateMessage=array(
          'sender' => $sessionId,
          'sender_is_admin' => 1,
          'recipient' => $recipient,
          'recipient_is_admin' => 0,
          'is_new' => 1,
          'text' => $newFields['text'],
          'date' => date($mysqlTimeDateFormat)
        );
        $messageTable->add($separateMessage);
      }
      unset($newFields['user']);
      return false;
    }
    else
    {
      return $newFields;
    }
  },
  'master' => function ($newFields)
  {
    if (isset($newFields['password']))
    {
      $newFields['password']=get_password_hash($newFields['password']);
    }
    if (!isset($newFields['group']))
    {
      $newFields['group']=1;
    }
    return $newFields;
  },
  'log' => function ($newFields)
  {
    if ($newFields['type']==='db')
    {
      $oldData=json_decode($newFields['olddata'], true);
      if (isset($oldData['password']) && strlen($oldData['password']))
      {
        $oldData['password']='*****';
      }
      $newFields['olddata']=json_encode($oldData);

      $newData=json_decode($newFields['newdata'], true);
      if (isset($newData['password']))
      {
        if (strlen($newData['password']))
        {
          $newData['password']='******';
        }
        else
        {
          $newData['password']='';
        }
      }
      $newFields['newdata']=json_encode($newData);
    }
    return $newFields;
  }
);

$afterAddRenderers=array(
  'user'=>  function($id, $fields)
  {
    global $sessionId;
    if ( configgetvalue('system', 'cash', NULL, 'newUsersAutoFund'))
    {
      $moneyflowTable=new table ('moneyflow');
      $moneyflowTable->add(
        array(
          "user"        => $id,
          "sum"         => getCashToPay($id),
          "detailsname" => "adminpay",
          "detailsid"   => $sessionId
        )
      );

    }
    payment(0, $id);
  },
  'order' => function ($id, $fields)
  {
    $usersTable=new table('user');
    $row=$usersTable->loadById($fields['user']);
    controllerRouterQueue($row['router'], "update", $fields['user']);
  },
  'message' => function($id, $fields)
  {
    $usersTable=new table('user');
    $row=$usersTable->loadById($fields['recipient']);
    controllerRouterQueue($row['router'], "showmessage", $fields['recipient']);
  },
  'moneyflow' => function ($id, $newFields)
  {
    $sum=money($newFields['sum']);
    $userId=$newFields['user'];
    $userTable = new table ('user');
    $user=$userTable->loadById($userId);
    $newCash=money ( $user['cash'] ) + $sum;


    $userTable->edit(
      array(
        "id"   => $userId,
        "cash" => $newCash
      )
    );

    if ($sum>0 && in_array($newFields['detailsname'], array ('adminpay', 'scratchcard') ) )
    {
      $percentage=floatval(configgetvalue('system', 'cash', NULL, 'referrerPercentage')) / 100;
      $referrerSum = money( $sum * $percentage );
      // Load referrer from current user
      $refsRow=$userTable->loadById($user['referrer']);
      
      // Add money to referrer
      if ($refsRow)
      {
        $moneyflowTable=new table ('moneyflow');
        $moneyflowTable->add(
          array(
            "user"        => $refsRow['id'],
            "sum"         => $referrerSum,
            "detailsname" => "referrerpay",
            "detailsid"   => $userId
          )
        );
      }
    }


    // Check if notification is shown and disabled it if user has enought cash
    
    // Calculate amounts
    $cash=$newCash;


    $sum=-getCashToPay($user['id']);
    $newCash= $cash + $sum;
    $creditMonths=configgetvalue('system', 'cash', NULL, 'creditMonths');
    $minimumCash=$sum*intval($creditMonths);

    if (
          configgetvalue('system', 'cash', null, 'showNotifications') &&
          $user['disabled']=='0' && 
          $newCash>=$minimumCash &&
          $user['credit']=='0'
       )
    {
      controllerRouterQueue($user['router'], "clearnotification", $user['id']);
    }
  }
);

$editRenderers=array(
  'user'=>  function($id, $newFields, $oldFields)
  {
    global $sessionId;
    global $mysqlTimeDateFormat;
    if(count($newFields))
    {
      $newFields['editdate']=date($mysqlTimeDateFormat);
    }
    return $newFields;
  },
  'moneyflow' => function($id, $newFields, $oldFields)
  {
    if (isset($newFields['refund']))
    {
      if ($oldFields['detailsname']=='order')
      {
        $ordersTable=new table('order');
        $order=$ordersTable->loadById($oldFields['detailsid']);
        $ordersTable->edit( array ( 'id' => $oldFields['detailsid'],'canceled' => 1 ) );
        $remainsPercentage=1;
        $refundType=configgetvalue('system', 'cash', NULL, 'refundOrdersType');
        switch ($refundType)
        {
          case 1:
          {
            payment(0, $oldFields['user']);
            break;
          }
          case 2:
          {
            $startDate=new DateTime($order['startdate']);
            $endDate=new DateTime($order['enddate']);
            $currentDate=new DateTime('midnight');

            $a=$endDate->format("U") - $startDate->format("U");
            $b=$endDate->format("U") - $currentDate->format("U");
            $remainsPercentage = $b/$a;

          }
          case 3:
          {
            $moneyflowTable=new table ('moneyflow');
            $refundSum=-money($oldFields['sum'] * $remainsPercentage);
            if ($refundSum>0)
            {
              $moneyflowTable->add(
                array(
                  "user"        => $oldFields['user'],
                  "sum"         => $refundSum,
                  "detailsname" => "refund",
                  "detailsid"   => $oldFields['id']
                )
              );
            }
            break;
          }
        }
      }
      else if ($oldFields['detailsname']=='adminpay')
      {
        $moneyflowTable=new table ('moneyflow');
        $moneyflowTable->add(
          array(
            "user"        => $oldFields['user'],
            "sum"         => -money($oldFields['sum']),
            "detailsname" => "adminpay",
            "detailsid"   => $oldFields['detailsid']
          )
        );
      }
    }
    return $newFields;
  },
  'master' => function ($id, $newFields)
  {
    if (isset($newFields['password']))
    {
      $newFields['password']=get_password_hash($newFields['password']);
    }
    return $newFields;
  }
);
$afterEditRenderers=array(
  'user'=> function($id, $newFields, $oldFields)
  {
    // Router migration 
    if (isset($newFields['router']))
    {
      if ( intval($oldFields['router']) )
      {
        controllerRouterQueue($oldFields['router'], "delete", $id);
      }
      controllerRouterQueue($newFields['router'], "update", $id);
    }//Check these conditions only if false because all this fields will be updated during router migration
    else if (isset($newFields['login']) ||isset($newFields['password']) ||  isset($newFields['disabled']) || isset($newFields['iplist']))
    {
      controllerRouterQueue($oldFields['router'], "update", $id);
    }
    $currentOrder=getCurrentTariff($id);
    if (!$currentOrder || $currentOrder['temp']===1)
    {
      payment(0, $id);
    }
  },
  'tariff' => function($id, $newFields)
  {
    if ( isset($newFields['upspeed']) ||
         isset($newFields['downspeed']) ||
         isset($newFields['nightupspeed']) ||
         isset($newFields['nightdownspeed']) ||
         isset($newFields['downburstlimit']) ||
         isset($newFields['downburstthreshold']) ||
         isset($newFields['downbursttime']) ||
         isset($newFields['upburstlimit']) ||
         isset($newFields['upburstthreshold']) ||
         isset($newFields['upbursttime']) 
       )
    {
      $usersTable=new table('user');
      $users=$usersTable->load("WHERE tariff=$id");
      foreach ($users as $row)
      {
        controllerRouterQueue($row['router'], "update", $row['id']);
      }
    }
  },
  'order' => function ($id, $newFields, $oldFields)
  {
    $usersTable=new table('user');
    $row=$usersTable->loadById($oldFields['user']);
    controllerRouterQueue($row['router'], "update", $oldFields['user']);
    return $newFields;
  }
);
$deleteRenderers=array(
  'user'=>  function($id, $fields)
  {
    global $db;
    if ($fields['router']) controllerRouterQueue($fields['router'], "delete", $id);

    $db->query("DELETE FROM `".DB_TABLE_PREFIX."order` WHERE `user`=".$id);
    $db->query("DELETE FROM `".DB_TABLE_PREFIX."moneyflow` WHERE `user`=".$id);
  }
);




class table
{
	public $header = array();
	protected $name;
  private $logging;
  private $db;
	public $response;
	public function __construct($name, $resp=null)
	{
    global $db;
    global $loggedTables;
        $this->name=$name;
    $this->response = $resp ? $resp : new response($this->name);
    if (!count($this->response->header)) $this->response->header=getFields($this->name);
		$this->header=$this->response->header;
    if (array_key_exists($this->name, $loggedTables))
    {
      $this->logging=true;
    }
    $this->db=$db;
    $this->fields=getFieldsAssoc($this->name);
	}
  public function setLogging($b)
  {
    $this->logging=!!$b;
  }
  public function load($filter="")
  {
    global $timeDateFormat;
    global $dateFormat;
    if (substr($filter, -1) === '=' )  //Check wrong ID condition like 'WHERE id='
    {
      throw new Exception("MYSQL: wrong request");
    }
    $this->response->data=array();
		$this->response->success=true;
    $query="SELECT * FROM `".DB_TABLE_PREFIX.$this->name."` $filter";
      $res= $this->db->query($query);
    
    if (!$res)
    {
      throw new Exception("Wrong DB request: ".$query);
    }
    $res= $res->fetchAll();

    foreach ($res as $id => $row)
    {
      $datarow=array();
      $i=0;
      foreach($row as $key => $value)
      {
        switch ($this->header[$i][1])
        {
          case 'id':
          case 'int':
          case 'link':
          case 'tarifflink':
          case 'tinyint':
          case 'bit':
            $preparedValue=(int)$value;
          break;
          case 'multilink':
            if (strlen($value))
            {
              $preparedValue=explode(',', $value);
            }
            else
            {
              $preparedValue=array();
            }
          break;

          case 'float':
          case 'money':
            $preparedValue=(float)$value;
          break;

          default:
            $preparedValue=$value;
          break;
        }
        $row[$key]=$preparedValue;
        $i++;
      }
      $res[$id]=$row;
    } 
    return $res;
  }
  public function loadById($id)
  {
    $id=intval($id);
    $row=false;
    if ($id)
    {
      if ( strpos($id, ',')===false )
      {
        $request = "WHERE id=$id";
      }
      else
      {
        $request = "WHERE id in ($id)";
      }
      $res=$this->load($request);
      if ( count($res) )
      {
        $row=$res[0];
      }
    }
    return $row;
  }
	public function load4AJAX($filter="")
	{
    global $sessionId, $timeDateFormat, $dateFormat;
    $res=$this->load($filter);
    foreach ($res as $row)
    {
      $datarow=array();
      $i=0;
      foreach($row as $key => $value)
      {
        switch ($this->header[$i][1])
        {
          case 'timestamp':
            if ($timestamp=strtotime($value))
            {
              $value=date($timeDateFormat, $timestamp);
            }
            else
            {
              $value='';
            }
          break;
          case 'date':
            if ($timestamp=strtotime($value))
            {
              $value=date($dateFormat, $timestamp);
            }
            else
            {
              $value='';
            }
          break;
        }

        if (checkPermission ($sessionId, array ('table', $this->name, 'read', $key) ) || $key==='id' )
        {
          $datarow[]=$value;
        }
        else
        {
          $datarow[]='';
        }
        $i++;
      }
      $this->response->data[$row['id']]=$datarow;
    }
	}
  private function convert($data)
  {
    foreach ($data as $key => $value)
    {
      $type = $this->fields[$key][3] OR $this->fields[$key][1];
      switch ($type)
      {
        case 'tinyint':
        {
          if (filter_var($value, FILTER_VALIDATE_BOOLEAN))
          {
            $data[$key] = 1;
          }
          else
          {
            $data[$key] = 0;
          }
          break;
        }
      }
    }
    return $data;
  }
  private function toString($values)
  {
    foreach ($values as $key => $value)
    {
      $type = $this->fields[$key][3] OR $this->fields[$key][1];
      switch ($type)
      {
        case 'multilink':
        {
          $values[$key] = implode(',', $value);
        }
        break;
      }
    }
    return $values;
  }
	public function add($data)
	{
    global $addRenderers, $afterAddRenderers, $loggedTables;
    $namesarray = array();
		$valuesarray = array();
		unset($data['id']);
		foreach ($this->header as $key=>$value)
    {
      $name=$value[0];
      if (isset($data[$name]) && !strlen($data[$name])) unset($data[$name]);
		}
    if (array_key_exists($this->name, $addRenderers))
    {
      $data=$addRenderers[$this->name]($data);
      if ($data===false) return false;
    }
    $data=$this->convert($data);
		foreach ($data as $name=>$value)
    {
      $namesarray[]= $name;
      $valuesarray[]= ":$name";
    }
    $names=implode('`, `', $namesarray);
    $values=implode(', ', $valuesarray);
    $request="INSERT INTO `".DB_TABLE_PREFIX.$this->name."` (`$names`) VALUES ($values)";
		$res=$this->db->prepare($request);
    $res->execute($data);
		$newId=$this->db->lastInsertId();
    $this->response->debug[]=$request;
    
		if ($newId)
		{
      if ($this->logging)
      {
        if (is_array($loggedTables[$this->name]) && $newId)
        {
          foreach($loggedTables[$this->name] as $excludedField)
          {
            if (isset($data[$excludedField]))
            {
              unset($data[$excludedField]);
            }
          }
        }
        if (count($data))
        {
          l('db', 'add', $this->name, $newId, NULL, $data);
        }
      }

      if (array_key_exists($this->name, $afterAddRenderers)) $afterAddRenderers[$this->name]($newId, $data);
			$this->response->success=true;
		}
		return $newId;
	}
	public function edit($data)
	{
    global $editRenderers, $afterEditRenderers, $loggedTables;
		$id=$data['id'];
		unset($data['id']);
    $query = '';
    $row=$this->loadById($id); 
    if (!$row) return;
    $newFields=array();
    $oldFields=array();
    $changedOldFields=array();

    $currentDataAsString=$this->toString($row);
    //$newDataAsString=$this->toString($data);
    $newDataAsString=$data;
    foreach ($currentDataAsString as $key=>$currentValue)
    {
      if (isset($newDataAsString[$key]) && $newDataAsString[$key]!==$currentValue)
      {
        $newFields[$key]=$data[$key];
        $changedOldFields[$key]=$currentValue;
      }
      $oldFields[$key]=$currentValue;
    }
    if (array_key_exists($this->name, $editRenderers)) $newFields=$editRenderers[$this->name]($id, $newFields, $oldFields);
		foreach ($newFields as $key=>$value)
    {
      if (!array_key_exists($key, $row)) unset($newFields[$key]);
    }
    $newFields=$this->convert($newFields);
    foreach ($newFields as $key=>$value)
		{
      $query .= "`$key` = :$key, ";
    }
    $query=substr($query, 0, -2);
    $request="UPDATE `".DB_TABLE_PREFIX.$this->name."` SET {$query} WHERE id={$id}";
		$res=$this->db->prepare($request);
    $res->execute($newFields);

    $this->response->success=true;

    if ($this->logging)
    {
      if (is_array($loggedTables[$this->name]))
      {
        foreach($loggedTables[$this->name] as $excludedField)
        {
          if (isset($newFields[$excludedField]))
          {
            unset($changedOldFields[$excludedField]);
            unset($newFields[$excludedField]);
          }
        }
      }
      if (count($newFields))
      {
        l('db', 'edit', $this->name, $id, $changedOldFields, $newFields);
      }
    }

    if (array_key_exists($this->name, $afterEditRenderers)) $afterEditRenderers[$this->name]($id, $newFields, $oldFields);
    foreach ($oldFields as $key=>$value)
    {
      if (!isset($newFields[$key])) unset($oldFields[$key]);
    }
		return $id;
	}
	public function delete($data)
	{
    global $deleteRenderers;
    $id=$data['id'];
    $row=$this->loadById($id); 
    $fields=array();
    if ($row)
    {
      foreach ($row as $key=>$value) $fields[$key]=$value;
    }
    if (array_key_exists($this->name, $deleteRenderers)) $deleteRenderers[$this->name]($id, $fields);
    $request="DELETE FROM `".DB_TABLE_PREFIX.$this->name."` WHERE `id` in ($id)";
    $this->db->exec($request);
    $this->response->debug[]=$request;
    if ($this->logging)
    {
      l('db','delete' , $this->name, $id, $fields);
    }
		$this->response->deleted=explode(',', $id);
		return $id;
	}
}

	
function getFields($table)
{
  global $columnCache, $db;
  if (count($columnCache) && array_key_exists($table, $columnCache))
  {
    $header= $columnCache[$table];
  }
  else
  {
    $header=array();
    $request=$db->query("SHOW FULL FIELDS FROM `".DB_TABLE_PREFIX.$table."`");
    if ($request)
    {
      $res=$request->fetchAll();
      foreach ($res as $trow)
      {
        preg_match('/\((\d+)\)/',$trow["Type"], $matches);
        $length=$matches ? intval($matches[1]) : 0;
        $type=preg_replace('/\(.+\)/','',$trow["Type"]);
        $colData=array($trow["Field"]);
        if ($trow["Field"]=='id')
        {
          $colData[]='id';
        }
        else if ($trow["Comment"])
        {
          if (strpos($trow['Comment'], 'link-') === 0)
          {
            $length=substr($trow['Comment'], 5);
            $colData[]='link';
          }
          else if (strpos($trow['Comment'], 'multilink-') === 0)
          {
            $length=substr($trow['Comment'], 10);
            $colData[]='multilink';
          }
          else $colData[]=$trow["Comment"];
        }
        else
        {
          $colData[]=$type;
        }
        $colData[]=$length;
        $header[]=$colData;
      }
      $columnCache[$table]=$header;
    }
  }
  return $header;
}
function getFieldsAssoc($table)
{
  global $columnCacheAssoc, $db;
  if (count($columnCacheAssoc) && array_key_exists($table, $columnCacheAssoc))
  {
    $header= $columnCacheAssoc[$table];
  }
  else
  {
    $header=array();
    $request=$db->query("SHOW FULL FIELDS FROM `".DB_TABLE_PREFIX.$table."`");
    if ($request)
    {
      $res=$request->fetchAll();
      foreach ($res as $trow)
      {
        preg_match('/\((\d+)\)/',$trow["Type"], $matches);
        $length=$matches ? intval($matches[1]) : 0;
        $type=preg_replace('/\(.+\)/','',$trow["Type"]);
        $colData=array($trow["Field"]);
        $colData[]=$type;
        $colData[]=$length;
        if ($trow["Comment"])
        {
          if (strpos($trow['Comment'], 'link-') === 0)
          {
            $length=substr($trow['Comment'], 5);
            $colData[]='link';
          }
          else
          {
            $colData[]=$trow["Comment"];
          }
        }
        else
        {
          $colData[]=false;
        }
        $header[$trow["Field"]]=$colData;
      }
      $columnCacheAssoc[$table]=$header;
    }
  }
  return $header;
}
	
function onConfigEdit($configPath, $value, $oldValue)
{
  if ($configPath==='0/0/ucp/documents')
  {
    $documents=json_decode($value, true);
    $existingFiles=array();
    for ($i=0; $i<count($documents); $i++)
    {
      $existingFiles[]=$documents[$i]['fileName'];
    }
    $files=getDirs(UPLOADED_FILES_PATH);
    for ($i=0; $i<count($files); $i++)
    {
      if (array_search($files[$i], $existingFiles)===false )
      {
        unlink(UPLOADED_FILES_PATH.$files[$i]);
      }
    }
  }
  if ($configPath==='0/0/tariff/nightHourEnd')
  {
    $routersTable = new table('router');
    $rows=$routersTable->load();
    foreach ($rows as $row)
    {
      controllerRouter($row['id'], 'export', false);
    }
  }
  /*
  if ($configPath==='0/0/cash/withdrawalDay')
  {
    global $db, $mysqlTimeDateFormat;
    $newDay=intval($value);
    $oldDay=intval($oldValue);

    $currentDate=new DateTime;

    $newDate=new DateTime;
    $newDate->setTime(0, 0);
    $newDate->setDate($newDate->format('Y'), $newDate->format('m'), $newDay);
    var_dump($newDate);

    $oldDate=new DateTime;
    $oldDate->setTime(0, 0);
    $oldDate->setDate($oldDate->format('Y'), $oldDate->format('m'), $oldDay);
    var_dump($oldDate);
    
    // Create withdrawal date
    $withdrawalDay=configgetvalue('system', 'cash', NULL, 'withdrawalDay');
    $withdrawalDate=new DateTime('first day of this month midnight');
    $withdrawalDate->modify((intval($withdrawalDay)-1).' day');

    if ($currentDate >= $withdrawalDate)
    {
      $newDate->modify('1 month');
      $oldDate->modify('1 month');
    }
    $request= "UPDATE `order` SET `enddate`='{$newDate->format($mysqlTimeDateFormat)}' WHERE `enddate`='{$oldDate->format($mysqlTimeDateFormat)}'";
    d($request);
    $db->query( $request );
  }*/
}


function configlist()
{
  global $db;
  $types=array('system', 'user', 'router', 'var', 'subscriber');
  $reqStr="SELECT * FROM `".DB_TABLE_PREFIX."config`";
  $res=$db->query($reqStr)->fetchAll();
  $data=array(
    "system" => array(),
    "user" => array(),
    "router" => array(),
    "var" => array(),
    "subscriber" => array()
  );
  foreach ($res as $row)
  {
    $type=$types[$row['type']];
    $path=$row['path'];
    $name=$row['name'];
    $value=$row['value'];
    $owner=$row['ownerid'];
    if (!array_key_exists($owner, $data[$type])) $data[$type][$owner]=array();
    if (!array_key_exists($path, $data[$type][$owner])) $data[$type][$owner][$path]=array();
    switch ($row['vartype'])
    {
      case 'int': $value=intval($value); break;
      case 'json': $value=json_decode($value); break;
      case 'array': $value=explode(',', $value); break;
      case 'bool': $value=($value=="true") ? true : false; break;
    }
    $data[$type][$owner][$path][$name]=$value;
  }
  return $data;
};
function configgetdefaultvalue($typeAsStr, $path, $ownerid, $name)
{
  global $default;
  if (array_key_exists($typeAsStr, $default) &&
        array_key_exists($path, $default[$typeAsStr]) &&
          array_key_exists($name, $default[$typeAsStr][$path]))return $default[$typeAsStr][$path][$name];
}
function configgetvalue($typeAsStr, $path, $ownerid, $name)
{
  global $db;
  $types=array('system', 'user', 'router', 'var', 'subscriber');
  $type=array_search($typeAsStr, $types);
  if ($type===false) return;
  switch ($type)
  {
    case 0:
    case 3:
      $ownerid=0;
    break;
  }
  $configTable=new table('config');
  $res=$configTable->load("WHERE type=$type AND ownerid=$ownerid AND path='$path' AND name='$name'");
  foreach ($res as $row)
  {
    $value=$row['value'];
    switch ($row['vartype'])
    {
      case 'int': $value=intval($value); break;
      case 'json': $value=json_decode($value, true); break;
      case 'array': $value=explode(',', $value); break;
      case 'bool': $value=($value==="true") ? true : false; break;
    }
    return $value;
  }
  return configgetdefaultvalue($typeAsStr, $path, $ownerid, $name);
}
function configsetvalue($typeAsStr, $path, $ownerId, $vartype, $name, $value)
{
  global $db;
  global $mysqli;
  $success=false;
  $types=array('system', 'user', 'router', 'var', 'subscriber');
  $type=array_search($typeAsStr, $types);
  if ($type===false) return;
  switch ($type)
  {
    case 0:
    case 3:
      $ownerId=0;
    break;
  }
  $selStr="SELECT * FROM `".DB_TABLE_PREFIX."config` WHERE type='$type' AND path='$path' AND name='$name' AND ownerid=$ownerId";
  $resp=$db->query($selStr);
  $oldValue=NULL;
  if ($resp)
  {
    $sqlResult=$resp->fetchAll();
    if (count($sqlResult))
    {
      $configId=$sqlResult[0]['id'];
      $oldValue=$sqlResult[0]['value'];
      
      $updStr="UPDATE `".DB_TABLE_PREFIX."config` SET value=?, vartype=? WHERE id=?";
      $stmt=$db->prepare( $updStr );
      $stmt->execute( array ($value, $vartype, $configId) );
      if (count($sqlResult)>1)
      {
        for ($i=1; $i<count($sqlResult); $i++)
        {
          $remStr="DELETE FROM `".DB_TABLE_PREFIX."config` WHERE id=".$sqlResult[$i]['id'];
          $db->query($remStr);
        }
      }
    }
    else
    {
      $insertString="INSERT INTO `".DB_TABLE_PREFIX."config` (type, path, ownerid, vartype, name, value) VALUES (?, ?, ?, ?, ?, ?)";
      $stmt=$db->prepare( $insertString );
      $stmt->execute( array ($type, $path, $ownerId, $vartype, $name, $value) );
    }
    $success=true;
  }
  $configTree=
  array(
    $type =>
    array(
      $ownerId => 
      array(
        $path =>
        array(
          $name => $value
        )
      )
    )
  );
  if ($oldValue===NULL)
  {
    $oldValue=configgetdefaultvalue($typeAsStr, $path, $ownerId, $name);
  }
  $configPath = "$type/$ownerId/$path/$name";
  onConfigEdit($configPath, $value, $oldValue);
  return $success;
};
function checkUpdate()
{
  global $dateFormat;
  $currentDate=date($dateFormat);
  $host="nuance-bs.com";
  $port=80;
  $timeout=2;
  $lastCheck=configgetvalue('var', 'main', NULL, 'lastupdatecheck');
  $lastVersion=configgetvalue('var', 'main', NULL, 'lastversion');
  if ($lastCheck!=$currentDate)
  {

    $fp = @fsockopen($host, $port, $errno, $errstr, 1);
    if (is_resource($fp) ) 
    {
      stream_set_timeout($fp, 1);
      $request =  "GET /svc/version.php HTTP/1.0\r\n";
      $request .= "Host: $host\r\n";
      $request .= "Connection: close\r\n\r\n";
      fwrite($fp, $request);
      $res = fread($fp, 2048);

      $info = stream_get_meta_data($fp);
      fclose($fp);

      if (!$info['timed_out']) 
      {
        $resLines=explode("\r\n", $res);
        $version=array_pop($resLines);
        if ($version && $lastVersion!==$version)
        {
          configsetvalue('var', 'main', NULL, 'string', 'lastversion', $version);
        }
      }

    }
  }
  configsetvalue('var', 'main', NULL, 'string', 'lastupdatecheck', $currentDate);
}

function getCashToPay($userId, $userRow=false, $tariffPrice=false, $full=false)
{
  global $mysqlTimeDateFormat;

  if ($userRow===false)
  {
    $usersTable=new table('user');
    $userRow=$usersTable->loadById($userId);
  }
  if ($tariffPrice===false)
  {
    $tariffTable = new table ('tariff');
    $tariff=$tariffTable->loadById($userRow['tariff']);

    $tariffPrice=money($tariff['price']);
  }
  $typeOfCalculation=configgetvalue('system', 'cash', NULL, 'typeOfCalculation');

  $discountValue=$userRow['discount'];
  if ($discountValue!=='0')
  {
    if (substr($discountValue, -1, 1)==='%')
    {
      $percents = 1-floatval(substr($discountValue, 0, -1))/100;
      $sum=money($tariffPrice*$percents);
    }
    else
    {
      $sum=money($tariffPrice)-money($discountValue);
    }
  }
  else
  {
    $sum=money($tariffPrice);
  }


  $orderTable=new table('order');
  $currentDate = new DateTime('midnight');
  $startDate = new DateTime('first day of this month midnight'); 
  $endDate = new DateTime('first day of next month midnight'); 
  $withdrawalDay=configgetvalue('system', 'cash', NULL, 'withdrawalDay');
  $withdrawalDay-=1;
  if ($withdrawalDay)
  {
    $startDate->modify("+$withdrawalDay day");
    $endDate->modify("+$withdrawalDay day");
  }
  if ($currentDate<$startDate)
  {
    $startDate->modify("-1 month");
    $endDate->modify("-1 month");
  }

  $a=$endDate->format("U") - $startDate->format("U");
  $b=$endDate->format("U") - $currentDate->format("U");

  $currentDateAsText=$currentDate->format($mysqlTimeDateFormat);
  $allOrders=$orderTable->load("WHERE user=$userId");
  $returnedOrders=$orderTable->load("WHERE user=$userId AND canceled=1 AND startdate<='$currentDateAsText' AND enddate>='$currentDateAsText'");

  $newUsersWithdrawalType=configgetvalue('system', 'cash', NULL, 'newUsersWithdrawalType');
  $newOrdersWithdrawalType=configgetvalue('system', 'cash', NULL, 'newOrdersWithdrawalType');
  $swapOrdersWithdrawalType=configgetvalue('system', 'cash', NULL, 'swapOrdersWithdrawalType');

  if (!count($allOrders) && $newUsersWithdrawalType==='nothing')
  {
    $remainsPercentage = 0;
  }
  else if (
       (!count($allOrders) && $newUsersWithdrawalType==='daily') || 
       (count($returnedOrders) && $swapOrdersWithdrawalType==='daily') || 
       (!count($returnedOrders) && $newOrdersWithdrawalType==='daily')
     )
  {
    $remainsPercentage = $b/$a;
  }
  else
  {
    $remainsPercentage = 1;
  }
  if ($full)
  {
    $remainsPercentage = 1;
  }
  return money($sum * $remainsPercentage);
}

function payment($mode, $id=false)
{
  global $db;
  global $mysqlTimeDateFormat;
  /*

      $mode
      0   payment: new cash value will be written, 'upd' action on routers
      1   shownotification: new cash value will not be writtent, 'shownotify' on routers
      2   clearnotifications: 'clearnotify' on all routers

  */
  if ($mode!==2)
  {
    if ($res = $db->query("SELECT id, price FROM ".DB_TABLE_PREFIX."tariff")->fetchAll())
    {
      $price=array();
      foreach  ($res as $row)
      {
        $price[$row['id']]=$row['price'];
      }
    }
    $typeOfCalculation=configgetvalue('system', 'cash', NULL, 'typeOfCalculation');
    $creditMonths=configgetvalue('system', 'cash', NULL, 'creditMonths');

    $routerAction= $mode ? "shownotification" : "update";
    $usersTable=new table('user');
    $usersRes=$usersTable->load($id ? "WHERE id=$id" : "");
    foreach ($usersRes as $row)
    {
      if (!isset($price[$row['tariff']])) continue;
      $tariffId=$row['tariff'];
      $userId=$row['id'];
      
      // Calculate amounts
      $cash=money($row['cash']);
      $sum=-getCashToPay($userId, $row, $price[$tariffId]);
      $fullMonthSum=-getCashToPay($userId, $row, $price[$tariffId], true );

      $newCash= $cash + $sum;

      $minimumCash=$fullMonthSum*intval($creditMonths);

      $currentOrder=getCurrentTariff($userId);

      if ($mode==0)
      {
        if ( $row['disabled']=='0' &&
             (!$currentOrder || $currentOrder['temp']==1) &&
             ($newCash>=$minimumCash || $row['credit']=='1')
           )
        {

          //Add info to payments table
          $orderTable=new table('order');
          $moneyFlowTable=new table('moneyflow');
          $currentDate = new DateTime('midnight');
          $startDate = new DateTime('first day of this month midnight'); 
          $endDate = new DateTime('first day of next month midnight'); 
          $endDate->modify("-1 sec");
          $withdrawalDay=configgetvalue('system', 'cash', NULL, 'withdrawalDay');
          $withdrawalDay-=1;
          if ($withdrawalDay)
          {
            $startDate->modify("+$withdrawalDay day");
            $endDate->modify("+$withdrawalDay day");
          }
          if ($currentDate<$startDate)
          {
            $startDate->modify("-1 month");
            $endDate->modify("-1 month");
          }
          if ($currentOrder) // Mark temp access order as expired
          {
            $orderTable->edit( array( 'id' => $currentOrder['id'], 'canceled' => 1, 'enddate' => $currentDate->format($mysqlTimeDateFormat)));
          }


          $orderId=$orderTable->add( array( 'user' => $userId, 'detailsname' => 'tariff', 'detailsid' => $tariffId, 'startdate' => $currentDate->format($mysqlTimeDateFormat), 'enddate' => $endDate->format($mysqlTimeDateFormat)));
          $moneyFlowTable->add( array( 'user' => $userId, 'detailsname' => 'order', 'detailsid' => $orderId, 'sum' => money($sum) ) );
        }
        else
        {
          controllerRouterQueue($row['router'], "update", $row['id']);
        }
      }
      else if ($mode==1)
      {
        if ( $row['disabled']=='0' && 
             ($newCash<$minimumCash && $row['credit']=='0')
           )
        {
          controllerRouterQueue($row['router'], "shownotification", $row['id']);
        }
      }
    }
  }
  else
  {
    $routerTable=new table('router');
    $routerRes=$routerTable->load($id ? "WHERE id=$id" : "");
    foreach ($routerRes as $row) controllerRouterQueue($row['id'], 'clearnotification', $id);
  }
}

function userHaveInet($id, $usersTable=false)
{
  if (!$id) return false;
  global $mysqlTimeDateFormat;
  $orderTable=new table('order');
  $td= new DateTime();
  $textTd=$td->format($mysqlTimeDateFormat);
  $orderRes=$orderTable->load("WHERE user=$id AND (`canceled`=0 OR `canceled` IS NULL) AND startdate<='$textTd' AND enddate>='$textTd'");
  if (count($orderRes)) return true;
}
function getCurrentTariff($id, $usersTable=false)
{
  if (!$id) return false;
  global $mysqlTimeDateFormat;
  $orderTable=new table('order');
  $td= new DateTime();
  $textTd=$td->format($mysqlTimeDateFormat);
  $query="WHERE user=$id AND (`canceled`=0 OR `canceled` IS NULL) AND detailsname='tariff' AND startdate<='$textTd' AND enddate>='$textTd' LIMIT 1";
  $orderRes=$orderTable->load($query);
  if (count($orderRes)) return $orderRes[0];
}
function userIsDisabled($id, $usersTable=false)
{
  global $mysqlTimeDateFormat;
  if (!$usersTable) $usersTable=new table('user');
  $row=$usersTable->loadById($id);
  if ($row)
  {
    if ($row['disabled']=='1') return true;
  }
}

$postfixes=array('K', 'M', 'G', 'T', 'P');
function toBytes($size)
{
  global $postfixes;
  if (!preg_match("%(\d+)(\w*)%", strtoupper($size), $tmp)) return false;
  $valuePart=intval($tmp[1]);
  $postPart=strlen($tmp[2]) ? pow(1024,(array_search($tmp[2][0], $postfixes)+1)) : 1;
  return ($valuePart) ? $valuePart*$postPart : false;
}
function formatBytes($bytes, $precision = 2) { 
  $units = array('', 'k', 'M', 'G', 'T'); 
  $bytes = max(toBytes($bytes), 0); 
  $pow = floor(($bytes ? log($bytes) : 0) / log(1024)); 
  $pow = min($pow, count($units) - 1); 

   $bytes /= pow(1024, $pow);

  return round($bytes, $precision) . $units[$pow]; 
}
function appendtranslation($line)
{
  if (!$line) return;
  $filename="../.locale-src/acp/strings.js";
  $strings=file_get_contents($filename);
  if ($strings)
  {
    $stringsArr=explode("\n", $strings);
    for ($i=0; $i<count($stringsArr); $i++)
    {
      $stringsArr[$i]=preg_replace('/.*["|\'](.*)["|\'].*/', '$1', $stringsArr[$i]);
    }
    if (!in_array($line, $stringsArr))
    {
      $stringsArr[]=$line;
      for ($i=0; $i<count($stringsArr); $i++)
      {
        $stringsArr[$i]='_("'.$stringsArr[$i].'");';
      }
      $strings=implode("\n", $stringsArr);
      file_put_contents($filename, $strings);
      return true;
    } else return false;
  }
}
function formatUserId0($data)
{
  return $data['id'];
}

$userIdRendererTpl=configgetvalue('system', 'grid', NULL, 'user-idrenderer-format');

function formatUserId1($data)
{
  global $userIdRendererTpl;
  return sprintf($userIdRendererTpl, $data['id']);
}

function formatUserId2($data)
{
  return $data['contractid'];
}

function formatUserId3($data)
{
  return $data['login'];
}


function checkPermission( $userId, $path=array() )
{
  global $aclCache;
  $allow=false;
  if (!$aclCache)
  {
    $masterTable= new table('master');
    $master=$masterTable->loadById( $userId );
    $userGroupId=$master['group'];

    $groupTable= new table('group');
    $group=$groupTable->loadById( $userGroupId );
    $subAcl=json_decode($group['acl'], true);
    $aclCache=$subAcl;
  }
  else
  {
    $subAcl=$aclCache;
  }

  for ($i=0; $i<count($path); $i++)
  {
    if ( gettype($subAcl)==='array' && array_key_exists( $path[$i], $subAcl) )
    {
      $subAcl=$subAcl[$path[$i]];
      if ($i+1===count($path) )
      {
        $allow=true;
        break;
      }
      if ($subAcl===true)
      {
        $allow=true;
        break;
      }
    }
    else if ($subAcl===true)
    {
      $allow=true;
      break;
    }
    else
    {
      break;
    }
  }
  return $allow;
}

$requestErrors=array();

function addRequestError( $errorText)
{
  global $requestErrors;
  array_push($requestErrors, $errorText);
}



class LicenseManager
{
  private $key;
  private $version;
  private $data;
  function __construct()
  {
    $this->loadLicenseInfo();
  }
  function loadLicenseInfo($force=false)
  {
    global $dateFormat;

    $currentDate=date($dateFormat);
    $lastCheck=configgetvalue('var', 'main', NULL, 'lastLicenseCheck');
    $storedData=configgetvalue('var', 'main', null, 'licenseData');

    if ($lastCheck!==$currentDate || !$storedData || $force)
    {
      $this->key=configgetvalue('system', 'license', null, 'key');
      $this->version=configgetvalue('var', 'version', null, 'number');
      $host='nu'.'an'.'ce-bs'.'.c'.'om';
      $port=40+40;
      $timeout=2;
      $fsockopen='fs'.'ock'.'op'.'en';
      $fp = @$fsockopen(gethostbyname($host), $port, $errno, $errstr, $timeout);

      if (is_resource($fp) )
      {
        stream_set_timeout($fp, $timeout);
        $request =  "GET /svc/license.php?key=$this->key&version=$this->version HTTP/1.0\r\n";
        $request .= "Host: $host\r\n";
        $request .= "Connection: close\r\n\r\n";
        fwrite($fp, $request);
        $res = stream_get_contents($fp);

        $info = stream_get_meta_data($fp);
        fclose($fp);

        if (!$info['timed_out']) 
        {
          $resLines=explode("\r\n", $res);
          $json=array_pop($resLines);
          configsetvalue('var', 'main', null, 'json', 'licenseData', $json);
          configsetvalue('var', 'main', NULL, 'string', 'lastLicenseCheck', $currentDate);
          $this->data=json_decode($json, true);
        }
      }
    }
    else
    {
      $this->data=$storedData;
    }
  }
  public function checkPermission($featureName)
  {
    if ($this->data)
    {
      return $this->data['restrictions'][$featureName];
    }
  }

}


class RouterStateCache extends Cache
{
  public function expireCheck()
  {
    $timeOfCachingAsString=configgetvalue('var', 'cache', null, $this->fileName);
    $timeOfCaching=new DateTime($timeOfCachingAsString);
    $currentTime=new DateTime;

    return ( $timeOfCachingAsString && 
             $timeOfCaching->modify($this->cacheTime.'min')>$currentTime 
           );
  }
  public function getData()
  {
    global $mysqlTimeDateFormat;
    $currentTime=new DateTime;
    configsetvalue('var', 'cache', null, 'string', $this->fileName, $currentTime->format($mysqlTimeDateFormat));
    if (isset($_GET['id']))
    {
      $id=intval($_GET['id']);
      return json_encode(array($id => controllerRouter($id, 'checkConnection') ));
    }
    else
    {
      $routerTable=new table('router');
      $routers=$routerTable->load();
      $statusArray=array();
      foreach ($routers as $key=>$value)
      {
        $id=$value['id'];
        $statusArray[$id]= controllerRouter($id, 'checkConnection');
      }
      return json_encode($statusArray);

    }
  }
}

class StatisticsCache extends Cache
{
  public $month;
  public function expireCheck()
  {
    global $mysqlTimeDateFormat, $sessionId;
    $masterTable=new table('master');
    $master=$masterTable->loadById($sessionId);
    $permittedCities = $master['city'];
    $permittedStreets = $master['street'];
    $permittedGroups = $master['usergroup'];

    $moneyflowTable=new table('moneyflow');

    $startDate=clone $this->month;
    $endDate=clone $this->month;
    $endDate->modify('1 month');
    $endDate->modify('-1 second');

    $offsetDays=configgetvalue('system', 'statistics', null, 'paymentsOffset');
    $startDate->modify($offsetDays.' day');
    $endDate->modify($offsetDays.' day');

    $lastRecordedId=configgetvalue('var', 'cache', null, $this->fileName);
    $condition="WHERE `date`>='".$startDate->format($mysqlTimeDateFormat)."' AND `date`<='".$endDate->format($mysqlTimeDateFormat)."' AND (`detailsname`='adminpay' OR `detailsname`='scratchcard')";
    if (pluginExists('grouprestrict') && $permittedGroups) 
    {
      $condition .= " AND ( `user` IN (SELECT `id` FROM `user` WHERE `usergroup` IN (". join($permittedGroups, ",") .") ) )";
    }
    $condition .= " ORDER BY `id` DESC LIMIT 1";
    $rows=$moneyflowTable->load($condition);
    if (count($rows))
    {
      $lastId=$rows[0]['id'];
    }
    else
    {
      $lastId=null;
    }
    return $lastRecordedId===$lastId;
  }
  public function getData()
  {
    global $mysqlTimeDateFormat, $sessionId;
    $data=array(
      "total" => 0,
      "scratchcard" => 0,
      "adminpay" =>
      array(
        "total" => 0,
        "byadmin" => array()
      )
    );

    $masterTable=new table('master');
    $master=$masterTable->loadById($sessionId);
    $permittedCities = $master['city'];
    $permittedStreets = $master['street'];
    $permittedGroups = $master['usergroup'];

    $admins=$masterTable->load();
    for ($i=0; $i<count($admins); $i++)
    {
      $data['adminpay']['byadmin'][$admins[$i]['id']]=0;
    }

    $currentTime=new DateTime;
    $moneyflowTable=new table('moneyflow');
    $startDate=clone $this->month;
    $endDate=clone $this->month;
    $endDate->modify('1 month');
    $endDate->modify('-1 second');

    $offsetDays=configgetvalue('system', 'statistics', null, 'paymentsOffset');
    $startDate->modify($offsetDays.' day');
    $endDate->modify($offsetDays.' day');

    $condition="WHERE `date`>='".$startDate->format($mysqlTimeDateFormat)."' AND `date`<='".$endDate->format($mysqlTimeDateFormat)."' AND (`detailsname`='adminpay' OR `detailsname`='scratchcard') AND `sum`>0";
    if (pluginExists('grouprestrict') && $permittedGroups) 
    {
      $condition .= " AND ( `user` IN (SELECT `id` FROM `user` WHERE `usergroup` IN (". join($permittedGroups, ",") .") ) )";
    }
    $rows=$moneyflowTable->load($condition);
    foreach ($rows as $row)
    {
      $sum=$row['sum'];
      $data['total'] += $sum;
      if ($row['detailsname']==='adminpay')
      {
        $data['adminpay']['total'] += $sum;
        if (!isset($data['adminpay']['byadmin'][$row['detailsid']]))
        {
          $data['adminpay']['byadmin'][$row['detailsid']] = 0;
        }
        $data['adminpay']['byadmin'][$row['detailsid']] += $sum;
      }
      else
      {
        $data['scratchcard'] += $sum;
      }
    }

    $lastRow=end($rows);
    configsetvalue('var', 'cache', null, 'int', $this->fileName, $lastRow['id']);
    return json_encode($data);
  }
}


?>
