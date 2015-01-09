<?php

require_once "../include/core.php";

if (isset($_GET['name']))
{
    $name = $_GET['name'];
}
$type = $_GET['type'];
$target = $_GET['target'];
if ($target == 'plugin' && preg_match("%^js|css$%", $type))
{
    $licenseManager = new LicenseManager;
    $allowedPlugins = $licenseManager->checkPermission('allowedPlugins');
    if ($type == 'js')
    {
        header("Content-type: application/javascript");
    }
    else
    {
        header("Content-type: text/css");
    }
    
    foreach (getPlugins() as $name)
    {
        if (in_array($name, $allowedPlugins))
        {
            $path = "../plugins/$name/acp/$name.$type";
            if (file_exists($path))
            {
                readfile($path);
            }
        }
    }
}
else if ($target == 'locale' && preg_match("%^[a-z]{2}_[A-Z]{2}$%", $name) && preg_match("%^mo|po$%", $type))
{
    $path = "../locale/$name/LC_MESSAGES/acp.$type";
    if (file_exists($path))
    {
        header("Content-type: text/plain");
        readfile($path);
    }
    else
    {
        http_response_code(404);
    }
}
else
{
    http_response_code(404);
}