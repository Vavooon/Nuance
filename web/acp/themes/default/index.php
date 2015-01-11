<!DOCTYPE html>
<html>
    <head>
        <title><?php printf(__("%s - Nuance - Admin panel"), configgetvalue('system', 'main', NULL, 'companyName')) ?></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta content='width=device-width, initial-scale=0.4, maximum-scale=1.0, user-scalable=0' name='viewport' />
        <?php
        $cssPath = realpath(__DIR__);
        if (file_exists($cssPath . "/gh-buttons.css"))
        {
            ?>
            <link rel="stylesheet" type="text/css" href="<?php echo $usertheme ?>/gh-buttons.css" />
            <link rel="stylesheet" type="text/css" href="<?php echo $usertheme ?>/style.css" />
            <link rel="stylesheet" type="text/css" href="<?php echo $usertheme ?>/style-mobile.css" />
            <link rel="stylesheet" type="text/css" href="<?php echo $usertheme ?>/style-desktop.css" />
        <?php }
        else
        { ?>
            <link rel="stylesheet" type="text/css" href="<?php echo $usertheme ?>/style.css" />
<?php } ?>
        <link rel="gettext" type="application/x-po" href="loadplugin.php?target=locale&name=<?php echo configgetvalue('system', 'main', NULL, 'acpLocale') ?>&type=po" />
        <script>
            var pluginsLoaders = [];
            var debug =<?php if (defined('DEBUG')) echo 'true';
else echo 'false'; ?>;
            var userId =<?php if (isset($sessionId) && $sessionId) echo $sessionId;
else echo '0'; ?>;
            var userName = '<?php if (isset($sessionId) && $sessionId) echo $sessionName;
        else echo ''; ?>';
        </script>
<?php
$jsPath = realpath(__DIR__ . "/../../js");
if (file_exists($jsPath . "/lib/Gettext.js"))
{
    ?>
            <script src="js/lib/Gettext.js"></script>
            <script src="js/lib/Nuance.class.js"></script>
            <script src="js/lib/date.js"></script>
        <?php } ?>
        <?php if (isset($_SESSION['user_id']))
        { ?>
            <script src="loadplugin.php?target=plugin&type=js"></script>
            <link rel="stylesheet" type="text/css" href="loadplugin.php?target=plugin&type=css" />
            <script src="js/admin.js"></script>
<?php }
else
{ ?>
            <script src="js/auth.js"></script>	
<?php } ?>
    </head>
    <body>
    </body>
</html>