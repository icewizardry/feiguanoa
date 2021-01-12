CSJSV3.AUI.SiteCtgDataAgent = function(cfg) {
	var _me = this;
	var _reqSvrUrl = '../../api/sitectg';

	{
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
	};

	this.listSite = function(pars, callback) {
		_me.com().reqByCmd('listsites', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.saveSiteForm = function(pars, callback) {
		_me.com().reqByCmd('savesiteform', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.loadSiteForm = function(pars, callback) {
		_me.com().reqByCmd('loadsiteform', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.removeSiteForm = function(pars, callback) {
		_me.com().reqByCmd('removesiteform', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.listCtg = function(pars, callback) {
		_me.com().reqByCmd('listctgs', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.saveCtgForm = function(pars, callback) {
		_me.com().reqByCmd('savectgform', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.loadCtgForm = function(pars, callback) {
		_me.com().reqByCmd('loadctgform', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.removeCtgForm = function(pars, callback) {
		_me.com().reqByCmd('removectgform', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};
};
CSJSV3.AUI.SiteCtgDataAgent.prototype = new CSJSV3.SuperHelper();

/*onChange(self)*/
CSJSV3.AUI.SiteCtgMgr = function (cfg) {
    var _me = this;
	var _dataAgent;
    

    {
    	if(cfg.style == null) {
    		cfg.style = 'height:26px;';
    	}
    	else {
    		cfg.style = 'height:26px;' + cfg.style;
    	}
    	if(cfg.root == null) {
    		cfg.root = { id : '', pid : '', title : '根', leaf : false, hide: true };
    	}
    	if(cfg.onSelected == null) {
    		cfg.onSelected = function(self, node) {
        	};
    	}
    	if(cfg.onLoadChild == null) {
    		cfg.onLoadChild = function (node, nodeUI, callback) {
                //console.log(node);
                if(node.id == '') {
					_dataAgent.listSite({
						nolimit: cfg.nolimit
					}, function(r) {
						_me.world().setLoading(false);
						if (r.success == false) {
							_me.world().showErrorMsg(r.msg);
							callback(node, nodeUI, null);
						} else {
							var items = [];
							for (var i = 0; i < r.data.length; i++) {
								r.data[i].pid = '';
								if (r.data[i].ctgcount > 0) {
									r.data[i].leaf = false;
								}
								items.push(r.data[i]);
							}
							callback(node, nodeUI, items);
							//_hasLoadCount++;
		                	//onLoadChange();
						}
					});
				} else if (node.parent != null && node.parent.id == '' && (node.type == null || node.type == 'site')) {
					_dataAgent.listCtg({
						pid : node.id,
						ptype : 'site',
						nolimit: cfg.nolimit
					}, function(r) {
						_me.world().setLoading(false);
						if (r.success == false) {
							_me.world().showErrorMsg(r.msg);
							callback(node, nodeUI, null);
						} else {
							var items = [];
							for (var i = 0; i < r.data.length; i++) {
								if (r.data[i].childcount > 0) {
									r.data[i].leaf = false;
								}
								items.push(r.data[i]);
							}
							callback(node, nodeUI, items);
							//_hasLoadCount++;
		                	//onLoadChange();
						}
					});
				} else {
					_dataAgent.listCtg({
						pid : node.id,
						ptype : 'ctg',
						nolimit: cfg.nolimit
					}, function(r) {
						_me.world().setLoading(false);
						if (r.success == false) {
							_me.world().showErrorMsg(r.msg);
							callback(node, nodeUI, null);
						} else {
							var items = [];
							for (var i = 0; i < r.data.length; i++) {
								if (r.data[i].childcount > 0) {
									r.data[i].leaf = false;
								}
								items.push(r.data[i]);
							}
							callback(node, nodeUI, items);
							//_hasLoadCount++;
		                	//onLoadChange();
						}
					});
				}
            };
    	}
        /*继承父级*/
        this.super0(this, new CSJSV3.UI.Tree(cfg));
    }

    this.init = function (world) {
        /*继承父级*/
        _me.base.init(world);
        
		_dataAgent = new CSJSV3.AUI.SiteCtgDataAgent({});
		_dataAgent.init(world);
    };
    
    this.render = function() {
    	_me.base.render();
    };
};
CSJSV3.AUI.SiteCtgMgr.prototype = new CSJSV3.SuperHelper();
