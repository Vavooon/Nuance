var routerlink = function()
{
  function init()
  {
    tables.tabs.router.grid.contextMenuItems.push(
      {
        topSeparator: true,
        title: _("Open Web interface"),
        beforeshow: function(selectionId, grid)
        {
          var grid=Nuance.grids.router;
          this.disabled= grid.getSelectedItems().length!==1;
        },
        onclick: function(e)
        {
          var grid=Nuance.grids.router;
          var routerId=grid.getSelectedItems()[0];
          var router=grid.store.getById(routerId, true);
          var link="http://"+router.ip;
          var statPort=configProxy.getValue('router', 'main', 'statPort', routerId);
          if (statPort!==80)
          {
            link += ":"+statPort;
          }
          link += "/";
          window.open(link);
        }
      },
      {
        title: _("Open SSH"),
        beforeshow: function(selectionId, grid)
        {
          var grid=Nuance.grids.router;
          this.disabled= grid.getSelectedItems().length!==1;
        },
        onclick: function(e)
        {
          var grid=Nuance.grids.router;
          var routerId=grid.getSelectedItems()[0];
          var router=grid.store.getById(routerId, true);
          var link="ssh://"+router.ip+"/";
          window.open(link);
        }
      },
      {
        title: _("Open Telnet"),
        beforeshow: function(selectionId, grid)
        {
          var grid=Nuance.grids.router;
          this.disabled= grid.getSelectedItems().length!==1;
        },
        onclick: function(e)
        {
          var grid=Nuance.grids.router;
          var routerId=grid.getSelectedItems()[0];
          var router=grid.store.getById(routerId, true);
          var link="telnet://"+router.ip+"/";
          window.open(link);
        }
      },
      {
        bottomSeparator: true,
        title: _("Open WinBox"),
        beforeshow: function(selectionId, grid)
        {
          var grid=Nuance.grids.router;
          this.disabled= grid.getSelectedItems().length!==1;
        },
        onclick: function(e)
        {
          var grid=Nuance.grids.router;
          var routerId=grid.getSelectedItems()[0];
          var router=grid.store.getById(routerId, true);
          //var link="winbox://"+router.login+":"+router.pass+"@"+router.ip+":"+router.port+"/";
          var link="winbox://"+router.login+":"+router.pass+"@"+router.ip+"/";
          c(link);
          window.open(link);
        }
      }
    );
  }
	pluginsLoaders.push(init);
}
new routerlink;
