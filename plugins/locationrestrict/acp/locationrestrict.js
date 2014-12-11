function locationrestrict()
{
  function init()
  {
		tables.tabs.master.grid.excludedFields.splice(tables.tabs.master.grid.excludedFields.indexOf('street'), 1);
		tables.tabs.master.grid.excludedFields.splice(tables.tabs.master.grid.excludedFields.indexOf('city'), 1);
  }
	pluginsLoaders.push(init);
}
new locationrestrict;
