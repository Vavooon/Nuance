<?php

require_once "../app/core.php";
$routersTable = new Table('router');

$rows = $routersTable->load();
foreach ($rows as $row)
{
    controllerRouter($row['id'], 'export', false);
}