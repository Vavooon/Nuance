night = function() {
	this.init = function() {
		tables.tabs.tariff.grid.hiddenCols.remove('nightdownspeed');
		tables.tabs.tariff.grid.hiddenCols.remove('nightupspeed');

		tables.tabs.tariff.grid.includedFields.push('nightdownspeed');
		tables.tabs.tariff.grid.includedFields.push('nightupspeed');
	}
	pluginsLoaders.push(this.init);
}
new night;