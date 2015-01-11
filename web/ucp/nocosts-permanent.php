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

$tpl = array(
    "user" => $user
);
$fenom->display($theme->getTemplateLocation('header.tpl'), $headerData);
$fenom->display($theme->getTemplateLocation('nocosts-permanent.tpl'), $tpl);
$fenom->display($theme->getTemplateLocation('footer.tpl'));
