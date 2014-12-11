<?php 

include_once '../include/ucp.php';

$companyContacts=configgetvalue('system', 'ucp', NULL, 'contactsPageText');
$companyContacts=preg_replace('%\n%', '<br>', $companyContacts);

$tpl=array(
  "contactsText" => $companyContacts
);

$fenom->display($theme->getTemplateLocation('header.tpl'), $headerData);
$fenom->display($theme->getTemplateLocation('contacts.tpl'), $tpl);
$fenom->display($theme->getTemplateLocation('footer.tpl'));

?>
