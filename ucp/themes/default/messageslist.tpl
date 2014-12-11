<div id="content" class="center">
  <div id="messages-list" class="messages-list">
    {foreach $messages as $message}
    <a href="message.php?action=show&id={$message.id}">
      <div class="message{if $message.incoming && $message.is_new}{" new"}{/if}{if $message.incoming}{" incoming"}{/if}">
        <span class="type">{if $message.incoming}{__("Incoming message")}{else}{__("Outgoing message")}{/if}</span>
        <span class="date">{$message.date}</span>
        <div class="text">{$message.text}</div>
      </div>
    </a>
    {/foreach}
  </div>
  <div class="message-buttons buttons-wrap">
    <div class="button-wrap">
      <a href="message.php?action=markasread" class="button big icon tag">{__("Mark all as read")}</a>
    </div>
    <div class="button-wrap">
      <a href="message.php?action=compose" class="button big primary icon mail">{__("New message")}</a>
    </div>
    <div class="clear"></div>
  </div>
  <script>
    var list=document.getElementById( 'messages-list' );
    list.scrollTop = list.scrollHeight;
  </script>
</div>
