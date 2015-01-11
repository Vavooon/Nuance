<?php

include_once '../../app/ucp.php';

$tpl = array(
    "user" => $user
);
$fenom->display($theme->getTemplateLocation('header.tpl'), $headerData);
$fenom->display($theme->getTemplateLocation('nocosts-permanent.tpl'), $tpl);
$fenom->display($theme->getTemplateLocation('footer.tpl'));
