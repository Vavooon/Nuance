var store=function()
{
	function init()
	{
		var self=this;
		
		var tabsToRemove=['router', 'street', 'city', 'group', 'log'];
		
		for (var i=0; i<tabsToRemove.length; i++)
		{
			delete tables.tabs[tabsToRemove[i]];
		}
    tables.tabs.user=
    {
        title: _("Users"),
        name: 'user',
        grid:
        {
          hiddenCols:['contractid', 'sname', 'fname', 'pname', 'street', 'house', 'flat' ,'disabled', 'paymentdate', 'login', 'password'],
          userHiddenCols:['regdate', 'editdate'],
          excludedFields: userExcludedFields,  
          configProxy: configProxy,
          virtualFields:
          {
            username:
            {
              order: 1
            }
          },
          waitForStores:
          [
            'plugin',
            'tariff'
          ],
          toolbarButtons:
          [
            
          ],
          customFields: 
          {
            expiredate:
            {
              yearsOffset: -5
            }
          },
          contextMenuItems:
          [
            
          ],
          store: Nuance.stores.user,
          name: 'user'
        }
      }
    tables.tabs.plugin=
    {
      title: _("Plugins"), 
      name: 'plugin', 
      hideReadOnly: true,
      grid:
      {
        store: new Nuance.Store(
        {
          autoLoad: true,
          mainStore: true,
          target: 'plugin'
        }),
        configProxy: configProxy, 
        name: 'plugin'
      }
    }
  };
	pluginsLoaders.push(init);
	
}
new store;
