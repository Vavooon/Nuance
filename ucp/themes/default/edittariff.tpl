<div id="content" class="center">
    <h3>{__("Select new tariff:")}</h3>
  <form method="POST">
    <select class="text-field" name="tariff">
      
      {foreach $availableTariffs as $key => $tariff}
        <option {if $currentTariffId===$key}{"selected "}{/if} value="{$key}">
        {$tariff.name}
        </option>
        {/foreach}
    </select>
    <br/>
    <br/>
    <input type="submit" value="{__('Change tariff')}" class="button big"></input>
  </form>
</div>
