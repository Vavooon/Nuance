<?php
require_once "../include/core.php";
$routersTable = new table('router');

$rows=$routersTable->load();
foreach ($rows as $row)
{
  controllerRouter($row['id'], 'export', false);
}
?>
