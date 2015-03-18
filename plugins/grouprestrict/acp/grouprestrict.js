function grouprestrict()
{
  function init()
  {
		tables.tabs.user.grid.excludedFields.splice(tables.tabs.user.grid.excludedFields.indexOf('usergroup'), 1);
		tables.tabs.user.grid.excludedFields.splice(tables.tabs.user.grid.excludedFields.indexOf('usergroup'), 1);
		tables.tabs.user.grid.waitForStores.push('usergroup');
    tables.tabs.usergroup=
    {
      title: _("User groups"), 
      name: 'usergroup', 
      hideReadOnly: true,
      grid: 
      {
        store: new Nuance.Store(
        {
          autoLoad: true,
          mainStore: true,
          target: 'usergroup'
        }),
        configProxy: configProxy, 
        name: 'usergroup',
        hiddenCols:['acl']
      }
    };
  }
	pluginsLoaders.push(init);
}
new grouprestrict;
