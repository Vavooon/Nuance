<div id="content" class="center">
  <div class="message single">
    <div class="text">{$message.text}</div>
  </div>
  {if $message.incoming}
  <div class="message-buttons buttons-wrap">
    <div class="button-wrap">
      <a href="message.php?action=compose" class="button big icon mail">{__("Reply")}</a>
    </div>
    <div class="button-wrap">
      <a href="message.php?action=markasread&id={$message.id}" class="button big primary icon tag">{__("Mark as read")}</a>
    </div>
    <div class="clear"></div>
  </div>
  {else}
  <div class="message-buttons buttons-wrap">
    <div class="button-wrap">
      <a href="message.php?action=lish" class="button big icon arrowleft">{__("Back to list")}</a>
    </div>
  </div>
  {/if}
</div>
