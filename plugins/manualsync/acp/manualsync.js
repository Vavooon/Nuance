function manualSyncInit() {
	var bodyWrap = ce('div', {
			className: 'opts-tab manualsync-tab'
		}),
		bodyEl = ce('div', {}, bodyWrap);

	function sync(id, successText) {
		var lp = new Nuance.LoadingPopup;
		var onsuccess = function(resp) {
			lp.close();
			new Nuance.MessageBox({
				text: successText
			});
		};
		ajaxProxy.post("/routersync/" + id, null, onsuccess);
	};
	var loadRouters = function() {
		bodyEl.innerHTML = '';
		var routers = Nuance.stores.router.data;
		var ns = Nuance.stores.router.ns;

		function createButton(id, title, successText, main) {
			new Nuance.input.Button({
				value: title,
				onclick: function() {
					sync(id, successText);
				},
				extraCls: main ? 'primary' : false,
				target: bodyEl
			});
		};
		createButton('*', _("Sync all routers"), _("Routers are synced"), true);
		ce('br', null, bodyEl);
		for (var routerId in routers) {
			createButton(routerId, _("Sync router ") + routers[routerId][ns.name], _("Router is synced"));
		};
	};
	tables.tabs.router.grid.contextMenuItems.push({
		title: _("Sync"),
		onclick: function() {
			var grid = Nuance.grids.router;
			var id = grid.getSelectedItems();

			for (var i = 0; i < id.length; i++) {
				sync(id[i], _("Router is synced"));
			}
			//var routerId=id ? grid.store.getById(id)[grid.store.ns.router] : undefined;
		}
	});
	Nuance.stores.router.on('afterload', loadRouters);
	pluginsTabs.manualsync = {
		title: _("Routers"),
		name: 'manualsync',
		content: bodyWrap
	};
}
pluginsLoaders.push(manualSyncInit);