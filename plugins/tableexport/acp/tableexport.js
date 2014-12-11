function tableexport()
{
	function init()
	{
    for (var tab in tables.tabs)
    {
      var grid=tables.tabs[tab].grid;
      if (grid)
      {
        if (!Array.isArray(grid.contextMenuItems))
        {
          grid.contextMenuItems=[];
        }
        grid.contextMenuItems.push(
          {
            action: 'export',
            title: _("Export to file"),
            grid: grid,
            beforeshow: function()
            {
              var grid=Nuance.grids[this.grid.name];
              this.onclick= function()
              {
                var selectedItems=grid.getSelectedItems(),
                    rows=[],
                    csvContent='';

                for (var i=0; i<selectedItems.length; i++)
                {
                  var id=selectedItems[i];
                  var row=[];
                  for (var j=0; j<grid.displayData[id].length; j++)
                  {
                    if (grid.displayData[id][j])
                    {
                      row.push((''+grid.displayData[id][j]).replace(/<[^>]*>/g, ""));
                    }
                    else
                    {
                      row.push('');
                    }
                  }
                  rows.push(row.join(','));

                }
                csvContent=rows.join("%0A");

                var a         = ce('a', {href: 'data:attachment/csv,' + csvContent, target: '_blank', download: grid.getName()+'.csv'}, document.body);

                c(a);
                a.click.apply(a);
              }
            },
            
          }
        );

      }
    }
	}

  pluginsLoaders.push(init);
}
new tableexport;

