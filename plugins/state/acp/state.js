function state() {
	function init() {
		/* Routers online */
		var supportedTypes = ['mikrotik', 'mikrotikppp'];
		var routerData = {};
		userData = {};

		function formatRouterState(state) {
			return '<p class="state icon ' + state + '" title="' + _(state) + '"></p>';
		}

		Nuance.stores.user.on('afterload', function() {
			if (Nuance.grids.router) {
				Nuance.grids.router.on('beforerender', function(formattedRows, data, ns, displayData, displayNs) {
					for (var id in data) {
						var row = data[id];

						// State
						if (supportedTypes.indexOf(row[ns.routertype]) !== -1) {
							if (routerStateChecker) {
								displayData[id][displayNs.state] = formatRouterState(routerStateChecker.getState());
							} else {
								displayData[id][displayNs.state] = formatRouterState('loading');
							}
						} else {
							displayData[id][displayNs.state] = '';
						}

						// CPU load
						if (routerData[row[ns.id]]) {
							displayData[id][displayNs.cpuload] = routerData[row[ns.id]]['cpu-load'] + '%';
						} else {
							displayData[id][displayNs.cpuload] = '';
						}

						// Free RAM
						if (routerData[row[ns.id]]) {
							displayData[id][displayNs.freeram] = routerData[row[ns.id]]['free-memory'] + 'kb';
						} else {
							displayData[id][displayNs.freeram] = '';
						}

						// OS version
						if (routerData[row[ns.id]]) {
							displayData[id][displayNs.version] = routerData[row[ns.id]]['version'];
						} else {
							displayData[id][displayNs.version] = '';
						}
					}
				});
			}
			/* Users state */
			Nuance.grids.user.on('beforerender', function(formattedRows, data, ns, displayData, displayNs) {
				for (var id in data) {
					var row = data[id];

					var router = routerStore.getById(row[ns.router]);
					if (router && supportedTypes.indexOf(router[routerStore.ns.routertype]) !== -1) {
						if (userData[row[ns.id]]) {
							displayData[id][displayNs.online] = formatRouterState(userData[row[ns.id]]);
						} else {
							displayData[id][displayNs.online] = formatRouterState('loading');
						}
					} else {
						displayData[id][displayNs.online] = formatRouterState('unknown');
					}
				}
			});
		});

		tables.tabs.user.grid.virtualFields.online = {
			order: 0
		};
		tables.tabs.router.grid.virtualFields.state = {
			order: 0
		};

		function RouterStateChecker() {
			var store = Nuance.stores.router;
			var ns = store.ns;
			var self = this;
			var state, cpuload, freeram, version, timeoutId;

			Nuance.EventMixin.call(this);

			function onResponse(resp) {
				if (typeof resp === 'number')
					return;
				self.data = resp.state;
				for (var id in store.data) {
					var row = store.getById(id);
					var data = resp.state[id];
					/* router state section */
					if (typeof data === 'object' && data) {
						state = 'online';
						var loadPercentage = parseInt(data['cpu-load']);
						if (loadPercentage > 50) {
							if (loadPercentage > 75) {
								cpuload = '<div class="cpu-high-load">' + loadPercentage + '%</div>';
							} else {
								cpuload = '<div class="cpu-mainly-load">' + loadPercentage + '%</div>';
							}
						} else {
							cpuload = loadPercentage + '%';
						}
						freeram = data['free-memory'] + 'kb';
						version = data.version;

						if (Nuance.grids.router) {
							Nuance.grids.router.setDisplayValue(id, 'cpuload', cpuload);
							Nuance.grids.router.setDisplayValue(id, 'freeram', freeram);
							Nuance.grids.router.setDisplayValue(id, 'version', version);
						}
					} else {
						state = 'offline';

						if (Nuance.grids.router) {
							Nuance.grids.router.setDisplayValue(id, 'cpuload', '');
							Nuance.grids.router.setDisplayValue(id, 'freeram', '');
							Nuance.grids.router.setDisplayValue(id, 'version', '');
						}
					}
					routerData[id] = data;
					if (Nuance.grids.router) {
						Nuance.grids.router.setDisplayValue(id, 'state', formatRouterState(state));
					}

					/* user state section */
					var userStore = Nuance.stores.user;

					function loadUserStates() {
						var userNs = userStore.ns;
						if (data && data.online) {
							for (var j in userStore.data) {
								var user = userStore.data[j];
								if (user[userNs.router] == id) {
									var userId = user[userNs.id];
									var ips = JSON.parse(user[userNs.iplist]);
									var userState = 'offline';
									for (var ip in ips) {
										if (data.online.indexOf(ip) !== -1) {
											userState = 'online';
											break;
										}
									}
									Nuance.grids.user.setDisplayValue(userId, 'online', formatRouterState(userState));
									userData[userId] = userState;
								}
							}
						} else {
							var userState = 'unknown';
							for (var j in userStore.data) {
								var user = userStore.data[j];
								if (user[userNs.router] == id) {
									var userId = user[userNs.id];
									Nuance.grids.user.setDisplayValue(userId, 'online', formatRouterState(userState));
									userData[userId] = userState;
								}
							}
						}
					}
				}
				if (userStore.getState() === 'loaded') {
					loadUserStates();
				}
				self.trigger('afterload');
			}

			this.getState = function() {
				return state;
			};

			this.getActualRow = function() {
				return row;
			};

			ajaxProxy.on(['state'], onResponse);

			this.load = function(force) {
				state = 'loading';
				if (Nuance.grids.router && Nuance.grids.router.displayData) {
					Nuance.grids.router.setDisplayValue(id, 'state', formatRouterState('loading'));
				}
				var requestString = '/state/get';
				if (force) {
					requestString += '?force=true';
				}
				ajaxProxy.get(requestString);
			};
			this.destroy = function() {
				if (timeoutId) {
					clearTimeout(timeoutId);
				}
				if (Nuance.grids.router.displayData) {
					Nuance.grids.router.setDisplayValue(id, 'state', '');
					Nuance.grids.router.setDisplayValue(id, 'cpuload', '');
					Nuance.grids.router.setDisplayValue(id, 'freeram', '');
					Nuance.grids.router.setDisplayValue(id, 'version', '');
				}
			};
			this.load();
		}

		var routerStateChecker = new RouterStateChecker;
		window.routerStateChecker = routerStateChecker;
		var userStore = Nuance.stores.user;
		var routerStore = Nuance.stores.router;

		function loadRouterState() {
			var store = Nuance.stores.router;
			var ns = store.ns;
			routerStateChecker.load();
		}

		timeoutId = setInterval(self.load, parseFloat((configProxy.getValue('system', 'grid', 'stateUpdateInterval')) + self.count) * 60000);
		routerStore.on('afterload', loadRouterState);
		routerStore.on('afteradd', loadRouterState);
		routerStore.on('afteredit', loadRouterState);
		routerStore.on('afterremove', loadRouterState);

		userStore.on('afteradd', loadRouterState);
		userStore.on('afteredit', loadRouterState);

		tables.tabs.router.grid.contextMenuItems.push({
			title: _("Update state"),
			onclick: function() {
				routerStateChecker.load(true);
			}
		});
	}

	pluginsLoaders.push(init);
}
new state;