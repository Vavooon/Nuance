burst = function()
{
  this.init=function()
  {
    tables.tabs.tariff.grid.includedFields.push('downburstlimit');
    tables.tabs.tariff.grid.includedFields.push('upburstlimit');
    tables.tabs.tariff.grid.includedFields.push('downburstthreshold');
    tables.tabs.tariff.grid.includedFields.push('upburstthreshold');
    tables.tabs.tariff.grid.includedFields.push('downbursttime');
    tables.tabs.tariff.grid.includedFields.push('upbursttime');
  }
  pluginsLoaders.push(this.init);
}
new burst;
