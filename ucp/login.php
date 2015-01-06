<?php

include_once '../include/ucp.php';
$page = 'login';
if (configgetvalue('system', 'ucp', NULL, 'IPautoLogin'))
{
    $ipUser = new User($ipRequest);
    $ipIsFound = $ipUser->isValid();
}
else
{
    $ipIsFound = false;
}
$tpl = array(
        "ipIsFound" => $ipIsFound,
        "userIsRestricted" => isset($_GET['userisrestricted']) && $_GET['userisrestricted'] === 'true',
);
$fenom->display($theme->getTemplateLocation('header.tpl'), $headerData);


if (isset($_GET['wrongloginpassword']))
{
    $fenom->display($theme->getTemplateLocation('notification.tpl'), array("className" => "error", "errorText" => __("Wrong login or password. Please try again…")));
}
else if (isset($_GET['userisrestricted']))
{
    $fenom->display($theme->getTemplateLocation('notification.tpl'), array("className" => "error", "errorText" => __("You are logged in in automatic mode. Please enter your login and password to unlock all opportunities.")));
}

$fenom->display($theme->getTemplateLocation('login.tpl'), $tpl);
$fenom->display($theme->getTemplateLocation('footer.tpl'));
?>
