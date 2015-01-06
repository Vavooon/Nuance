<?php

include_once '../include/ucp.php';


$mainPageText = configgetvalue('system', 'ucp', NULL, 'mainPageText');
$mainPageText = preg_replace('%\n%', '<br>', $mainPageText);

$tpl = array(
        "mainPageText" => $mainPageText
);

$fenom->display($theme->getTemplateLocation('header.tpl'), $headerData);
$fenom->display($theme->getTemplateLocation('index.tpl'), $tpl);
$fenom->display($theme->getTemplateLocation('footer.tpl'));
?>
