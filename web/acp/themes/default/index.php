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
            <link rel="stylesheet" type="text/css" href="<?php echo $usertheme ?>/css/reset.css" />
            <link rel="stylesheet" type="text/css" href="<?php echo $usertheme ?>/css/style.css" />
            <link rel="stylesheet" type="text/css" href="<?php echo $usertheme ?>/css/style-mobile.css" />
            <link rel="stylesheet" type="text/css" href="<?php echo $usertheme ?>/css/style-desktop.css" />
            <?php
        }
        else
        {
            ?>
            <link rel="stylesheet" type="text/css" href="<?php echo $usertheme ?>/css/style.css" />
            <?php
        }
        ?>
        <link rel="gettext" type="application/x-po" href="loadplugin.php?target=locale&name=<?php echo configgetvalue('system', 'main', NULL, 'acpLocale') ?>&type=po" />
        <script>
            <?php
            echo 'var pluginsLoaders = [];';
            echo 'var debug = ' . (defined('DEBUG') ? 'true' : 'false') . ';';
            echo 'var userId = ' . ((isset($sessionId) && $sessionId) ? $sessionId : '0') . ';';
            echo 'var userName = \'' . ((isset($sessionId) && $sessionId) ? $sessionName : '') . '\';';
            ?>
        </script>
            <?php
            $jsPath = realpath(__DIR__ . "/../../js");
            if (file_exists($jsPath . "/lib/Gettext.js"))
            {
                echo '<script src="js/lib/Gettext.js"></script>';
                echo '<script src="js/lib/Nuance.class.js"></script>';
                echo '<script src="js/lib/date.js"></script>';
            }
            
            if (isset($_SESSION['user_id']))
            {
                echo '<script src="loadplugin.php?target=plugin&type=js"></script>';
                echo '<link rel="stylesheet" type="text/css" href="loadplugin.php?target=plugin&type=css" />';
                echo '<script src="js/admin.js"></script>';
            }
            else
            {
                echo '<script src="js/auth.js"></script>';
            }
            ?>
    </head>
    <body>
    </body>
</html>