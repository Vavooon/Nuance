function grouprestrict() {
	function init() {
		tables.tabs.master.grid.excludedFields.splice(tables.tabs.master.grid.excludedFields.indexOf('usergroup'), 1);
		tables.tabs.master.grid.excludedFields.splice(tables.tabs.master.grid.excludedFields.indexOf('usergroup'), 1);
		tables.tabs.master.grid.waitForStores.push('usergroup');
		tables.tabs.usergroup = {
			title: _("User groups"),
			name: 'usergroup',
			hideReadOnly: true,
			grid: {
				store: new Nuance.Store({
					autoLoad: true,
					mainStore: true,
					name: 'usergroup'
				}),
				configProxy: configProxy,
				name: 'usergroup',
				hiddenCols: ['acl']
			}
		};
	}
	pluginsLoaders.push(init);
}
new grouprestrict;