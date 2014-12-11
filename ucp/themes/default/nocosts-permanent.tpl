<div id="content" class="center">
<h3>{__('You do not have the funds to continue the use of the Internet.')}</h3>
<h3>{__('Fund your account, please.')}</h3>

<br>
{if $user->isValid()}
<br>
  <table class="info-table">
    <tr>  
      <td class="bold name">{__("Your account ID")}</td> <td class="value">{$user->getFormattedId()}</td>
    </tr>
    <tr>
      <td class="bold name">{__("Minimal payment")}</td> <td class="value">{$user->getFormattedCashToPay()}</td>
    </tr>
  </table>
{/if}
</div>
