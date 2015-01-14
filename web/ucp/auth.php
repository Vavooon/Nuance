<?php

include_once '../../app/ucp.php';
include_once 'Fenom.class.php';

use Fenom\Provider;

$fenom = new Fenom(new Provider('../ucp/themes'));
$fenom->setCompileDir('../../cache');

if (defined('DEBUG'))
{
    $fenom->setOptions(Fenom::AUTO_RELOAD);
}

session_start();
if (isset($_POST["action"]))
{
    switch ($_POST["action"])
    {
        case 'login':
            if (isset($_POST["login"]) && isset($_POST["password"]))
            {
                $authData = array('login' => $_POST['login'], 'password' => $_POST['password']);
                $prep = $db->prepare("SELECT id FROM " . DB_TABLE_PREFIX . "user WHERE login=:login AND password=:password");
                $resp = $prep->execute($authData);
                $res = $prep->fetchAll();
                if (count($res) == 1)
                {
                    $row = $res[0];
                    $_SESSION['id'] = $row['id'];
                    $_SESSION['is_restricted'] = false;
                    if (isset($_SESSION['url']))
                    {
                        $url = $_SESSION['url'];
                    }
                    else
                    {
                        $url = "";
                    }
                    redirect($url);
                }
                else
                {
                    //l('auth', 'badlogin', NULL, NULL, NULL, array('ip'=>$_SERVER['REMOTE_ADDR'], 'login' => $login, 'password' => $password));
                    redirect("/login.php?wrongloginpassword=true");
                    die();
                }
            }
            else if (isset($_POST["byip"]) && $_POST["byip"] == 'true')
            {
                $ipUser = new User($ipRequest);
                if ($ipUser->isValid())
                    $_SESSION['id'] = $ipUser->getId();
                if (configgetvalue('system', 'ucp', NULL, 'restrictUsersLoggedByIP'))
                {
                    $user->isRestricted = true;
                    $_SESSION['is_restricted'] = true;
                }
                if (isset($_SESSION['url']))
                {
                    $url = $_SESSION['url'];
                }
                else
                {
                    $url = "";
                }
                redirect($url);
            }
            break;
        case 'logout':
            {
                $_SESSION['id'] = 0;
                unset($_SESSION['is_restricted']);
                redirect();
            }
            break;
    }
}
else
{
    redirect();
}

session_write_close();
