<?php

session_start();
$_SESSION['id'] = 0;
session_write_close();

include_once '../../app/ucp.php';

$fenom->display($theme->getTemplateLocation('header.tpl'), $headerData);
$fenom->display($theme->getTemplateLocation('wrongdevice.tpl'));
$fenom->display($theme->getTemplateLocation('footer.tpl'));
