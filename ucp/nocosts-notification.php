<?php 

include_once '../include/ucp.php';


if (isset($_GET['ok']))
{
  header("Location: http://google.com.ua/");
  $req=$db->query("SELECT * FROM `".DB_TABLE_PREFIX."user` WHERE iplist LIKE '%\"".$_SERVER['REMOTE_ADDR']."\"%'")->fetchAll();
  $row=$req ? $req[0] : null;
  if ($row)
  {
    controllerRouterQueue($row['router'], 'clearnotification', $row['id']);
  }
  sleep(1);
}
$tpl=array(
  "user" => $user
);
$fenom->display($theme->getTemplateLocation('header.tpl'), $headerData);
$fenom->display($theme->getTemplateLocation('nocosts-notification.tpl'), $tpl);
$fenom->display($theme->getTemplateLocation('footer.tpl'));

?>
