<?php

require_once "../include/core.php";

session_start();
loadLocale('acp');
if (isset($_POST["action"]))
{
    switch ($_POST["action"])
    {
        case 'login':
            if (isset($_POST["login"]) && isset($_POST["password"]))
            {
                $authData = array('login' => $_POST['login']);
                $password = $_POST['password'];
                $prep = $db->prepare("SELECT `id`, `login`, `password` FROM `" . DB_TABLE_PREFIX . "master` WHERE `disabled`=0 AND `login`=:login");
                $resp = $prep->execute($authData);
                $res = $prep->fetchAll();
                if (count($res) == 1 && check_password_hash($password, $res[0]['password']))
                {
                    $row = $res[0];
                    $_SESSION['user_id'] = $row['id'];
                    $_SESSION['user_login'] = $row['login'];
                    $_SESSION['user_theme'] = "./themes/" . $theme->name;

                    l('auth', 'login', 'master', $row['id'], NULL, array('ip' => $_SERVER['REMOTE_ADDR']));
                    redirect();
                    die();
                }
                else
                {
                    l('auth', 'badlogin', 'master', NULL, NULL, array('ip' => $_SERVER['REMOTE_ADDR'], 'login' => $_POST['login']));
                    redirect("auth.php?badpassword=true");
                    die();
                }
            };
            break;
        case 'logout':
            {
                if (isset($_SESSION['user_id']))
                {
                    unset($_SESSION['user_id']);
                }
                break;
            }
    }
}
session_write_close();

require_once $usertheme . "/index.php";
?>
