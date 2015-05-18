<?php

require_once 'core.php';

if (isset($_GET['lang']))
{
    $currentLanguage = $_GET['lang'];
    setcookie('lang', $currentLanguage);
}
else if (isset($_COOKIE['lang']))
{
    $currentLanguage = $_COOKIE['lang'];
}
else
{
    $currentLanguage = $config->getValue('system', 'main', NULL, 'ucpLocale');
}
loadLocale('ucp', $currentLanguage);
if (!$licenseManager->checkPermission('ucp'))
{
    $errorText = __("You do not have permission to use UCP");
    require_once $usertheme . "/error.php";
    die();
}

$ipRequest = " WHERE iplist LIKE '%\"" . $_SERVER['REMOTE_ADDR'] . "\"%'";

function formatCash($sum)
{
    $currency = $config->getValue('system', 'main', NULL, 'currency');
    return sprintf(_ngettext("%s $currency", "%s $currency", $sum), $sum);
}

checkUpdate();
session_start();
if (strpos($_SERVER['REQUEST_URI'], 'auth.php') === false && strpos($_SERVER['REQUEST_URI'], '/login.php') === false)
{
    $_SESSION['url'] = substr($_SERVER['REQUEST_URI'], strrpos($_SERVER['REQUEST_URI'], '/'));
}

if (!isset($_SESSION['id']) && $config->getValue('system', 'ucp', NULL, 'IPautoLogin'))
{
    $user = new User($ipRequest);
    if ($config->getValue('system', 'ucp', NULL, 'restrictUsersLoggedByIP'))
    {
        $user->isRestricted = true;
        $_SESSION['is_restricted'] = true;
    }
}
else if (!isset($_SESSION['id']))
{
    $user = new User();
}
else if ($_SESSION['id'] === 0)
{
    $user = new User();
}
else if ($_SESSION['id'])
{
    $user = new User("WHERE id=" . $_SESSION['id']);
    if (isset($_SESSION['is_restricted']) && $_SESSION['is_restricted'] === true)
    {
        $user->isRestricted = true;
    }
}

if ($user->isValid())
{
    $_SESSION['id'] = $user->getId();
}

session_write_close();

/* languages */
$checkFn = function($el)
{
    $target = 'locale';
    $domain = 'ucp';
    if (file_exists("../$target/$el/LC_MESSAGES/$domain.mo") || file_exists("../$target/$el/LC_MESSAGES/$domain.po"))
        return true;
};

$target = 'locale';
$languages = getDirs("$target", $checkFn);

$params = $_GET;
for ($i = 0; $i < count($languages); $i++)
{
    $language = $languages[$i];
    $params['lang'] = $language;
    $href = '?' . http_build_query($params);
    $icon = "themes/default/flags/" . strtolower(substr($language, 3)) . ".png";
    $languages[$i] = array($language, $href, $icon);
}
/* Generate menu */

$menu = array();

$menu['index.php'] = array(__('Home'), 0);

if ($user->isValid())
{
    $menu['info.php'] = array(__('My info'), 0);
    if ($user->isEnabled())
    {
        if ($config->getValue('system', 'ucp', NULL, 'showMoneyflow'))
        {
            $menu['moneyflow.php'] = array(__('Moneyflow'), 0);
        }
        if (pluginExists('scratchcard'))
        {
            $menu['paywithcard.php'] = array(__('Fund by card'), 0);
        }
    }
}
if ($config->getValue('system', 'ucp', NULL, 'showTariffs'))
{
    $menu['tariffs.php'] = array(__('Tariffs'), 0);
}
if ($config->getValue('system', 'ucp', NULL, 'showDocuments'))
{
    $menu['documents.php'] = array(__('Documents'), 0);
}
if ($user->isValid() && pluginExists('message'))
{
    if ($user->isEnabled())
    {
        $messageText = __('Messages');

        $messageTable = new Table('message');
        $request = "WHERE `recipient`=" . $user->getId() . " AND `recipient_is_admin`=0 AND `is_new`=1";
        $newMessages = $messageTable->load($request);
        $newMessagesCount = count($newMessages);

        if ($newMessagesCount)
        {
            $messageText .= ' <span id="messages-count">' . $newMessagesCount . '</span>';
        }
        $menu['message.php'] = array($messageText, 0);
    }
}

$menu['contacts.php'] = array(__('Contacts'), 0);

$scriptName = substr($_SERVER['SCRIPT_NAME'], 1);
if (isset($menu[$scriptName]))
{
    $menu[$scriptName][1] = 1;
}
if ($user->isValid())
{
    $userName = $user->getName();
    if ($userName)
    {
        $displayName = $userName;
    }
    else
    {
        $displayName = $user->getFormattedId();
    }
}
else
{
    $displayName = false;
}

$headerData = array(
        "htmlTitle" => sprintf(__("%s - Nuance - User panel"), $config->getValue('system', 'main', NULL, 'companyName')),
        "languages" => $languages,
        "menu" => $menu,
        "user" => $user,
        "logoPath" => "themes/" . $theme->getTemplateLocation("images/logo.png"),
        "css" => $theme->css,
        "themeName" => $theme->name,
        "displayName" => $displayName,
        "currentLanguage" => $currentLanguage,
);