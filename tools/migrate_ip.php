<?php

require_once "../include/core.php";

$routerTable = new table('router');
$userTable = new table('user');
$pppTable = new table('ppp');
$ipTable = new table('ip');


$routers = $routerTable->load();
$users = $userTable->load();


$routerTypes = array();

for ($i=0; $i<count($routers); $i++) 
{
  $routerTypes[$routers[$i]['id']] = $routers[$i]['routertype'];
}

for ($i=0; $i<count($users); $i++) 
{
  $user = $users[$i];
  $ipListString = $user['iplist'];
  $routerId = $user['router'];
  $routerType = $routerTypes[$routerId];

  $ipList = json_decode($ipListString, true);

  if (json_last_error()) return;

  if ($routerType === 'mikrotikppp')
  {
    $ip = array_keys($ipList);
    $pppTable->add(
      array(
          "user" => $user['id']
        , "router" => $routerId
        , "login" => $user['login']
        , "password" => $user['password']
        , "localip" => $ip[0]
        , "remoteip" => $ip[1]
      )
    );
  }
  else
  {
    foreach ($ipList as $ip => $mac)
    {
      $ipTable->add(
        array(
            "user" => $user['id']
          , "router" => $routerId
          , "ip" => $ip
          , "mac" => $mac
        )
      );
    }
  }
}

?>
