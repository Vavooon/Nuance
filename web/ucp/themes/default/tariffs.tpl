<div id="content" class="center">
<h3><?php echo __('Available tariffs')?></h3>

<br>
{foreach $tariffsByCities as $city => $tariffs}
  {if count($tariffs)}
    {if isset($citiesById[$city]['name'])}
    <h3>
      {$citiesById[$city]['name']}
    </h3>
    {/if}
  <table class="nice-table tariff">
    <tr>
      <th class="name">{$nameText}</th>
      <th class="download speed">{$downloadSpeedText}</th>
      <th class="upload speed">{$uploadSpeedText}</th>
      {if pluginExists('night')}
      <th class="download speed">{$nightDownloadSpeedText}</th>
      <th class="upload speed">{$nightUploadSpeedText}</th>
      {/if}
      <th class="price">{$priceText}</th>
    </tr>
  {foreach $tariffs as $tariff}
    <tr>  
      <td class="name">{$tariff.name}</td>
      <td class="download speed">{$tariff.downspeed}</td>
      <td class="upload speed">{$tariff.upspeed}</td>
      {if pluginExists('night')}
      <td class="download speed">
      {if $tariff.nightdownspeed}
        <em>{$tariff.nightdownspeed}</em>
      {else}
        <em class="gray">{$tariff.downspeed}</em>
      {/if}
      </td>
      <td class="upload speed">
      {if $tariff.nightupspeed}
        <em>{$tariff.nightupspeed}</em>
      {else}
        <em class="gray">{$tariff.upspeed}</em>
      {/if}
      </td>
      {/if}
      <td class="price">{$tariff.price}</td>
    </tr>
  {/foreach}
  </table>
  <br/>
  {/if}
{/foreach}
</div>
