
<div id="content" class="center">
<h3>{__('Moneyflow')}</h3>

<br>
<br>
{if count($rows)}
  <table class="nice-table">
    <tr>
      <th class="sum">{__('Sum')}</th>
      <th class="date">{__('Date')}</th>
      <th class="details">{__('Details')}</th>
    </tr>
    {foreach $rows as $row}
    <tr>  
      <td class="sum">{$row.sum}</td>
      <td class="date">{$row.date}</td>
      <td class="details">{$row.details}</td>
    </tr>
    {/foreach}
  </table>
<br/>
{/if}
</div>
