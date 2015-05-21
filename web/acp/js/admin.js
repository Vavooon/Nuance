var date = new Date;
var currDate = "" + date.getFullYear() + sprintf('%02d', date.getMonth() + 1);
var htmlEl = document.getElementsByTagName('html')[0];
var ajaxProxy = new Nuance.AjaxProxy;

function ActiveOrder() {
	var state;
	this.ordersLength = 0;

	this.setState = function(newState) {
		state = newState;
	};

	this.getState = function() {
		return state;
	};

	this.clear = function() {
		for (var i in this) {
			if (typeof this[i] !== 'function') {
				delete this[i];
			}
		}
		this.ordersLength = 0;
	};
}

Nuance.EventMixin.call(window);

var activeOrder = new ActiveOrder();

var dbDateFormat = 'yyyy-MM-dd';
var dbDateTimeFormat = 'yyyy-MM-dd HH:mm:ss';
var dateFormat = 'dd.MM.yyyy';
var dateTimeFormat = 'HH:mm dd.MM.yyyy';
if (!document.body) {
	htmlEl.appendChild(document.createElement('body'));
};
window.addEventListener('load', function() {
	if (htmlEl.children[2])
		htmlEl.removeChild(htmlEl.children[2]);
});

Nuance.globalSorters = {
	timestamp: function(v, ts) {
		return ts;
	}
};

function round(value, places) {
	var multiplier = Math.pow(10, places);

	return (Math.round(value * multiplier) / multiplier);
}

function refund(id, callback) {
	var store = Nuance.stores.moneyflow;
	var values = store.getById(id, true);
	if (values) {
		// Verify moneyflow type
		if (values.detailsname == 'order' || values.detailsname == 'adminpay') {
			if (!values.refund) {
				store.edit(id, {
					refund: 1
				}, function() {
					store.load();
					callback && callback();
				});
			} else {
				new Nuance.MessageBox({
					text: _("This item is already refunded"),
					title: _("Error")
				});
			}
		} else {
			new Nuance.MessageBox({
				text: _("You can refund only orders and payments"),
				title: _("Error")
			});
		}
	}
}

function getMonthFilter(date) {
  var date = new Date(date);
  date.moveToFirstDayOfMonth();
  date.clearTime();
  var filterString = '>=' + date.toString('yyyy-MM-dd');
  date.addMonths(1);
  var filterString = filterString + ',<' + date.toString('yyyy-MM-dd');
  return filterString;
}

userExcludedFields = ['paymentdate', 'editdate', 'cash'];
window.onConfigLoad = function(response) {
	configProxy.off('afterload', onConfigLoad);



	var fractionalPart = configProxy.getValue('system', 'cash', 'fractionalPart');
	smoneyf = function(cash) {
		return sprintf("%01." + fractionalPart + "f", cash);
	};

	money = function(cash) {
		return round(parseFloat(cash), fractionalPart);
	};


	function showAbout() {
		var wrap = TabPanel.tabs.about;
		wrap.id = 'about-tab';
		var bodyWrap = ce('div', {
			id: 'about-body-wrap'
		}, wrap);
		var body = ce('div', {
			id: 'about-body'
		}, bodyWrap);

		var version = configProxy.getValue('var', 'version', 'number');
		var branch = configProxy.getValue('var', 'version', 'branch');
		ce('h2', {
			innerHTML: _('Nuance Billing System'),
			className: 'title'
		}, body);
		var versionLabel = ce('p', {
			innerHTML: sprintf(_('Version %s'), version)
		}, body);
		if (branch !== 'stable') {
			ce('span', {
				className: "red",
				innerHTML: " " + _(branch)
			}, versionLabel);
		}

		ce('a', {
			innerHTML: _('Official site'),
			href: 'http://nuance-bs.com/',
			target: '_blank'
		}, body);
		ce('p', {
			innerHTML: _('All rights reserved') + ' &reg; ' + date.getFullYear()
		}, body);

		// License info
		ce('br', null, body);

		function onsuccess() {
			configProxy.on('afterload', showLicenseInfo);
			configProxy.load();
		}

	}
	var topContainer = ce('div', {
		id: 'top-container'
	}, document.body);
	var userForm = ce('form', {
		id: 'user-form',
		method: 'POST',
		action: '/logout'
	}, topContainer);
	var userNameText = ce('p', {
		id: 'user-name',
		innerHTML: sprintf(_("You are logged in as %s"), '<span class="bold">' + userName + '</span>')
	}, userForm);
	var logoWrap = ce('div', {
		id: 'logo'
	}, topContainer);
	var logoHref = ce('a', {
		href: '/'
	}, logoWrap);
	var logoImage = ce('img', {
		src: 'themes/default/img/logo.png'
	}, logoHref);
	ce('input', {
		type: 'hidden',
		name: 'action',
		value: 'logout'
	}, userForm);
	logoutButton = new Nuance.input.Button({
		target: userForm,
		value: _('Logout'),
		onclick: function() {
			userForm.submit();
		},
		iconClass: 'logout'
	});

	pluginsTabs = {};
	new Nuance.MemoryStore({
		name: 'pppservice',
		header: [
			["id", "id"],
			["name", "varchar"]
		],
		data: {
			any: ["any", "Any"],
			async: ["async", "Async"],
			l2tp: ["l2tp", "L2TP"],
			ovpn: ["ovpn", "OpenVPN"],
			pppoe: ["pppoe", "PPPoE"],
			pptp: ["pptp", "PPTP"],
			sstp: ["sstp", "SSTP"]
		}
	});
	var routerTypeStore = new Nuance.MemoryStore({
		name: 'routertype',
		header: [
			["id", "id"],
			["name", "varchar"]
		],
		data: {
			mikrotik: ["mikrotik", "Mikrotik"]
		}
	});
	var acpLocaleStore = new Nuance.Store({
		subscribePath: ['runtime', 'acplocale'],
		name: 'acpLocale',
		readOnly: true,
		autoLoad: false
	});
	var ucpLocaleStore = new Nuance.Store({
		subscribePath: ['runtime', 'ucplocale'],
		name: 'ucpLocale',
		readOnly: true,
		autoLoad: false
	});
	var acpThemeStore = new Nuance.Store({
		subscribePath: ['runtime', 'acptheme'],
		name: 'acpTheme',
		readOnly: true,
		autoLoad: false
	});
	var ucpThemeStore = new Nuance.Store({
		subscribePath: ['runtime', 'ucptheme'],
		name: 'ucpTheme',
		readOnly: true,
		autoLoad: false
	});
	var timezoneStore = new Nuance.Store({
		subscribePath: ['runtime', 'timezone'],
		name: 'timezone'
	});

	var activeOrderStore = new Nuance.Store({
		name: 'activeorder',
		filter: {enddate: ">" + date.toString(dbDateTimeFormat)}
	});
	var orderStore = new Nuance.Store({
		name: 'order'
	});

	function loadActiveOrders() {
		activeOrder.clear();
		var orderStore = Nuance.stores.activeorder;
		var ns = orderStore.ns;
		var currentDate = new Date;
		for (var id in orderStore.data) {
			var order = orderStore.data[id];
			var userId = order[ns.user];
			var canceled = order[ns.canceled];
			if (!canceled) {
				activeOrder[userId] = order;
				activeOrder.ordersLength++;
			}
		}
		if (orderStore.errors.length) {
			activeOrder.setState('deny');
		} else {
			activeOrder.setState('normal');
		}
	}
	activeOrderStore.on('afterload', function() {
		loadActiveOrders();
	});

	monthStore = new Nuance.MemoryStore({
		header: [
			['id', 'id'],
			['name', 'varchar'],
			['smallname', 'varchar'],
			['3rdname', 'varchar']
		],
		data: {
			1: [1, _('January'), gt.ngettext("january", "january", 1), gt.ngettext("january", "january", 2)],
			2: [2, _('February'), gt.ngettext("february", "february", 1), gt.ngettext("february", "february", 2)],
			3: [3, _('March'), gt.ngettext("march", "march", 1), gt.ngettext("march", "march", 2)],
			4: [4, _('April'), gt.ngettext("april", "april", 1), gt.ngettext("april", "april", 2)],
			5: [5, _('May'), gt.ngettext("may", "may", 1), gt.ngettext("may", "may", 2)],
			6: [6, _('June'), gt.ngettext("june", "june", 1), gt.ngettext("june", "june", 2)],
			7: [7, _('July'), gt.ngettext("july", "july", 1), gt.ngettext("july", "july", 2)],
			8: [8, _('August'), gt.ngettext("august", "august", 1), gt.ngettext("august", "august", 2)],
			9: [9, _('September'), gt.ngettext("september", "september", 1), gt.ngettext("september", "september", 2)],
			10: [10, _('October'), gt.ngettext("october", "october", 1), gt.ngettext("october", "october", 2)],
			11: [11, _('November'), gt.ngettext("november", "november", 1), gt.ngettext("november", "november", 2)],
			12: [12, _('December'), gt.ngettext("december", "december", 1), gt.ngettext("december", "december", 2)]
		}
	});
	dayStore = new Nuance.MemoryStore({
		header: [
			['id', 'id'],
			['name', 'varchar']
		],
		data: {}
	});
	var filterTypeStore = new Nuance.MemoryStore({
		name: 'router-filtertype',
		header: [
			['id', 'id'],
			['name', 'varchar']
		],
		data: {
			0: [0, _('Do not filter')],
			1: [1, _('Filter by ARP')],
			2: [2, _('Filter by filter rule')],
			3: [3, _('Filter by mangle')]
		}
	});

	new Nuance.MemoryStore({
		name: "typeOfCalculation",
		header: [
			["id", "id"],
			["name", "varchar"]
		],
		data: {
			advance: ["advance", _("Advance")],
			postpay: ["postpay", _("Postpay")],
			other: ["other", _("Other")]
		}
	});

	new Nuance.MemoryStore({
		name: 'newOrdersWithdrawalType',
		header: [
			['id', 'id'],
			['name', 'varchar']
		],
		data: {
			'full': ['full', _('Full month')],
			'daily': ['daily', _('Actual days')]
		}
	});

	new Nuance.MemoryStore({
		name: 'newUsersWithdrawalType',
		header: [
			['id', 'id'],
			['name', 'varchar']
		],
		data: {
			'full': ['full', _('Full month')],
			'daily': ['daily', _('Actual days')],
			'nothing': ['nothing', _('Nothing')]
		}
	});

	new Nuance.MemoryStore({
		name: 'swapOrdersWithdrawalType',
		header: [
			['id', 'id'],
			['name', 'varchar']
		],
		data: {
			'full': ['full', _('Full month')],
			'daily': ['daily', _('Actual days')]
		}
	});

	discountTypeStore = new Nuance.MemoryStore({
		name: 'discountType',
		header: [
			['id', 'id'],
			['name', 'varchar']
		],
		data: {
			'%': ['%', '%'],
			'm': ['m', _(configProxy.getValue('system', 'main', 'currency'))]
		}
	});

	prefixStore = new Nuance.MemoryStore({
		name: 'prefix',
		header: [
			['id', 'id'],
			['name', 'varchar']
		],
		data: {
			'b': ['b', _('bit/s')],
			'k': ['k', _('kbit/s')],
			'M': ['M', _('Mbit/s')],
			'G': ['G', _('Gbit/s')]
		}
	});

	var userRendererStore = new Nuance.MemoryStore({
		name: 'user-idrenderer',
		header: [
			['id', 'id'],
			['name', 'varchar']
		],
		data: {
			0: [0, _('Not formatted')],
			1: [1, _('Printf formatted')],
			2: [2, _('Display separate field')],
			3: [3, _('Display login')]
		}
	});
	var refundTypeStore = new Nuance.MemoryStore({
		name: 'refundOrdersType',
		header: [
			['id', 'id'],
			['name', 'varchar']
		],
		data: {
			1: [1, _('Don`t refund')],
			2: [2, _('Refund remains')],
			3: [3, _('Refund all')]
		}
	});
	var scratchcardRendererStore = new Nuance.MemoryStore({
		name: 'scratchcard-idrenderer',
		header: [
			['id', 'id'],
			['name', 'varchar']
		],
		data: {
			0: [0, _('Not formatted')],
			1: [1, _('Printf formatted')]
		}
	});
  new Nuance.MemoryStore({
		name: 'log-months',
		header: [
			['id', 'id'],
			['name', 'varchar']
		],
		data: {
		}
	});
  new Nuance.MemoryStore({
		name: 'moneyflow-months',
		header: [
			['id', 'id'],
			['name', 'varchar']
		],
		data: {
		}
	});

  var firstRowDate = new Date(response.db.log.firstRowDate).moveToFirstDayOfMonth(),
    currentDate = (new Date).moveToFirstDayOfMonth();
  while (currentDate >= firstRowDate) {
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth();
    var monthName = currentDate.getMonthName();
    var name = gt.ngettext(monthName, monthName, 1) + ' ' + year;
    Nuance.stores['log-months'].data[getMonthFilter(currentDate)] = [getMonthFilter(currentDate), name];
    currentDate.addMonths(-1);
  }

  var firstRowDate = new Date(response.db.moneyflow.firstRowDate).moveToFirstDayOfMonth(),
    currentDate = (new Date).moveToFirstDayOfMonth();
  while (currentDate >= firstRowDate) {
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth();
    var monthName = currentDate.getMonthName();
    var name = gt.ngettext(monthName, monthName, 1) + ' ' + year;
    Nuance.stores['moneyflow-months'].data[getMonthFilter(currentDate)] = [getMonthFilter(currentDate), name];
    currentDate.addMonths(-1);
  }


	var idRendererValue = configProxy.getValue('system', 'grid', 'user-idrenderer');
	var idRendererPrintfFormat = configProxy.getValue('system', 'grid', 'user-idrenderer-format');

	function emptyreturn(i) {
		return i;
	}

	idRenderer = emptyreturn;
	var idSorter = emptyreturn;

	switch (idRendererValue) {
		case 0:
			idSorter = function(s, id) {
				return parseInt(id);
			};
			break;
		case 1:
			idRenderer = function(id) {
				return sprintf(idRendererPrintfFormat, id)
			};
			break;
		case 2:
			idRenderer = function(id, row, ns) {
				return row[ns.contractid];
			};
			break;
		case 3:
			idRenderer = function(id, row, ns) {
				return row[ns.login];
			};
			break;
	}

	function showUserPayments(id) {
		TabPanel.selectTabByName('moneyflow');
		Nuance.grids.moneyflow.setFilters({
			user: id
		});
	}
	widgetPanel = new Nuance.WidgetPanel({
		enabledWidgets: configProxy.getValue('user', 'widget', 'enabledWidgets', userId)
	});

	tables = {
		target: document.body,
		selectedTab: location.hash.substr(1, location.hash.indexOf('/') !== -1 ? location.hash.indexOf('/') - 1 : Infinity),
		tabs: {
			dash: {
				title: _("Dashboard"),
				name: 'dash',
				content: widgetPanel.body
			},
			user: {
				title: _("Users"),
				name: 'user',
				grid: {
					hiddenCols: ['contractid', 'sname', 'fname', 'pname', 'street', 'house', 'flat', 'disabled', 'paymentdate', 'login', 'password'],
					userHiddenCols: ['regdate', 'editdate'],
					excludedFields: userExcludedFields,
					configProxy: configProxy,
					virtualFields: {
						state: {
							order: 0
						},
						contract: {
							order: 2
						},
						username: {
							order: 3
						},
						address: {
							order: 9
						}
					},
					waitForStores: [
						'city',
						'street',
						'router',
						'tariff',
						'activeorder'
					],
					filters: {
						state: {
							name: "state",
							column: 'state',
							filterFunction: function(id, selectedValue) {
								var store = Nuance.stores.user;
								switch (selectedValue) {
									case 'disabled':
										return store.data[id][store.ns.disabled];
									case 'deny':
										return !activeOrder.hasOwnProperty(id) && !store.data[id][store.ns.disabled];
									case 'allow':
										return activeOrder.hasOwnProperty(id) && !store.data[id][store.ns.disabled];
								}
							},
							store: new Nuance.MemoryStore({
								name: 'filter-options',
								header: [
									['id', 'text'],
									['name', 'text']
								],
								data: {
									allow: ['allow', _("allow")],
									deny: ['deny', _("deny")],
									disabled: ['disabled', _("disabled")]
								}
							})
						},
						referer: false,
						disabled: false
					},
					store: new Nuance.Store({
						name: 'user',
						getNameByIdFn: function(id) {
							var row = this.getById(id);
							var ns = this.ns;
							if (row) {
								return idRenderer(id, row, ns) + ' - ' + (row[this.ns.sname] + (row[this.ns.fname] ? " " + row[this.ns.fname][0].toUpperCase() + "." : "") + (row[this.ns.pname] ? " " + row[this.ns.pname][0].toUpperCase() + "." : ""));
							} else {
								return '';
							}
						}
					}),
					customFields: {
						referrer: {
							parentList: false,
              avoidSort: true,
							selectOnlyItem: false,
							showNotSelected: true
						}
					},
					toolbarButtons: [],
					contextMenuItems: [],
					sorters: {
						iplist: ip2long,
						id: idSorter,
						cash: function(v, cash) {
							return cash;
						},
						discount: function(d, v) {
							if (v[v.length - 1] === '%') {
								return parseInt(v.substr(0, v.length - 1));
							} else {
								return parseInt(v);
							}
						}
					},
					name: 'user'
				}
			},
			ip: {
				title: _("IP accounts"),
				name: 'ip',
				grid: {
					store: new Nuance.Store({
						name: 'ip'
					}),
					waitForStores: ['user', 'router'],
					hiddenCols: ['id'],
					name: 'ip',
					sorters: {
						ip: ip2long
					},
					excludedFields: ['id']
				}
			},
			ppp: {
				title: _("PPP accounts"),
				name: 'ppp',
				grid: {
					store: new Nuance.Store({
						name: 'ppp'
					}),
					waitForStores: ['user', 'router'],
					hiddenCols: ['id', 'password'],
					name: 'ppp',
					sorters: {
						localip: ip2long,
						remoteip: ip2long
					},
					excludedFields: ['id']
				}
			},
			message: false,
			moneyflow: {
				title: _("Payments history"),
				name: 'moneyflow',
				grid: {
					waitForStores: [
						'user',
						'tariff',
						'order',
						'master'
					],
					store: new Nuance.Store({
						name: 'moneyflow',
						filter: {date: getMonthFilter(date)},
						autoLoad: true
					}),
					configProxy: configProxy,
					name: 'moneyflow',
					readOnly: true,
					hiddenCols: ['detailsname', 'detailsid'],
					excludedFields: ['detailsid', 'detailsname', 'user', 'sum', 'date', 'refund', 'name', 'comment'],
					toolbarButtons: [],
          filters: {
						date: {
							name: "date",
							column: 'date',
              type: 'remote',
							filterFunction: function(id, selectedValue) {
							},
              avoidSort: true,
              changeFunction: function(value) {
                this.store.setFilter(value);
                this.store.load();
              },
							store: Nuance.stores['moneyflow-months']
						},
						refund: false
					},
					contextMenuItems: []
				}
			},
			tariff: {
				title: _("Tariffs"),
				name: 'tariff',
				grid: {
					waitForStores: [
						'city'
					],
					store: new Nuance.Store({
						autoLoad: true,
						name: 'tariff'
					}),
					configProxy: configProxy,
					name: 'tariff',
					hiddenCols: ['nightupspeed', 'nightdownspeed', 'downburstlimit', 'upburstlimit', 'downburstthreshold', 'upburstthreshold', 'downbursttime', 'upbursttime'],
					onlyIncludedFields: true,
					includedFields: ['id', 'name', 'price', 'comment', 'public', 'city', 'upspeed', 'downspeed']
				}
			},
			city: {
				title: _("Cities"),
				name: 'city',
				group: 'locations',
				hideReadOnly: true,
				grid: {
					store: new Nuance.Store({
						autoLoad: true,
						name: 'city'
					}),
					configProxy: configProxy,
					name: 'city'
				}
			},
			street: {
				title: _("Streets"),
				group: 'locations',
				hideReadOnly: true,
				name: 'street',
				grid: {
					store: new Nuance.Store({
						autoLoad: true,
						name: 'street'
					}),
					waitForStores: [
						'city'
					],
					configProxy: configProxy,
					name: 'street'
				}
			},
			router: {
				title: _("Routers"),
				hideReadOnly: true,
				name: 'router',
				grid: {
					store: new Nuance.Store({
						autoLoad: true,
						name: 'router'
					}),
					virtualFields: {
						cpuload: {
							order: 7
						},
						freeram: {
							order: 7
						},
						version: {
							order: 7
						}
					},
					configProxy: configProxy,
					name: 'router',
					hiddenCols: ['pass'],
					contextMenuItems: [{
							title: _("CPU Stats"),
							beforeshow: function(selectionId, grid) {
								var grid = Nuance.grids.router;
								this.disabled = grid.getSelectedItems().length !== 1;
							},
							onclick: function() {
								var grid = Nuance.grids.router;
								var routerId = grid.getSelectedItems()[0];
								if (routerId) {
									new Nuance.StatsPopup({
										title: _("Router CPU statistics"),
										path: 'graphs/cpu',
										extraParams: '&router=' + routerId
									});
								}
							}
						}, {
							title: _("Interface Stats"),
							beforeshow: function(selectionId, grid) {
								var grid = Nuance.grids.router;
								this.disabled = grid.getSelectedItems().length !== 1;
							},
							onclick: function() {
								var grid = Nuance.grids.router;
								var routerId = grid.getSelectedItems()[0];
								var ifaceName = configProxy.getValue('router', 'main', 'outInterface', routerId);
								if (ifaceName) {
									new Nuance.StatsPopup({
										title: _("Router interface statistics"),
										path: 'graphs/iface/' + ifaceName,
										extraParams: '&router=' + routerId
									});
								} else {
									new Nuance.MessageBox({
										text: _("Outer interface is not selected"),
										title: _("Error")
									});
								}
							}
						}, {
							title: _("Router preferences"),
							beforeshow: function(selectionId, grid) {
								var grid = Nuance.grids.router;
								this.disabled = grid.getSelectedItems().length !== 1;
							},
							onclick: function() {
								var grid = Nuance.grids.router;
								var routerId = grid.getSelectedItems()[0];
								var ifacesStore = Nuance.stores['routerinterfaces' + routerId] || new Nuance.Store({
									name: 'routerinterfaces' + routerId,
									path: '/interface/' + routerId + '/get',
									forceLoad: true
								});
								new Nuance.PreferencesPopup({
									configProxy: configProxy,
									owner: routerId,
									type: 'router',
									customOptions: {
										router: {
											main: {
												outInterface: {
													type: 'link',
													store: ifacesStore
												},
												filterType: {
													type: 'link',
													store: filterTypeStore
												}
											}
										}
									}
								});
							}
						}

					]
				}
			},
			master: {
				title: _("Administrators"),
				hideReadOnly: true,
				name: 'master',
				grid: {
					name: 'master',
					store: new Nuance.Store({
						autoLoad: true,
						name: 'master',
						getNameByIdFn: function(id) {
							var row = this.getById(id);
							if (row) {
								return row[this.ns.login];
							} else
								return '';
						}
					}),
					customFields: {
						permittedstreet: {
							parentList: 'city'
						}
					},
					waitForStores: [],
					configProxy: configProxy,
					hiddenCols: ['theme', 'config', 'type', 'password', 'group'],
					excludedFields: ['group']
				}
			},
			group: false,
			log: {
				title: _("Log"),
				name: 'log',
				grid: {
					name: 'log',
					readOnly: true,
					store: new Nuance.Store({
						autoLoad: true,
						filter: {date: getMonthFilter(date)},
						name: 'log'
					}),
					virtualFields: {
						description: {
							order: 7
						}
					},
					hiddenCols: ['subtype', 'action', 'olddata', 'newdata'],
					waitForStores: [
						'master',
						'user',
						'router'
					],
          filters: {
						date: {
							name: "date",
							column: 'date',
              type: 'remote',
              avoidSort: true,
							filterFunction: function(id, selectedValue) {
							},
              changeFunction: function(value) {
                this.store.setFilter(value);
                this.store.load();
              },
							store: Nuance.stores['log-months']
						},
          },
					configProxy: configProxy
				}
			},
			divider: tabPanelDivider
		}
	};

	function formatMac(beforeEvent, id, postData) {
		if (postData.mac) {
			postData.mac = postData.mac.toLowerCase().replace(/[^0-9a-f]/g, '');
		}
	}
	Nuance.stores.ip.on('beforeadd', formatMac);
	Nuance.stores.ip.on('beforeset', formatMac);


	tables.tabs.tariff.grid.filters = {
    city: {
      name: "city",
      column: 'city',
      filterFunction: function(id, selectedValue) {
        var tariffStore = Nuance.stores.tariff;
        return tariffStore.data[id][tariffStore.ns.city].indexOf(selectedValue.toString()) !== -1;
      },
      store: Nuance.stores.city
    }
	};

	var fractionalPart = configProxy.getValue('system', 'cash', 'fractionalPart');
	if (fractionalPart) {
		var cashFormat = '%.' + fractionalPart + 'f';
		formatMoney = function(v) {
			var cash = sprintf(cashFormat, v);
			cash = cash.substr(0, cash.length - 1 - fractionalPart) + '<em class="disabled_text">' + cash.substr(cash.length - 1 - fractionalPart) + '</em>';
			return cash;
		};
	} else {
		formatMoney = function(v) {
			return Math.round(v);
		};
	}

	for (var i = 0; i < pluginsLoaders.length; i++) {
		pluginsLoaders[i]();
	}

	// Init widgets
	widgetPanel.initWidgets();
	window.trigger('afterpluginsload');

	// Add documents tab
	pluginsTabs.documents = {
		title: _("Documents"),
		name: 'documents',
		content: (new Nuance.input.Documents).body
	};

	if (checkPermission(['table', 'user', 'edit', 'disabled'])) {
		tables.tabs.user.grid.contextMenuItems.push({
			action: 'disable',
			beforeshow: function(selectionId, grid) {
				var grid = Nuance.grids.user;

				if (grid.getSelectedItems().length !== 1) {
					this.disabled = true;
					this.title = _("Disable");
				} else {
					var userStore = Nuance.stores.user,
						selectedUserId = Nuance.grids.user.getSelectedItems()[0],
						selectedUser = userStore.getById(selectedUserId),
						userIsDisabled = selectedUser[userStore.ns.disabled];
					this.disabled = false;
					this.title = userIsDisabled ? _("Enable") : _("Disable");
					this.onclick = function() {
						var valuesArray = [];
						valuesArray[userStore.ns.disabled] = 0 + !userIsDisabled;
						userStore.edit(selectedUserId, valuesArray);
					};
				}
			},
			bottomSeparator: true

		});
	}

	if (checkPermission(['statistics'])) {
		tables.tabs.user.grid.contextMenuItems.push({
			title: _("Stats"),
			beforeshow: function(selectionId, grid) {
				var grid = Nuance.grids.user;
				this.disabled = grid.getSelectedItems().length !== 1;
			},
			onclick: function() {
				var grid = Nuance.grids.user;
				var id = grid.getSelectedItems()[0];
				var routerId = id ? grid.store.getById(id)[grid.store.ns.router] : undefined;
				if (routerId) {
					new Nuance.StatsPopup({
						title: _("User statistics"),
						path: 'graphs/queue/' + id,
						extraParams: '&router=' + routerId
					});
				} else {
					new Nuance.MessageBox({
						text: _("User dont have the router"),
						title: _("Error")
					});
				}
			}
		});
	}

	if (checkPermission(['table', 'moneyflow', 'add'])) {
		tables.tabs.user.grid.contextMenuItems.push({
			title: _('Fund'),
			beforeshow: function(selectionId, grid) {
				var grid = Nuance.grids.user;
				this.disabled = grid.getSelectedItems().length !== 1;
			},
			onclick: function() {
				var grid = Nuance.grids.user;
				var id = grid.getSelectedItems()[0];
				new Nuance.FundPopup({
					userId: id
				});
			}
		});

		tables.tabs.user.grid.toolbarButtons.push({
			value: _("Fund"),
			iconClass: 'money',
			onselectionchange: function(selectionId, grid) {
				this.setDisabled(selectionId.length !== 1 || !checkPermission(['table', 'moneyflow', 'add']));
			},
			onclick: function() {
				var grid = Nuance.grids.user;
				var id = grid.getSelectedItems()[0];
				new Nuance.FundPopup({
					userId: id
				});
			}
		});

		tables.tabs.moneyflow.grid.toolbarButtons.push({
			value: _("Fund"),
			iconClass: 'money',
			onclick: function() {
				new Nuance.FundPopup({});
			}
		});

	}

	if (checkPermission(['table', 'moneyflow', 'read'])) {
		tables.tabs.user.grid.contextMenuItems.push({
			title: _("Payments history"),
			beforeshow: function(selectionId, grid) {
				var grid = Nuance.grids.user;
				this.disabled = grid.getSelectedItems().length !== 1;
			},
			onclick: function() {
				var grid = Nuance.grids.user;
				var id = grid.getSelectedItems()[0];
				showUserPayments(id);
			}
		});
	}

	if (checkPermission(['table', 'moneyflow', 'edit'])) {
		tables.tabs.moneyflow.grid.contextMenuItems.push({
			title: _("Refund"),
			beforeshow: function(selectionId, grid) {
				var grid = Nuance.grids.user;
				this.disabled = grid.getSelectedItems().length !== 1;
			},
			onclick: function() {
				var grid = Nuance.grids.moneyflow;
				var id = grid.getSelectedItems()[0];
				refund(id);
			}
		});
	}

	if (checkPermission(['preference', 'user'])) {
		tables.tabs.user.grid.contextMenuItems.push({
			title: _("Preferences"),
			beforeshow: function(selectionId, grid) {
				var grid = Nuance.grids.user;
				this.disabled = grid.getSelectedItems().length !== 1;
			},
			onclick: function() {
				var grid = Nuance.grids.user;
				var userId = grid.getSelectedItems()[0];
				new Nuance.PreferencesPopup({
					configProxy: configProxy,
					owner: userId,
					type: 'subscriber',
					customOptions: {
						router: {
							main: {
								filterType: {
									type: 'link',
									store: filterTypeStore
								}
							}
						}
					}
				});
			}
		});
	}

	if (checkPermission(['table', 'moneyflow', 'add'])) {
		tables.tabs.user.grid.contextMenuItems.push({
			title: _("Free internet"),
			beforeshow: function(selectionId, grid) {
				var grid = Nuance.grids.user;
				this.disabled = grid.getSelectedItems().length !== 1;
			},
			topSeparator: true,
			bottomSeparator: true,
			onclick: function() {
				var grid = Nuance.grids.user;
				var userStore = Nuance.stores.user;
				var id = grid.getSelectedItems()[0];
				var tariffId = id ? userStore.getById(id)[userStore.ns.tariff] : undefined;
				if (tariffId) {
					new Nuance.FreeInetPopup({
						tariff: tariffId,
						user: id
					});
				} else {
					new Nuance.MessageBox({
						text: _("User have no selected tariff"),
						title: _("Error")
					});
				}
			}
		});
	}

	if (checkPermission(['preference', 'system'])) {
		tables.tabs.divider = tabPanelDivider;
		tables.tabs.preferences = {
			title: _("Preferences"),
			name: 'preferences'
		};
	}

	if (!checkPermission(['statistics'])) {
		delete tables.tabs.dash;
	}

	var pluginsTabsCount = 0;
	for (var i in pluginsTabs) {
		if (pluginsTabs.hasOwnProperty(i)) {
			pluginsTabsCount++;
		}
	}
	var toolsTabPanel;
	if (pluginsTabsCount) {
		toolsTabPanel = new Nuance.TabPanel({
			name: 'tools',
			prefix: 'v',
			selectedTab: location.hash.substr(location.hash.indexOf('/') + 1),
			tabs: pluginsTabs
		});
		tables.tabs.tools = {
			title: _("Tools"),
			name: 'tools',
			content: toolsTabPanel.body
		};

		function onToolsTabChange(tabName) {
			location.hash = (location.hash.substr(0, location.hash.indexOf('/') + 1) || location.hash + '/') + tabName;
		}
		toolsTabPanel.on('tabchange', onToolsTabChange);
	}

	if (checkPermission(['preference', 'system'])) {
		tables.tabs.about = {
			title: _("About"),
			name: 'about'
		};
	}

	for (var i in tables.tabs) {
		if (!checkPermission(['table', tables.tabs[i].name, 'show']) && tables.tabs[i].name !== 'dash') {
			delete tables.tabs[i];
		}
	}
	loadOnDemandTables = ['moneyflow', 'scratchcard', 'log'];

	TabPanel = new Nuance.TabPanel(tables);
	var switchEl = TabPanel.body.firstChild;
	var stretchEl = ce('li', {
		className: 'spoiler-stretch'
	}, TabPanel.body.firstChild);
	var spoilerEl = ce('li', {
		className: 'spoiler icon menu'
	}, TabPanel.body.firstChild);
	var spoilerList = ce('ul', null, spoilerEl);
	var previousWidth = document.body.clientWidth;

	function restoreHiddenItems() {
		while (spoilerList.children.length) {
			switchEl.insertBefore(spoilerList.firstChild, stretchEl);
		}
	}

	function getItemsTotalWidth() {
		var width = 0;
		for (var i = 0; i < switchEl.children.length; i++) {
			if (!switchEl.children[i].classList.contains('stretch')) {
				width += switchEl.children[i].clientWidth;
			}
		}
		return width;
	}

	var itemsTotalWidth = getItemsTotalWidth();

	function onResize() {
		var windowWidth = document.body.clientWidth;

		if (windowWidth < 1024) {
			switchEl.classList.remove('overflow');
			restoreHiddenItems();
		} else {
			if (windowWidth < itemsTotalWidth) {
				switchEl.classList.add('overflow');

				while ((switchEl.scrollWidth <= windowWidth) && spoilerList.firstChild) {
					switchEl.insertBefore(spoilerList.firstChild, stretchEl);
				}
				while (switchEl.scrollWidth > windowWidth) {
					if (switchEl.children[switchEl.children.length - 2] === stretchEl) {
						var removedItem = switchEl.removeChild(switchEl.children[switchEl.children.length - 3]);
					} else {
						var removedItem = switchEl.removeChild(switchEl.children[switchEl.children.length - 2]);
					}
					spoilerList.insertBefore(removedItem, spoilerList.firstChild);
				}
			} else {
				switchEl.classList.remove('overflow');
				restoreHiddenItems();
			}
		}
	}

	window.addEventListener('resize', onResize);
	onResize();

	if (Nuance.grids.user) {
		function extendUserForm(form) {
			var isAdding = form.constructor == Nuance.AddPopup;
			//form._popupWin.classList.remove('double');
			//form._popupWin.classList.add('triple');
			//form.body.classList.add('flex');

			var dataEl = ce('div', {
				className: 'popup-body double'
			});

			var preferencesEl = ce('div', {
				className: 'popup-body'
			});

			while (form.body.children.length) {
				var children = form.body.children[0];
				form.body.removeChild(children);
				dataEl.appendChild(children);
			}



			var preferencesPopup = new Nuance.RouterUserPreferencesActivity({
				configProxy: configProxy,
				owner: form.recordId,
				type: 'subscriber'
			});
			preferencesEl.appendChild(preferencesPopup.body);

			var popupTabs = {
				data: {
					title: _("Main data"),
					name: 'data',
					content: dataEl
				},
				preferences: {
					title: _("Preferences"),
					name: 'preferences',
					content: preferencesEl
				}
			};
			var tabPanel = new Nuance.TabPanel({
				target: form.body,
				prefix: 'prefpopup',
				tabs: popupTabs
			});
			form.on('save', function() {
				preferencesPopup.save();
			});
		}
		Nuance.grids.user.on('addform', extendUserForm);
		Nuance.grids.user.on('editform', extendUserForm);

		;
	}

	if (Nuance.grids.router) {

		function extendRouterForm(form) {
			form.body.classList.add('flex');

			var dataEl = ce('div', {
				className: 'popup-body double'
			});
			var preferencesEl = ce('div', {
				className: 'popup-body'
			});

			while (form.body.children.length) {
				var children = form.body.children[0];
				form.body.removeChild(children);
				dataEl.appendChild(children);
			}



			var ifacesStore = Nuance.stores['routerinterfaces' + form.recordId] || new Nuance.Store({
				name: 'routerinterfaces' + form.recordId,
				subscribePath: ['interface', form.recordId],
				path: 'interface/' + form.recordId + '/get',
				forceLoad: true
			});
			var preferencesPopup = new Nuance.RouterUserPreferencesActivity({
				configProxy: configProxy,
				owner: form.recordId,
				type: 'router',
				customOptions: {
					router: {
						main: {
							outInterface: {
								type: 'link',
								store: ifacesStore
							},
						},
            ip: {
							filterType: {
								type: 'link',
								store: filterTypeStore
							}
            }
					}
				}
			});
			preferencesEl.appendChild(preferencesPopup.body);
			var popupTabs = {
				data: {
					title: _("Main data"),
					name: 'data',
					content: dataEl
				},
				preferences: {
					title: _("Preferences"),
					name: 'preferences',
					content: preferencesEl
				}
			};
			var tabPanel = new Nuance.TabPanel({
				target: form.body,
				prefix: 'prefpopup',
				tabs: popupTabs
			});
		}

		Nuance.grids.router.on('addform', extendRouterForm);
		Nuance.grids.router.on('editform', extendRouterForm);

	}

	Nuance.grids.user && Nuance.grids.user.on('beforerender', function(formattingRows, data, ns, displayData, displayNs) {
		// State
		var stateIndex = displayNs.state;
		var disabledCls = 'disabled';
		var allowCls = 'allow';
		var denyCls = 'deny';
		var disabledHTML = '<p class="state ' + disabledCls + '" title="' + _(disabledCls) + '"></p>';
		var allowHTML = '<p class="state ' + allowCls + '" title="' + _(allowCls) + '"></p>';
		var denyHTML = '<p class="state ' + denyCls + '" title="' + _(denyCls) + '"></p>';
		var contractIndex = displayNs.contract;
		var usernameIndex = displayNs.username;
		var trimUserName = configProxy.getValue('system', 'grid', 'trimUserName');

		var addressIndex = displayNs.address;

		var tariffIndex = displayNs.tariff;

		var ipListIndex = displayNs.iplist;
		for (var id in data) {
			var row = data[id];

			// State
			if (data[id][ns.disabled]) {
				displayData[id][stateIndex] = disabledHTML;
			} else {
				if (activeOrder[id]) {
					displayData[id][stateIndex] = allowHTML;
				} else {
					displayData[id][stateIndex] = denyHTML;
				}
			}

			// Contract ID
			displayData[id][contractIndex] = idRenderer(data[id][ns.id], data[id], ns);

			// Username
			var row = data[id];
			if (trimUserName) {
				displayData[id][usernameIndex] = (row[ns.sname] || '') + ((row[ns.fname] && row[ns.fname][0]) ? " " + row[ns.fname][0].toUpperCase() + "." : "") + ((row[ns.pname] && row[ns.pname][0]) ? " " + row[ns.pname][0].toUpperCase() + "." : "");
			} else {
				displayData[id][usernameIndex] = (row[ns.sname] || '') + ' ' +
					(row[ns.fname] || '') + ' ' +
					(row[ns.pname] || '');
			}

			// Address
			var streetRow = Nuance.stores.street.getById(row[ns.street]);
			var street = streetRow ? streetRow[Nuance.stores.street.ns.name] : '';
			var address = street;
			if (street && row[ns.house]) {
				address += ', ';
			}
			if (row[ns.house]) {
				address += row[ns.house];
				if (row[ns.flat]) {
					address += "/" + row[ns.flat];
				}
			}
			displayData[id][addressIndex] = address;

			// Tariff
			var userId = row[ns.id];
			var changeTariffArrow = '<span class="icon arrowright"></span>';
			var selectedTariffId = row[ns.tariff];
			var selectedTariffName = Nuance.stores.tariff.getNameById(selectedTariffId);
			if (activeOrder[userId]) {
				var activeTariffId = parseInt(activeOrder[userId][Nuance.stores.activeorder.ns.detailsid]);
				if (activeTariffId !== selectedTariffId) {
					displayData[id][tariffIndex] = Nuance.stores.tariff.getNameById(activeTariffId) + changeTariffArrow + selectedTariffName;
				}
			} else {
				displayData[id][tariffIndex] = selectedTariffName;
			}
			// IP list
			if (data[id][ns.iplist]) {
				var ipList = data[id][ns.iplist].match(/"([0-9\.]+)":/g) || [];
				for (var i = 0; i < ipList.length; i++) {
					ipList[i] = ipList[i].substr(1, ipList[i].length - 3);
				}
				displayData[id][ipListIndex] = ipList.join(", ");
			}

			// Discount
			var v = row[ns.discount];
			if (v[v.length - 1] === '%') {
				displayData[id][displayNs.discount] = v;
			} else if (v !== '0') {
				displayData[id][displayNs.discount] = formatMoney(v);
			} else {
				displayData[id][displayNs.discount] = '<p class="disabled_text">' + _("None") + "</p>"
			}

			// Cash
			displayData[id][displayNs.cash] = formatMoney(row[ns.cash]);
		}
	});

	Nuance.grids.ip && Nuance.grids.ip.on('beforerender', function(formattingRows, data, ns, displayData, displayNs) {
		var macIndex = displayNs.mac;
		for (var id in data) {
			var row = data[id];

			// Refund type
			displayData[id][macIndex] = row[ns.mac] ? row[ns.mac].replace(/:/g, '').toUpperCase().match(/.{1,2}/g).join(":") : '';

		}
	});
	Nuance.grids.moneyflow && Nuance.grids.moneyflow.on('beforerender', function(formattingRows, data, ns, displayData, displayNs) {
    

		var nameIndex = displayNs.name;
		var userIndex = displayNs.user;
		var refundTypeIndex = displayNs.refund;
		for (var id in data) {
			var row = data[id];

			// Refund type
			displayData[id][refundTypeIndex] = row[ns.refund] ? '<p class="icon refund"></p>' : '';
			// Name
			if (row[ns.name]) {
				displayData[id][nameIndex] = row[ns.name];
			} else {
				var detailsName = row[ns.detailsname];
				var detailsId = row[ns.detailsid];
				switch (detailsName) {
					case 'scratchcard':
						{
							displayData[id][nameIndex] = _('Fund with scratchcard');
							break;
						}
					case 'refund':
						{
							displayData[id][nameIndex] = sprintf(_('Refund operation %s'), detailsId);
							break;
						}
					case 'referrerpay':
						{
							displayData[id][nameIndex] = sprintf(_('Referral charge from %s'), Nuance.stores.user.getNameById(detailsId));
							break;
						}
					case 'order':
					case 'temporder':
						{
							var order = Nuance.stores.order.getById(detailsId);
							if (order) {
								var orderNs = Nuance.stores.order.ns;
								var startDate = order[orderNs.startdate];
								var endDate = order[orderNs.enddate];
								if (detailsName === 'order') {
									var text = _('Order ');
								} else {
									var text = _('Temporary order ');
								}
								displayData[id][nameIndex] = text + Nuance.stores.tariff.getNameById(order[orderNs.detailsid]) + _(' from ') + startDate + _(' to ') + endDate;
							} else {
								displayData[id][nameIndex] = _('Unknown order');
							}
							break;
						}
					case 'adminpay':
						{
							displayData[id][nameIndex] = _('Fund by ') + Nuance.stores.master.getNameById(detailsId);
							break;
						}
					default:
						displayData[id][nameIndex] = '';
						break;
				}
			}
		}
	});

  Nuance.stores.log.on('afterload', function() {
    
  });

	Nuance.grids.log && Nuance.grids.log.on('beforerender', function(formattingRows, data, ns, displayData, displayNs) {
		var typeIndex = ns.type,
			subtypeIndex = ns.subtype,
			oldDataIndex = ns.olddata,
			newDataIndex = ns.newdata,
			targetSectionIndex = ns.targetsection,
			targetIdIndex = ns.targetid,
			masterIndex = ns.master;

		var displayTypeIndex = displayNs.type;
		var displayMasterIndex = displayNs.master;
		var displayTargetSectionIndex = displayNs.targetsection;
		var displayTargetIdIndex = displayNs.targetid;
		var displayDescriptionIndex = displayNs.description;

		var action = '';
		var description = '';
		var row,
			newData,
			oldData,
			detailsData = [];

		for (var id in data) {
			action = '';
			description = '';
			newData = '';
			oldData = '';
			row = data[id];

			// User
			switch (row[typeIndex]) {
				case 'db':
					{
						var targetStore = Nuance.stores[row[targetSectionIndex]];
						var ns = targetStore.ns;
						if (targetStore) {
							displayData[id][displayTargetSectionIndex] = _(row[targetSectionIndex]);
							displayData[id][displayTargetIdIndex] = targetStore.getNameById(row[targetIdIndex]);
						}

						switch (row[subtypeIndex]) {
							case 'add':
								action = _("Add to database");
								if (row[oldDataIndex]) {
									oldData = JSON.parse(row[oldDataIndex]);
								}
								if (row[newDataIndex]) {
									newData = JSON.parse(row[newDataIndex]);
								}
								detailsData = [];
								if (newData) {
									var value;
									for (var i in newData) {
										value = newData[i];
										if (value && value !== '0') {
											var store = Nuance.stores[i];
											if (store && ns && ns[i] && targetStore.header[ns[i]][1] === 'link') {
												value = store.getNameById(value);
											} else if (store && ns && ns[i] && (targetStore.header[ns[i]][1] === 'link' || targetStore.header[ns[i]][1] === 'tarifflink')) {
												value = store.getNameById(value);
											} else if (store && ns && ns[i] && targetStore.header[ns[i]][1] === 'multilink') {
												if (typeof value == 'string') {
													var values = value.split(',');
												} else {
													var values = value;
												}
												for (var j = 0; j < values.length; j++) {
													values[j] = store.getNameById(values[j]);
												}
												value = values.join(', ');
											}
											detailsData.push(_(i) + ': ' + value);
										}
									}
									description = detailsData.join(', ');
								}
								break;
							case 'edit':
								action = _("Changes in database");
								if (row[oldDataIndex]) {
									oldData = JSON.parse(row[oldDataIndex]);
								}
								if (row[newDataIndex]) {
									newData = JSON.parse(row[newDataIndex]);
								}
								detailsData = [];
								if (newData && oldData) {
									var oldValue;
									var newValue;
									for (var i in newData) {
										oldValue = oldData[i];
										newValue = newData[i];
										if (oldValue !== newValue) {
											var store = Nuance.stores[i];
											if (typeof oldValue == 'undefined' || oldValue === '' || oldValue === null) {
												oldValue = '<span class="disabled_text">' + _("Empty value") + '</span>';
											} else if (targetStore && ns && targetStore.header[ns[i]][1] === 'tinyint') {
												oldValue = oldValue == '1' ? _("Yes") : _("No");
											} else if (store && ns && ns[i] && (targetStore.header[ns[i]][1] === 'link' || targetStore.header[ns[i]][1] === 'tarifflink')) {
												oldValue = store.getNameById(oldValue);
											} else if (store && ns && ns[i] && targetStore.header[ns[i]][1] === 'multilink') {
												if (typeof oldValue == 'string') {
													var oldValues = oldValue.split(',');
												} else {
													var oldValues = oldValue;
												}
												for (var j = 0; j < oldValues.length; j++) {
													oldValues[j] = store.getNameById(oldValues[j]);
												}
												oldValue = oldValues.join(', ');
											}

											if (typeof newValue == 'undefined' || newValue === '' || newValue === null) {
												newValue = '<span class="disabled_text">' + _("Empty value") + '</span>';
											} else if (targetStore && ns && targetStore.header[ns[i]][1] === 'tinyint') {
												newValue = newValue == '1' ? _("Yes") : _("No");
											} else if (store && ns && ns[i] && (targetStore.header[ns[i]][1] === 'link' || targetStore.header[ns[i]][1] === 'tarifflink')) {
												newValue = store.getNameById(newValue);
											} else if (store && ns && ns[i] && targetStore.header[ns[i]][1] === 'multilink') {
												if (typeof newValue == 'string') {
													var newValues = newValue.split(',');
												} else {
													var newValues = newValue;
												}
												for (var j = 0; j < newValues.length; j++) {
													newValues[j] = store.getNameById(newValues[j]);
												}
												newValue = newValues.join(', ');
											}
											detailsData.push(_(i) + ': ' + oldValue + ' <span class="icon arrowright">&nbsp;</span> ' + newValue);
										}
									}
									description = detailsData.join(', ');
								}
								break;
							case 'delete':
								action = _("Remove from database");
								break;
						}
					}
					break;
				case 'auth':
					{
						var targetStore = Nuance.stores[row[targetSectionIndex]];
						var ns = targetStore.ns;
						if (targetStore) {
							displayData[id][displayTargetSectionIndex] = _(row[targetSectionIndex]);
							displayData[id][displayTargetIdIndex] = targetStore.getNameById(row[targetIdIndex]);
						}
						switch (row[subtypeIndex]) {
							case 'login':
							case 'badlogin':
								if (row[newDataIndex]) {
									newData = JSON.parse(row[newDataIndex]);
									if (newData) {
										detailsData = [];
										for (var i in newData) {
											detailsData.push(_(i) + ': ' + newData[i]);
										}
										description = detailsData.join(', ');
									}
								}
								if (row[subtypeIndex] === 'login') {
									action = _("Successful login");
								} else {
									action = _("Unsuccessful login");
								}
								break;
						}
					}
					break;

			}

			displayData[id][displayTypeIndex] = action;
			displayData[id][displayDescriptionIndex] = description;
		}
	});

	var preferencesWasLoaded = false;
	var aboutWasLoaded = false;

	function loadPreferences() {
		preferencesWasLoaded = true;
		var preferencesPopup = new Nuance.PreferencesActivity({
			configProxy: configProxy,
			target: TabPanel.tabs.preferences,
			type: 'system',
			customOptions: {
				system: {
					main: {
						timezone: {
							type: 'charlink',
							store: Nuance.stores.timezone
						}
					},
					ucp: {
						documents: {
							type: 'hidden'
						},
						mainPageText: {
							type: 'multitext'
						},
						contactsPageText: {
							type: 'multitext'
						}
					}
				}
			}
		});
	}

	function onTabSwitch(tabName) {
		location.hash = tabName;

		if (loadOnDemandTables.indexOf(tabName) !== -1 && Nuance.grids[tabName].store.getFilter() !== {}) {
			//Nuance.grids[tabName].store.setFilter({});
			Nuance.grids[tabName].store.load();
		} else if (tabName === 'about' && !aboutWasLoaded) {
			showAbout();
			aboutWasLoaded = true;
		} else if (tabName === 'preferences' && !preferencesWasLoaded) {
			loadPreferences();
		} else {
			Nuance.grids[tabName] && Nuance.grids[tabName].onDataChange();

		}
	}

	TabPanel.on('tabchange', onTabSwitch);
	if (TabPanel.getSelectedTab()) {
		if (TabPanel.getSelectedTab().name === 'preferences') {
			loadPreferences();
		} else if (TabPanel.getSelectedTab().name === 'about') {
			showAbout();
			aboutWasLoaded = true;
		}
	}
};

var acl;

function loadAcl(response) {
	acl = response.acl;
	configProxy = new Nuance.ConfigProxy({
		onload: onConfigLoad,
		autoLoad: true,
		onedit: {
			user: {
				width: function() {
					var cssStr = "";
					if (configProxy.__config.user[userId]) {
						var css = configProxy.__config.user[userId].width;
						for (var rule in css) {
							var el = rule.split(':');
							cssStr += '#' + el[0] + "-tab span." + el[1] + " {width: " + css[rule] + "px;}\n";
						}
						(ge('configcss') || ce('style', {
							id: 'configcss',
							type: 'text/css'
						}, document.getElementsByTagName('head')[0]))
						.innerHTML = cssStr;
					}
				}
			},
			system: {
				grid: function() {
					var index = userExcludedFields.indexOf('contractid');
					var userIdRenderer = configProxy.getValue('system', 'grid', 'user-idrenderer');
					if (index != -1) {
						userExcludedFields.splice(index, 1);
					}

					if (userIdRenderer != 2) {
						userExcludedFields.push('contractid');
					}
				}
			}
		}
	});
}

ajaxProxy.on(['acl'], loadAcl);

function checkPermission(path) {
	var allow = false;
	var subAcl = acl;
	for (var i = 0; i < path.length; i++) {
		if (subAcl && typeof subAcl === 'object' && subAcl.hasOwnProperty(path[i])) {
			subAcl = subAcl[path[i]];
			if (i + 1 === path.length) {
				allow = true;
				break;
			}
			if (subAcl === true) {
				allow = true;
				break;
			}
		} else if (subAcl === true) {
			allow = true;
			break;
		} else {
			break;
		}
	}
	return allow;
}

ajaxProxy.get('/all/get', {
	activetab: location.hash.replace('#', '')
});


ajaxProxy.on(['errors'], function(data) {
	if (data.errors.length) {
		new Nuance.LogPopup({
			text: data.errors.join("\n")
		});
	}
});
