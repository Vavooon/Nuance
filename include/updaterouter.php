<?php

include_once "/core.php";

$routerId = $argv[1];
$mode = $argv[2];
if (isset($argv[3]))
{
    $userId = $argv[3];
}
else
{
    $userId = false;
}

echo controllerRouterReal($routerId, $mode, $userId);
?>