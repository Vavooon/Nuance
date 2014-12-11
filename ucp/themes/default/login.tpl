<div id="content" class="center">
  <form id="center-login-form" action="auth.php" method="POST" autocomplete="on">
    <h2>{__("Username")}</h2>
    <input class="text-field" name="login">
    <h2>{__("Password")}</h2>
    <input class="text-field" name="password" type="password">
    <h3></h3>
    <input name="action" type="hidden" value="login">
    <input type="submit" value="{__("Log in")}" class="button">
  </form>
  {if $ipIsFound && !$userIsRestricted}
    <h2>{__('OR')}<br/></h2>
  <form action="auth.php" method="post" autocomplete="on">
    <input name="action" type="hidden" value="login">
    <input name="byip" type="hidden" value="true">
    <input type="submit" value="{__("Log in by IP")}" class="big button">
  </form>
  {/if}
</div>
