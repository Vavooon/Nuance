<?php 

include_once '../include/ucp.php';

function formatSpeed($speed)
{
  $speed=preg_match('%(\d+)(\w?)%', $speed, $result);
  if (count($result))
  {
    $speedAsNumber=$result[1];
    $speedPostfix=$result[2];
    $speedPattern="%d {$speedPostfix}bit/s";
    return sprintf ( __($speedPattern), $speedAsNumber );
  }
  else
  {
    return '';
  }
}
if (isset($_GET['city']) && intval($_GET['city']))
{
  $selectedCity=intval($_GET['city']);
}
else
{
  $selectedCity=0;
}

$tariffsTable=new table('tariff');
$tariffs=$tariffsTable->load();

$citiesTable=new table('city');
$cities=$citiesTable->load(" ORDER BY `name` ASC");


$tariffsById=array();
$tariffsByCities=array();
$citiesById=array();

// Prepare array for each city
foreach ($cities as $city)
{
  $cityId=$city['id'];
  $tariffsByCities[$cityId]=array();
  $citiesById[$cityId]=$city;
}
foreach ($tariffs as $tariff)
{
  $tariffsById[$tariff['id']]=$tariff;
}


if ($user->isValid() && $user->getField('city') && configgetvalue('system', 'ucp', NULL, 'showTariffsOnlyFromUsersCity'))
{
  $checkCity=true;
}
else
{
  $checkCity=false;
}
$speedRows=array('upspeed', 'downspeed', 'nightupspeed', 'nightdownspeed');
if ( configgetvalue('system', 'ucp', NULL, 'groupTariffsByCities')) 
{
  foreach ($tariffs as $tariff)
  {
    $tariffCities=$tariff['city'];
    foreach ($tariffCities as $tariffCity)
    {
      if (  $tariff['public']=='1' && 
           (!$checkCity || $user->getField('city')==$tariffCity) &&
           (!$selectedCity || $selectedCity==$tariffCity)
         )
      {

        $tariffCopy=$tariff;
        foreach ($speedRows as $row)
        {
          $tariffCopy[$row]=formatSpeed($tariffCopy[$row]);
        }
        $tariffCopy['price']=formatCash($tariffCopy['price']);
        $tariffsByCities[$tariffCity][]=$tariffCopy;
      }
    }
  }
}
else
{
  foreach ($tariffs as $tariff)
  {
    if (  $tariff['public']=='1')
    {
      $tariffCities=$tariff['city'];
      $tariffCopy=$tariff;
      foreach ($speedRows as $row)
      {
        $tariffCopy[$row]=formatSpeed($tariffCopy[$row]);
      }
      $tariffCopy['price']=formatCash($tariffCopy['price']);
      $tariffsByCities[0][]=$tariffCopy;
    }
  }
}

function sortByPrice($a, $b)
{
  global $tariffsById;
  return $tariffsById[$b['id']]['price'] < $tariffsById[$a['id']]['price'];
  //return $b['price'] < $a['price'];
}
foreach ($tariffsByCities as $city => $tariffsByCity)
{
  uasort($tariffsByCities[$city], substr("sortByPrice(", 0, -1) );
}


$tpl=array(
  "nameText" => __('Name'),
  "downloadSpeedText" => __('Download speed'),
  "uploadSpeedText" => __('Upload speed'),
  "nightDownloadSpeedText" => __('Night download speed'),
  "nightUploadSpeedText" => __('Night upload speed'),
  "priceText" => __("Price"),
  "citiesById" => $citiesById,
  "tariffsByCities" => $tariffsByCities
);

$fenom->display($theme->getTemplateLocation('header.tpl'), $headerData);
if (pluginExists('night')) 
{
  $fenom->display($theme->getTemplateLocation('notification.tpl'), 
    array(
      "className"=> "tip",
      "errorText" => sprintf( __("Night rates are valid from %s to %s"), configgetvalue('system', 'tariff', NULL, 'nightHourStart'), configgetvalue('system', 'tariff', NULL, 'nightHourEnd') )
    )
  );
}
$fenom->display($theme->getTemplateLocation('tariffs.tpl'), $tpl);
$fenom->display($theme->getTemplateLocation('footer.tpl'));

?>
