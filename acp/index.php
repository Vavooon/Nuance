<?php
require_once "../include/core.php";

// Update check
//
//checkUpdate();
session_start();
$sessionId=isset($_SESSION['user_id']) ? $_SESSION['user_id'] : false;
$sessionName=isset($_SESSION['user_login']) ? $_SESSION['user_login'] : false;
session_write_close();

$router->map('GET','/', function () use ($usertheme, $sessionId, $sessionName)
{

  $browser=getBrowser();
  $supportedBrowsers=array(
    'Firefox' => 11,
    'Chrome'  => 17,
    'Opera'   => 15,
    'Safari'  => 4
  );
  $browserVersion=intval($browser['majorVersion']);
  $browserFullName=($browser['name']=="Unknown") ? '' : $browser['fullName'];
  checkUpdate();
  $licenseManager=new LicenseManager;
  $allowedPlugins=$licenseManager->checkPermission('allowedPlugins');
  loadLocale ( 'acp' );
  if (!array_key_exists($browser['name'], $supportedBrowsers))
  {
    require_once $usertheme."/unsupportedbrowser.php";
  }
  else if ($supportedBrowsers[$browser['name']]>$browserVersion)
  {
    require_once $usertheme."/deprecatedbrowser.php";
  }
  else if ($sessionId)
  {
    require_once $usertheme."/index.php";
  }
  else
  {
    redirect('auth');
  }
});



$response = array_merge(array(), $responseTemplate);

/*    Database    */

$router->map('GET','/db/[a:name]/get', function ($params)
  {
    $db = new DB();
    $db->get($params);
  }
);

$router->map('POST','/db/[a:name]/add', function ($params)
  {
    global $response;
    $db = new DB();
    $db->add($params);

    if ( isset( $response['db']['order']) ) 
    {
      $response['db']['activeorder'] = $response['db']['order'];
    }
  }
);

$router->map('POST','/db/[a:name]/set', function ($params)
  {
    $db = new DB();
    $db->set($params);

    if ( isset( $response['db']['order']) ) 
    {
      $response['db']['activeorder'] = $response['db']['order'];
    }
  }
);

$router->map('POST','/db/[a:name]/del', function ($params)
  {
    $db = new DB();
    $db->del($params);
  }
);
/*    Config    */

$router->map('GET','/config/get', function ($params)
  {
    $db = new Config($params);
    $db->get($params);
  }
);

$router->map('POST','/config/add', function ($params)
  {
    $db = new Config($params);
    $db->add($params);
  }
);

$router->map('POST','/config/set', function ($params)
  {
    $db = new Config($params);
    $db->set($params);
  }
);

$router->map('POST','/config/del', function ($params)
  {
    $db = new Config($params);
    $db->remove($params);
  }
);


/*    Router interfacec    */

$router->map('GET','/interface/[i:id]/get', function ($params)
  {
    global $response;
    $routerId = $params['id'];
    if (!$routerId) return;
    $response['interface'] = array(
      $routerId => array(
          "header" => array(array('id', 'varchar'), array('name', 'varchar'))
        , "data" => controllerRouter($routerId, 'getinterfaces')
      )
    );
  }
);



/*    Statistics    */

$router->map('GET','/statistics/[a:name]/get', function ($params)
  {
    $db = new Statistics($params);
    $db->get($params);
  }
);


/*    Cash to pay    */

$router->map('GET','/cashtopay/get', function ($params)
  {
    global $response;
    $userId=$_GET['id'];
    $cashToPay=getCashToPay($userId);
    $fullCashToPay=getCashToPay($userId, false, false, true);
    $response['cashtopay'] = array();
    $response['cashtopay'][$userId]=array("partial" => $cashToPay, "full" => $fullCashToPay);
  }
);

/*    Get all data */

$router->map('GET','/all/get', function ($params)
  {
    global $response, $mysqlTimeDateFormat;
    $db = new Config($params);
    $db->get($params);

    $db = new Statistics($params);
    $db->get($params);

    $db = new DB();
    $db->get(array('name' => '*'));

    $skipTables = array(
      'moneyflow', 'order', 'log'
    );
    for ($i=0; $i<count($skipTables); $i++)
    {
      if ($skipTables[$i] === $_GET['activetab'] )
      {
        $db->get(array('name' => $skipTables[$i] ));
      }
      else
      {
        $db->get(array('name' => $skipTables[$i], 'filter' => 'id=0' ));
      }
    }

    $db->get(array('name' => 'order', 'filter' => 'enddate>'.date($mysqlTimeDateFormat) ));
    $response['db']['activeorder'] = $response['db']['order'];
    unset( $response['db']['order'] );

    $db = new ACL();
    $db->get();








    // Load runtime: available locales, themes and timezone list

    global $newTarget, $domain;
    $response['runtime']=array();
    $targets = array( 'acplocale', 'ucplocale', 'acptheme', 'ucptheme' );
    for ($i=0; $i<count($targets); $i++)
    {
      $target = $targets[$i];
      $response['runtime'][$target]=array();
      $response['runtime'][$target]['header']=array(array('id','id'),array('name','varchar'));

      $domain=substr($target, 0, 3);
      $newTarget=strtolower(substr($target, 3));
      $checkFn=function($el)
      {
        return true;
      };
      switch ($target)
      {
        case 'acptheme':
        case 'ucptheme':
          $response['runtime'][$target]['data']=getDirsAsStore("../$domain/".$newTarget."s", $checkFn);
        break;

        case 'acplocale':
        case 'ucplocale':
          $checkFn=function($el)
          {
            global $newTarget, $domain;
            if (file_exists("../$newTarget/$el/LC_MESSAGES/$domain.mo") || file_exists("../$newTarget/$el/LC_MESSAGES/$domain.po")) return true;
          };
          $response['runtime'][$target]['data']=getDirsAsStore("../$newTarget", $checkFn);
        break;
      }
    }

    $tzlist=array();
    $assocTzlist=array();
    $regions = array(
        'Africa' => DateTimeZone::AFRICA,
        'America' => DateTimeZone::AMERICA,
        'Antarctica' => DateTimeZone::ANTARCTICA,
        'Asia' => DateTimeZone::ASIA,
        'Atlantic' => DateTimeZone::ATLANTIC,
        'Australia' => DateTimeZone::AUSTRALIA,
        'Europe' => DateTimeZone::EUROPE,
        'Indian' => DateTimeZone::INDIAN,
        'Pacific' => DateTimeZone::PACIFIC
    );

    foreach ($regions as $name => $mask) {
      $tzlist=array_merge($tzlist, DateTimeZone::listIdentifiers($mask));
    };
    sort($tzlist);
    foreach ($tzlist as $name => $value) {
      $assocTzlist[$value]=array($value, $value);
    }

    $response['runtime']['timezone']['header']=array(array('id', 'varchar'), array('name', 'varchar'));
    $response['runtime']['timezone']['data']=$assocTzlist;


  }
);

$match = $router->match();

// Run matched route controller
if ($match['target'] )
{
  $match['target']($match['params']);



  /*    Show response   */

  //`if (count($response)>3)
  {
    if (function_exists('getallheaders') )
    {
      $headers=getallheaders();
      if(count($headers) && isset($headers['X-Requested-With']) && $headers['X-Requested-With']==='XMLHttpRequest')
      {
        if (!headers_sent()) header('Content-type: application/json');
        echo "\n".json_encode($response);
      }
      else
      {
        var_dump($response);
      }
    }
    else
    {
      if (!headers_sent()) header('Content-type: application/json');
      echo "\n".json_encode($response);
    }
  }
}
else
{
  if (!headers_sent())
  {
    header("HTTP/1.0 404 Not Found");
  }
  else 
  {
    echo "404 Not Found.";
  }
}
//echo json_encode($response);
?>
