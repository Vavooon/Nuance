<div id="content" class="center">
    <h3>{__("My info")}</h3>
  <table class="info-table">
    <tr>
      <td class="bold name">{__("Account ID")}</td> <td class="value">{$user->getFormattedId()}</td>
    </tr>
    {if $username}
    <tr>
      <td class="bold name">{__("Username")}</td> <td class="value">{$username}</td>
    </tr>
    {/if}
    <tr>
      <td class="bold name">{__("Service state")}</td> <td class="value">{$state}</td>
    </tr>
    {if $tariffIsChanging}
    <tr>
      <td class="bold name">{__("Current tariff")}</td> <td class="value">{$currentTariff.name}</td>
    </tr>
    <tr>
      <td class="bold name">{__("Next tariff")}</td> <td class="value">{$selectedTariff.name}</td>
    </tr>
    {else}
    <tr>
      <td class="bold name">{__("Tariff")}</td> <td class="value">{if $selectedTariff}{$selectedTariff.name}{else}{__("Not selected")}{/if}</td>
    </tr>
    {/if}
    <tr>
      <td class="bold name">{__("Balance")}</td> <td class="value">{$user->getFormattedCash()}</td>
    </tr>
  </table>
  <br>
  {if (count($permittedActions))}
  <h3>{__("Actions")}</h3>
  <div class="actions">
    {if (isset($permittedActions['changetariff']))}
    <a class="button big" href="editprofile.php?target=tariff">{__("Change tariff")}</a>
    <br>
    <br>
    {/if}
    {if (isset($permittedActions['changepassword']))}
    <a class="button big" href="editprofile.php?target=password">{__("Change password")}</a>
    {/if}
  </div>
  {/if}
</div>
