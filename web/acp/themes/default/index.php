<!DOCTYPE html>
<html>
    <head>
        <title><?php printf(__("%s - Nuance - Admin panel"), configgetvalue('system', 'main', NULL, 'companyName')) ?></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta content='width=device-width, initial-scale=0.4, maximum-scale=1.0, user-scalable=0' name='viewport' />
        <?php
        $cssPath = realpath(__DIR__);
        ?>
        <link rel="stylesheet" type="text/css" href="<?php echo $usertheme ?>/css/gh-buttons.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo $usertheme ?>/css/reset.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo $usertheme ?>/css/style.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo $usertheme ?>/css/style-mobile.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo $usertheme ?>/css/style-desktop.css" />
        <link rel="gettext" type="application/x-po" href="locale/<?php echo configgetvalue('system', 'main', NULL, 'acpLocale') ?>/LC_MESSAGES/acp.po" />
        <script>
            <?php
            echo "\nvar pluginsLoaders = [];\n";
            echo "var debug = " . (defined('DEBUG') ? 'true' : 'false') . ";\n";
            echo "var userId = " . ((isset($sessionId) && $sessionId) ? $sessionId : '0') . ";\n";
            echo "var userName = '" . ((isset($sessionId) && $sessionId) ? $sessionName : '') . "';\n";
            ?>
        </script>
        <?php
        $jsPath = realpath(__DIR__ . "/../../js");
        ?>
        <script src="js/lib/Gettext.js"></script>
        <script src="js/lib/Nuance.class.js"></script>
        <script src="js/lib/date.js"></script>
        <?php
        if (isset($_SESSION['user_id']))
        {
        ?>
        <script src="plugins.js"></script>
        <link rel="stylesheet" type="text/css" href="plugins.css" />
        <script src="js/admin.js"></script>
        <?php
        }
        else
        {
        ?>
            <script src="js/auth.js"></script>
        <?php
        }
        ?>

    </head>
    <body>
    </body>
</html>
