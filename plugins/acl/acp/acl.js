acl = function()
{
	function init()
	{
		tables.tabs.master.grid.hiddenCols.splice(tables.tabs.master.grid.hiddenCols.indexOf('group'), 1);
		tables.tabs.master.grid.excludedFields.splice(tables.tabs.master.grid.excludedFields.indexOf('group'), 1);
		tables.tabs.master.grid.waitForStores.push('group');
    tables.tabs.group=
    {
      title: _("Groups"), 
      name: 'group', 
      hideReadOnly: true,
      grid: 
      {
        store: new Nuance.Store(
        {
          autoLoad: true,
          mainStore: true,
          target: 'group'
        }),
        configProxy: configProxy, 
        name: 'group',
        hiddenCols:['acl']
      }
    };
	}
	pluginsLoaders.push(init);
}
new acl;
