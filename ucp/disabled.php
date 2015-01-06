<?php

include_once '../include/ucp.php';

$fenom->display($theme->getTemplateLocation('header.tpl'), $headerData);
$fenom->display($theme->getTemplateLocation('disabled.tpl'));
$fenom->display($theme->getTemplateLocation('footer.tpl'));
?>
