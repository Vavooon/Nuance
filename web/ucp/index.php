<?php

include_once '../../app/ucp.php';
include_once 'Fenom.class.php';

use Fenom\Provider;

$fenom = new Fenom(new Provider('../ucp/themes'));
$fenom->setCompileDir('../../cache');

if (defined('DEBUG'))
{
    $fenom->setOptions(Fenom::AUTO_RELOAD);
}

$mainPageText = configgetvalue('system', 'ucp', NULL, 'mainPageText');
$mainPageText = preg_replace('%\n%', '<br>', $mainPageText);

$tpl = array(
    "mainPageText" => $mainPageText
);

$fenom->display($theme->getTemplateLocation('header.tpl'), $headerData);
$fenom->display($theme->getTemplateLocation('index.tpl'), $tpl);
$fenom->display($theme->getTemplateLocation('footer.tpl'));