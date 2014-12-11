<div id="content" class="center">

  <h3>{__('You do not have the funds to continue the use of the Internet in the next month.')}</h3>
  <h3>{__('Fund your account, please.')}</h3>

  <br>
  <br>

  {if $user->isValid()}
  <table class="info-table">
    <tr>  
      <td class="bold name">{__("Your account ID")}</td> <td class="value">{$user->getFormattedId()}</td>
    </tr>
    <tr>
      <td class="bold name">{__("Minimal payment")}</td> <td class="value">{$user->getFormattedCashToPay()}</td>
    </tr>
  </table>

  <br/>
  <br/>

  <a class="button big" href="?ok=1">{__("Continue to use the Internet")}</a>
  {else}
  <h3>{__('Please log in into the UCP in order to hide this notification.')}</h3>
  {/if}

  
</div>
