#!/usr/bin/php
<?php
$options = getopt("", array("db-prefix:"));

if (isset($options['db-prefix']))
{
    define('DB_TABLE_PREFIX', $options['db-prefix']);
    echo "DB prefix: " . $options['db-prefix'];
}
require_once realpath(__DIR__ . "/../include/core.php");

$currentDay = intval(date('j'));

// Create withdrawal date
$withdrawalDay = configgetvalue('system', 'cash', NULL, 'withdrawalDay');
$withdrawalDate = new DateTime('first day of this month midnight');
$withdrawalDate->modify((intval($withdrawalDay) - 1) . ' days');

// Create notifications start date


$notificationsOffset = configgetvalue('system', 'cash', NULL, 'notificationsOffset');

$notificationsStartDate = clone $withdrawalDate;
$notificationsStartDate->modify(-$notificationsOffset . ' days');


// Crete notifications end date

$notificationsDuration = configgetvalue('system', 'cash', NULL, 'notificationsDuration');
$notificationsEndDate = clone $notificationsStartDate;
$notificationsEndDate->modify($notificationsDuration . ' days');

// Show notifications

if (configgetvalue('system', 'cash', NULL, 'showNotifications') && intval($notificationsStartDate->format('j')) === $currentDay)
{
    echo "Show notifications...";
    payment(1);
}
else if (intval($notificationsEndDate->format('j')) === $currentDay)
{
    echo "Hide notifications...";
    payment(2);
}
else
{
    echo "Withdrawal...";
    payment(0);
}