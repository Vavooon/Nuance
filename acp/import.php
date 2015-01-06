<?php

require_once "../include/core.php";
$cities = $db->query("SELECT * FROM `mesh_city`")->fetchAll();
$streets = $db->query("SELECT * FROM `mesh_street`")->fetchAll();
$tariffs = $db->query("SELECT * FROM `mesh_tariff`")->fetchAll();
$users = $db->query("SELECT * FROM `mesh_user`")->fetchAll();

$citiesByNames = array();
$streetsByNames = array();
$tariffsByNames = array();

foreach ($cities as $cityId => $city)
{
    $citiesByNames[$city['name']] = $city;
}

foreach ($streets as $streetId => $street)
{
    $streetsByNames[$street['name'] . "_" . $street['city']] = $street;
}


foreach ($tariffs as $tariffId => $tariff)
{
    $tariffsByNames[$tariff['name']] = $tariff;
}


/* USERS CITY
  foreach ($users as $id => $user )
  {
  $cityName = $user['cityname'];
  $userId= $user['id'];
  if ( isset ($citiesByNames[$cityName]) )
  {
  d ( $userId." > ".$cityName ." = " .$citiesByNames[$cityName]['id'] );
  d ( "update `mesh_user` set `city`=".$citiesByNames[$cityName]['id']." where `id`=".$userId );
  $db->query ("update `mesh_user` set `city`=".$citiesByNames[$cityName]['id']." where `id`=".$userId)->fetchAll();
  }
  }
  foreach ($streets as $id => $street )
  {
  $cityName = $street['city'];
  $streetId= $street['id'];
  if ( isset ($citiesByNames[$cityName]) )
  {
  d ( $streetId." > ".$cityName ." = " .$citiesByNames[$cityName]['id'] );
  $db->query ("update `mesh_street` set `city`=".$citiesByNames[$cityName]['id']." where `id`=".$streetId);
  }
  }


  foreach ($users as $id => $user )
  {
  $streetName = $user['streetname']."_".$user['city'];
  $userId= $user['id'];
  if ( isset ($streetsByNames[$streetName]) && $user['city']===$streetsByNames[$streetName]['city'] )
  {
  d (  $user['city']." === ".$streetsByNames[$streetName]['city']  );
  d ( $userId." > ".$streetName ." = " .$streetsByNames[$streetName]['id'] );
  $db->query ("update `mesh_user` set `street`=".$streetsByNames[$streetName]['id']." where `id`=".$userId);
  }
  }



  foreach ($users as $id => $user )
  {
  $tariffName = $user['tariffname'];
  $userId= $user['id'];
  if ( isset ($tariffsByNames[$tariffName]) )
  {
  d ( $userId." > ".$tariffName ." = " .$tariffsByNames[$tariffName]['id'] );
  d ( "update `mesh_user` set `tariff`=".$tariffsByNames[$tariffName]['id']." where `id`=".$userId );
  $db->query ("update `mesh_user` set `tariff`=".$tariffsByNames[$tariffName]['id']." where `id`=".$userId);
  }
  }




  foreach ($users as $id => $user )
  {
  $loc = $user['houseflat'];
  $userId= $user['id'];

  $pos = strpos($loc, '/');

  if ( $pos!==false )
  {
  $query = "update `mesh_user` set `house`='".substr($loc, 0, $pos) ."',`flat`='".substr($loc, $pos+1)."' where `id`=".$userId;

  //
  }
  else
  {
  $query = "update `mesh_user` set `house`='".$loc."' where `id`=".$userId;
  }
  d($query);
  $db->query ($query);
  }



  foreach ($users as $id => $user )
  {
  $ip = $user['ip'];
  $mac = str_replace(':', '', $user['mac']);
  $userId= $user['id'];

  $iplist = '{"'.$ip.'":"'.$mac.'"}';


  $query = "update `mesh_user` set `iplist`='".$iplist."' where `id`=".$userId;
  d($query);
  $db->query ($query);
  }




  foreach ($users as $id => $user )
  {
  $userId= $user['id'];
  $name = $user['name'];

  $nameArray=explode(' ', $name);



  $query = "update `mesh_user` set `sname`='".$nameArray[0]."', `fname`='".$nameArray[1]."', `pname`='".$nameArray[2]."' where `id`=".$userId;
  //d($query);
  $db->query ($query);
  }





  foreach ($users as $id => $user )
  {
  $userId= $user['id'];
  $phone = str_replace('-', '', $user['phone']);
  if ($phone)
  {
  $query = "update `mesh_user` set `phone`='+".$phone."' where `id`=".$userId;
  d($query);
  $db->query ($query);
  }
  }
 */

$orderTable = new table('order');

foreach ($users as $id => $user)
{
    $userId = $user['id'];

    $query = "INSERT INTO `mesh_order` (`user`, `detailsname`, `detailsid`, `canceled`, `temp`, `date`, `startdate`, `enddate`) VALUES (" . $userId . ", 'tariff', " . $user['tariff'] . ", 0, 0, '2014-01-15 20:13:58', '2014-01-15 00:00:00', '2014-02-14 23:59:59');";

    d($query);
    $db->query($query);
}
?>
