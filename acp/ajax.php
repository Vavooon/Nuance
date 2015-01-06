<?php
require_once "../include/core.php";
session_start();
$sessionId=isset($_SESSION['user_id']) ? $_SESSION['user_id'] : false;
session_write_close();
if ($sessionId)
{
  if (!isset($_GET["action"])) return;
	$action=$_GET["action"];
	switch ($action)
	{
		case 'dbadd':
    case 'dbedit':
    case 'dbremove':
    {
      $methodAction=substr($action, 2);
      $target=$_GET['target'];
      if ($target==='moneyflow')
      {
        $aclTarget='order';
      }
      else
      {
        $aclTarget=$target;
      }
      if (
        tableExists($target) &&
        (isset($_POST['id']) || $action==='dbadd') &&
        checkPermission( $sessionId, array ('table', $aclTarget, $methodAction) )
      )
      {
        if ($action!=='dbadd')
        {
          $id=intval($_POST['id']);
        }
        $table=new table($target, $response);


        $data=array();
        foreach ($_POST as $key => $value)
        {
          $data[$key]=$value;
        }
        // Additional permissions checks for every field
        if ($action==='dbedit')
        {
          foreach ($data as $key => $value)
          {
            if ( $key!=='id' && !checkPermission($sessionId,  array('table', $target, 'edit', $key) ) )
            {
              unset($data[$key]);
            }
          }
        }

        // Extract cash difference from user and proceed as moneflow
        if ($target=='user' && ($action=='dbedit' || $action=='dbadd' ) && isset($data['cash']) )
        {
          unset($data['cash']);
        }

        switch ($action)
        {
          case 'dbadd':
            $id=$table->add($data);
          break;
          case 'dbedit':
            $id=$table->edit($data);
          break;
          case 'dbremove':
            $id=$table->delete($data);
          break;
        }

        if ($target=='user' && ($action=='dbedit' || $action=='dbadd' ) && isset($_POST['cash']) && checkPermission($sessionId,  array('table', $target, 'edit', 'cash') ))
        {
          if ($action==='dbedit')
          {
            $user=$table->loadById($id);

            $sum=money($_POST['cash']) - money($user['cash']);
          }
          else
          {
            $sum=money($_POST['cash']);
          }

          if ($sum)
          {
            $moneyflowTable=new table('moneyflow');
            $moneyflowTable->add(
              array (
                "user"        => $id,
                "sum"         => $sum,
                "detailsname" => "adminpay",
                "detailsid"   => $sessionId,
              )
            );
          }
          payment(0, $id);
        }

        if ($id)
        {
          $table->load4AJAX(" WHERE id=$id");
        }
        $res=$db->query("SELECT COUNT(*) FROM `".DB_TABLE_PREFIX.$target."`");
        $row=$res->fetch();
        $response->length=intval($row['COUNT(*)']);

        foreach ($response->header as $key => $value)
        {
          if ($value[1]==='timestamp')
          {
            $columnName=$value[0];
            $res=$db->query("SELECT `id` FROM `".DB_TABLE_PREFIX.$target."` ORDER BY `".$columnName."`");
            $rows=$res->fetchAll();
            $response->sortOrder[$columnName]=array();
            for ($i=0; $i<count($rows); $i++)
            {
              $response->sortOrder[$columnName][]=$rows[$i]['id'];
            }
          }
        }

        $response->errors = array_merge($response->errors, $requestErrors);
      }
      else
      {
        if ( !checkPermission( $sessionId, array ('table', $aclTarget, $methodAction) ) )
        {
          $response->errors[] = 'deny';

        }
      }
    }
    break;
		case 'dblist':
    {
      $target=$_GET['target'];
      if (tableExists($target) )
      {
        $filter=$_GET["filter"];
        if (!checkPermission( $sessionId, array ('table', $target, 'read') ) )
        {
          $response->header=getFields($target);
          $response->errors[]='deny';
        }
        else
        {
          $table=new table($target, $response);
          $filterQuery='';

          // Apply filters for users
          $masterTable=new table('master');
          $master=$masterTable->loadById($sessionId);
          $permittedCities = $master['city'];
          $permittedStreets = $master['street'];

          if ($filter!=='*')
          {
            if (preg_match('/(\w+)([<>]?=?)([\da-zA-Z0-9\-]+)/', $filter, $filterArray))
            {
              $filterQuery="`".$filterArray[1]."`".$filterArray[2]."'".$filterArray[3]."'";
            }
          }

          if ($target==='user')
          {
            if (count($permittedCities))
            {
              if (strlen($filterQuery))
              {
                $filterQuery .= " AND ";
              }
              $filterQuery .= " (";
              for ($i=0; $i<count($permittedCities); $i++)
              {
                $filterQuery .= "`city`=".$permittedCities[$i];
                if ($i!==count($permittedCities)-1)
                {
                  $filterQuery .= " OR ";
                }
              }
              $filterQuery .= ")";
            }
            if (count($permittedStreets))
            {
              if (strlen($filterQuery))
              {
                $filterQuery .= " AND ";
              }
              $filterQuery .= " (";
              for ($i=0; $i<count($permittedStreets); $i++)
              {
                $filterQuery .= "`street`=".$permittedStreets[$i];
                if ($i!==count($permittedStreets)-1)
                {
                  $filterQuery .= " OR ";
                }
              }
              $filterQuery .= ")";
            }
          }

          
          if (strlen($filterQuery))
          {
            $filterQuery = "WHERE ".$filterQuery;
          }

          $table->load4AJAX($filterQuery);

          if ($filter==='*')
          {
            $response->length=count($response->data);
          }
          else
          {
            $res=$db->query("SELECT COUNT(*) FROM `".DB_TABLE_PREFIX.$target."`".$filterQuery);
            $row=$res->fetch();
            $response->length=intval($row['COUNT(*)']);
          }

          foreach ($response->header as $key => $value)
          {
            if ($value[1]==='timestamp')
            {
              $columnName=$value[0];
              $res=$db->query("SELECT `id` FROM `".DB_TABLE_PREFIX.$target."` ORDER BY `".$columnName."`");
              $rows=$res->fetchAll();
              $response->sortOrder[$columnName]=array();
              for ($i=0; $i<count($rows); $i++)
              {
                $response->sortOrder[$columnName][]=$rows[$i]['id'];
              }
            }
          }


          $response->errors = array_merge($response->errors, $requestErrors);
        }
      }
    }
    break;
    case 'dirlist':
    {
      $target=$_GET['target'];
      $checkFn=false;
      switch ($target)
      {
        case 'acptheme':
        case 'ucptheme':
        {
          $domain=substr($target, 0, 3);
          $target=strtolower(substr($target, 3));
          $checkFn=function($el)
          {
            return true;
          };
        }
        $response->header=array(array('id','id'),array('name','varchar'));
        $response->success=true;
        $response->data=getDirsAsStore("../$domain/".$target."s", $checkFn);
        break;

        case 'acplocale':
        case 'ucplocale':
        {
          $domain=substr($target, 0, 3);
          $target=strtolower(substr($target, 3));
          $checkFn=function($el)
          {
            global $target, $domain;
            if (file_exists("../$target/$el/LC_MESSAGES/$domain.mo") || file_exists("../$target/$el/LC_MESSAGES/$domain.po")) return true;
          };
        }
        $response->header=array(array('id','id'),array('name','varchar'));
        $response->success=true;
        $response->data=getDirsAsStore("../$target", $checkFn);
        break;
      }
    }
    break; 
    case 'routergetmac':
		
		$response->header=array(array('ip', 'ip'), array('mac', 'mac'));
    $mac=controllerRouter($_POST['router'], "getmac", $_POST['ip']);
		if ($mac)
		{
      $response->data[]=array($_POST['ip'], $mac);
		};
		$response->success=true;
		break;

    case 'getstatistics':
      require_once '../include/statistics.php';
      $statistics=new PaymentStatistics;
      $response=$statistics->getStatistics();
    break;

    case 'getcashtopay':
      $userId=$_GET['id'];
      $cashToPay=getCashToPay($userId);
      $fullCashToPay=getCashToPay($userId, false, false, true);
      $response->data=array("partial" => $cashToPay, "full" => $fullCashToPay);
    break;

    case 'routeronline':
      $response->header=array(array('ip', 'ip'), array('router', 'id'));
      $response->data=array();


      $routerTable=new table('router');
      $routers=$routerTable->load();
      foreach ($routers as $key=>$value)
      {
        $id=$value['id'];
        $onlineUsers= controllerRouter($id, 'getonline');
        if (is_array($onlineUsers ))
        {
          foreach ($onlineUsers as $ip) $response->data[$ip]=array($ip, $id);
        }
      }

      $response->success=true;
    break;

    case 'documentupload':
    {
      if (isset($_POST['index']))
      {
        $index=intval($_POST['index']);
      }
      else
      {
        $index=-1;
      }
      if ( isset($_FILES['file'])   &&
          $_FILES['file']['size']>0 &&
          $_FILES['file']['error']==0 )
      {
        $fileExists=true;
        $fileName = $_FILES['file']['name'];
      }
      else
      {
        $fileName = '';
        $fileExists=false;
      }
      $documents=configgetvalue('system', 'ucp', NULL, 'documents');
      if ($index!==-1) // Edit existing data
      {
        if (isset($documents[$index]))
        {
          $documents[$index]['name']=$_POST['name'];
          $documents[$index]['forceDownload']=$_POST['forceDownload']==='true';
          $documents[$index]['description']=$_POST['description'];
          $fileName= mb_convert_encoding($fileName, "UTF-8");
          if ($fileExists && move_uploaded_file($_FILES['file']['tmp_name'], UPLOADED_FILES_PATH . $fileName))
          {
            $documents[$index]['fileName']=$fileName;
          }
        }
      }
      else
      {
        $fileName= mb_convert_encoding($fileName, "UTF-8");
        if ($fileExists && move_uploaded_file($_FILES['file']['tmp_name'], UPLOADED_FILES_PATH . $fileName))
        {
          array_push(
            $documents,
            array
            (
              "name"           => $_POST['name'],
              "fileName"       => $fileName,
              "forceDownload"  => $_POST['forceDownload']==='true',
              "description"    => $_POST['description']
            )
          );
        }
      }


      configsetvalue('system', 'ucp', NULL, 'json', 'documents', json_encode($documents) );


      die();


    }
    break;  
    case 'routergetinterfaces':
      $routerId=$_GET['router'];
      if (!$routerId) return;
      $response->data=controllerRouter($routerId, 'getinterfaces');
      $response->header=array(array('id', 'varchar'), array('name', 'varchar'));
      $response->success=true;
    break;
    case 'routercheckconnection':
      

    break;
    case 'routerexport':
      if (!isset($_GET['router'])) return;
      $routerId=$_GET['router'];
      if ($routerId!='*')
      {
        $response->success=controllerRouter($routerId, "export");
      }
      else
      {
      // Sync all routers
        $routersTable = new table('router');
        $rows=$routersTable->load();
        foreach ($rows as $row)
        {
          controllerRouter($row['id'], 'export', false);
        }
        $response->success=true;
      }
		break;
    case 'configlist':


    break;
    case 'getacl':
    {

      
    }
    break;
    case 'getstatimage':
    {
      if ( checkPermission($sessionId,  array('statistics') ) )
      {
        $routerId=$_GET['router'];
        $path=str_replace(' ', '%20', $_GET['path']);
        $routerTable=new table('router');
        $res=$routerTable->load("WHERE id=$routerId");
        if ($row=$res[0])
        {
          $address=$row['ip'];
          $port=configgetvalue('router', 'main', $routerId, 'statPort');
          $url="http://$address:$port/$path.gif";
          header("Content-Type:image/gif");
          $img=file_get_contents($url);
          header("Content-Length:".strlen($img));
          echo $img;
        }
      }
      return;
    };
    break;
    case 'configedit':
     
    break;
    case 'addtranslationline':
      appendtranslation($_GET['line']);
      $response->success=true;
    break;
    case 'updatelicenseinfo':
      $licenseManager=new LicenseManager;
      $licenseManager->loadLicenseInfo(true);
      $response->success=true;
    break;
    case 'gettimezone':
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
      
      $response->header=array(array('id', 'varchar'), array('name', 'varchar'));
      $response->data=$assocTzlist;
      $response->success=true;
    break;
    case 'generatescratch':
      //$response=new response;
      if (!isset($_GET['count']) && !isset($_GET['value']) && !intval($_GET['count']) && !intval($_GET['value'])) $response->success=false;
      loadPlugin('acp', 'scratchcard');
      $sc=new ScratchCard($response);
      $sc->generate(intval($_GET['count']), intval($_GET['value']));
      $response=$sc->response;
    break;
    case 'getschema':
      loadPlugin('acp', 'schemacompare');
      $sc=new schemacompare;
      $response->header=
      array
      (
        "databasePrefix" => DB_TABLE_PREFIX
      );
      $response->data=$sc->getSchema();
    break;
    case 'shownotifications':
      payment(1); return;
    break;
    case 'clearnotifications':
      payment(2); return;
    break;
    case 'payment':
      payment(0); return;
    break;
    case 'logout':
      session_destroy(); return;
    break;
  
	}
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
else
{
	header('HTTP/1.0 401 Unauthorized', true, 401);
}


?>
