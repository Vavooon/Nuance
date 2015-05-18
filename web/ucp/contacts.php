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

$companyContacts = $config->getValue('system', 'ucp', NULL, 'contactsPageText');
$companyContacts = preg_replace('%\n%', '<br>', $companyContacts);

$tpl = array(
    "contactsText" => $companyContacts
);

$fenom->display($theme->getTemplateLocation('header.tpl'), $headerData);
$fenom->display($theme->getTemplateLocation('contacts.tpl'), $tpl);
$fenom->display($theme->getTemplateLocation('footer.tpl'));