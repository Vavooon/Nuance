<?php

require_once "../app/core.php";
$options = getopt("", array("db-prefix:", "id:"));

if (isset($options['db-prefix']))
{
    define('DB_TABLE_PREFIX', $options['db-prefix']);
    echo "DB prefix: " . $options['db-prefix'];
}
require_once realpath(__DIR__ . "/../include/core.php");


if (isset($options['id']))
{
    $id = $options['id'];
}
else
{
    $id = false;
}
payment(1, $id);
