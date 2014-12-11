<div id="content" class="center">
{foreach $documents as $document}
  <h3>{$document.name}</h3>
    {if isset($document['description']) && strlen($document['description'])}
     {$document.description}
    <br>
    <br>
    {/if}
    {if isset($document['forceDownload']) && $document['forceDownload']==='true'}
    <a class="button big" target="_blank" download href="upload/{$document.fileName}">{$document.linkText}</a>
    {else}
    <a class="button big" target="_blank" href="upload/{$document.fileName}">{$document.linkText}</a>
    {/if}
  </a>
  <br>
  <br>
{/foreach}
</div>
