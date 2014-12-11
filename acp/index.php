<?php
require_once "../include/core.php";

// Update check
//
//checkUpdate();
session_start();
$sessionId=isset($_SESSION['user_id']) ? $_SESSION['user_id'] : false;
$sessionName=isset($_SESSION['user_login']) ? $_SESSION['user_login'] : false;
session_write_close();

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
  redirect('auth.php');
}
?>
