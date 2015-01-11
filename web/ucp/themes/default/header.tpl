<!DOCTYPE html>
<html>
  <head>
    <title>{$htmlTitle}</title>
    <meta charset="UTF-8">
    {foreach $css as $path}
    <link rel="stylesheet" type="text/css" href="{$path}" />
    {/foreach}
  </head>
  <body>
    <div id="header">
      <div id="language-switch">{__('Select language')}
        <ul>
        {foreach $languages as $language}
          <li{if $language[0] == $currentLanguage} class="active"{/if}><a href="{$language[1]}"><img src="{$language[2]}"></a></li>
        {/foreach}
        </ul>
      </div>
      {if $logoPath} 
      <div class="center logo"><a href="/"><img src="{$logoPath}" /></a></div>
      {/if}
      <div id="login" {if $user->isValid()}class="logged-in"{else}class="logged-out"{/if}>
      {if $user->isValid()}
        <h1 id="login-title">{sprintf(__('You are logged in as <br>%s'), $displayName)}</h1>
        <form id="top-login-form" method="post" action="auth.php">
          
          <input name="action" type="hidden" value="logout">
          <a href="info.php" class="button">{__("My info")}</a>
          <br>
          <input type="submit" value="{__("Log out")}" class="button">
        </form>
      {else}
        <form id="header-login-form" action="auth.php" method="POST" autocomplete="on">
          <h2>{__('User panel')}</h2>
          <input class="text-field" name="login" placeholder="{__("Username")}">
          <input class="text-field" name="password" type="password" placeholder="{__("Password")}">
          <input name="action" type="hidden" value="login">
          <input type="submit" value="{__("Log in")}" class="button">
        </form>
      {/if}
      </div>
    </div>
    <div class="clear"></div>
    <div id="cssmenu">
      <ul>
        {foreach $menu as $url=>$value}
          {if $value[1]}
          <li class="active"><a href="{$url}"><span>{$value[0]}</span></a></li>
          {else}
          <li><a href="{$url}"><span>{$value[0]}</span></a></li>
          {/if}
        {/foreach}
      </ul>
    </div>
