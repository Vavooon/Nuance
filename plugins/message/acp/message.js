message = function()
{
	function init()
	{
    var messageStore=new Nuance.Store(
    {
      name: 'message',
      autoLoad: true
    });
    tables.tabs.message=
    {
      title: _("Messages"),
      name: 'message',
      grid:
      {
        waitForStores:
        [
          'user',
          'master'
        ],
        store: messageStore,
        configProxy: configProxy,
        readOnly: true,
        hiddenCols:['id', 'subject', 'sender_is_admin', 'recipient_is_admin'],
        filters:
        {
          'new':
          {
            name: "new",
            column: 'new',
            filterFunction: function(id, selectedValue)
            {
              if (selectedValue==='new')
              {
                return Nuance.stores.message.data[id][Nuance.stores.message.ns.is_new] && Nuance.stores.message.data[id][Nuance.stores.message.ns.recipient_is_admin];
              }
              else
              {
                return !(Nuance.stores.message.data[id][Nuance.stores.message.ns.is_new] && Nuance.stores.message.data[id][Nuance.stores.message.ns.recipient_is_admin]);
              }
            },
            store: new Nuance.MemoryStore(
              {
                header:
                [
                  ['id', 'text'],
                  ['name', 'text']
                ],
                data:
                {
                  'new': ['new', _("New")],
                  'read': ['read', _("Read")]
                }
              }
            )
          },
          is_new: false,
          sender_is_admin: false,
          recipient_is_admin: false
        },
        toolbarButtons:
        [
          {
            value: _('New message'), 
            iconClass: 'mail',
            onclick: function()
            {
              new Nuance.BroadcastChatPopup;
            }
          }
        ],
        name: 'message'
      }
    };
    messageStore.on('afterload', function()
    {
      if (Nuance.grids.message)
      {
        Nuance.grids.message.onEdit=function()
        {
          var messageStore=this.store;
          var message=messageStore.getById(this.getSelectedItems(), true);
          if (message.sender_is_admin)
          {
            var userId=message.recipient;
          }
          else
          {
            var userId=message.sender;
          }
          new Nuance.ChatPopup({userId: userId});
        }

        Nuance.grids.message.on('beforerender', function(formattingRows, data, ns, displayData, displayNs)
        {
          var userStore=Nuance.stores.user;
          var masterStore=Nuance.stores.master;


          var messageIndex=ns.text;
          var displayMessageIndex=displayNs.text;

          var senderIndex=ns.sender;
          var senderTypeIndex=ns.sender_is_admin;
          var displaySenderIndex=displayNs.sender;

          var recipientIndex=ns.recipient;
          var recipientTypeIndex=ns.recipient_is_admin;
          var displayRecipientIndex=displayNs.recipient;

          var isNewIndex=ns.is_new;
          var displayIsNewIndex=displayNs.is_new;

          for (var id in data)
          {
            var row=data[id];
            var displayRow=displayData[id];

            if (row[isNewIndex] && row[recipientTypeIndex])
            {
              var beforeText='<span class="bold">';
              var afterText='</span>';
              displayRow[displayIsNewIndex]='<p class="enabled"></p>';
            }
            else
            {
              var beforeText='';
              var afterText='';
              displayRow[displayIsNewIndex]='';
            }


            if (row[senderTypeIndex])
            {
              displayRow[displaySenderIndex]=masterStore.getNameById(row[senderIndex]);
            }
            else
            {
              displayRow[displaySenderIndex]=userStore.getNameById(row[senderIndex]);
            }
            displayRow[displaySenderIndex] = beforeText + displayRow[displaySenderIndex] + afterText;
          
            if (row[recipientTypeIndex])
            {
              displayRow[displayRecipientIndex]=masterStore.getNameById(row[recipientIndex]);
            }
            else
            {
              displayRow[displayRecipientIndex]=userStore.getNameById(row[recipientIndex]);
            }
            displayRow[displayRecipientIndex] = beforeText + displayRow[displayRecipientIndex] + afterText;
            displayRow[displayMessageIndex] = beforeText + displayRow[displayMessageIndex] + afterText;

          }

        });
      }
    });
    if ( checkPermission ( ['table', 'message', 'add'] ) )
    {
      tables.tabs.user.grid.contextMenuItems.push(
        {
          action: 'sendMessage',
          title: _("Send message"),
          singleusermessage: function()
          {
            var userGrid=Nuance.grids.user;
            var userId=userGrid.getSelectedItems()[0];
            new Nuance.ChatPopup({userId: userId});
          },
          multiusermessage: function()
          {
            var userGrid=Nuance.grids.user;
            var users=userGrid.getSelectedItems();
            new Nuance.BroadcastChatPopup({users: users});
          },
          beforeshow: function(selectionId, grid)
          {
            var grid=Nuance.grids.user;

            if (grid.getSelectedItems().length!==1)
            {
              this.onclick=this.multiusermessage;
            }
            else
            {
              this.onclick=this.singleusermessage;
            }
          },
        }
      );
    };

  }
	pluginsLoaders.push(init);
}
new message;
