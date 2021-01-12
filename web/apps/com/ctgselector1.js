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
CSJSV3.AUI.CtgSelector1 = function (cfg) {
    var _me = this;
    var _win;
    var _sitectg;
	var _dataAgent;
    
    var _onChange;
    
    var hasCheckFirstRenderNode = false;

    {
    	if(cfg.root == null) {
    		cfg.root = { id : '', pid : '', title : '根', leaf : false, hide: true };
    	}
    	if(cfg.style == null) {
    		cfg.style = 'height:26px;';
    	}
    	else {
    		cfg.style = 'height:26px;' + cfg.style;
    	}
        if (cfg.name == null) {
            cfg.name = 'ctgs';
        }
        if (cfg.textFieldName == null) {
            cfg.textFieldName = 'title';
        }
        if (cfg.canInputAdd == null) {
            cfg.canInputAdd = false;
        }
        if (cfg.useFloatPanel == null) {
            cfg.useFloatPanel = false;
        }
        if (cfg.showFloatTableHead == null) {
            cfg.showFloatTableHead = false;
        }
        if (cfg.procItemsToValueStr == null) {
            cfg.procItemsToValueStr = function (items) {
                if (items == null || items.length == 0) {
                    return '';
                }
                return JSON.stringify(items);
            };
        }
        if (cfg.procValueStrToItems == null) {
            cfg.procValueStrToItems = function (valueStr) {
                if (valueStr == null || valueStr == '') {
                    return [];
                }
                else {
                    return JSON.parse(valueStr);
                }
            };
        }
        if(cfg.canSelectProc == null) { cfg.canSelectProc = function(self, node) { return true; } }
        if (cfg.isSameItem == null) {
            cfg.isSameItem = function (item1, item2) {
                return item1.id.toLowerCase() == item2.id.toLowerCase();
            };
        }
        if(cfg.onFocus == null) {
        	cfg.onFocus = function(self) {
        		_sitectg.clearSelectedItem();
        		_win.show();
        	};
        }
        if (cfg.onInputChange == null) {
            cfg.onInputChange = function (self, txt) {
            };
        }
        if(cfg.onChange != null) {
        	_onChange = cfg.onChange;
        	cfg.onChange = function(self) {
        		if(self.value() == '') {
        			cfg.onSelectChange(self, null);
        		}
        		_onChange(_me, _sitectg);
        	};
        }
        else {
        	cfg.onChange = function(self) {
        		if(self.value() == '') {
        			cfg.onSelectChange(self, null);
        		}
        	};
        }
        if(cfg.onSelectChange == null) {
        	cfg.onSelectChange = function(self, node) {};
        }
        /*继承父级*/
        this.super0(this, new CSJSV3.UI.TagInput(cfg));
    }

    this.init = function (world) {
        /*继承父级*/
        _me.base.init(world);
        
		_dataAgent = new CSJSV3.AUI.SiteCtgDataAgent({});
		_dataAgent.init(world);
		
        _sitectg = new CSJSV3.UI.Tree({ 
			root: cfg.root,
        	onSelected: function(self, node) {
        		_win.hide();
        		var dc = { id:node.id, title:node.title, pid:node.pid, ptype:node.ptype, level:node.level, childcount: node.childcount };
        		_me.reset();
                _me.addItem(dc);
                
                if(_onChange != null) {
                	_onChange(_me, self);
                }
                cfg.onSelectChange(_me, node);
        	},
	        canSelectProc: cfg.canSelectProc,
            onLoadChild: function (node, nodeUI, callback) {
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
            }
        });
        _sitectg.init(world);
        
        _win = new CSJSV3.UI.Win({ title: '请选择', body: _sitectg.getUICore(), closeBtnType: 'hide', width: 300, height: 'auto' });
        _win.init(world);
    };
    
    this.render = function() {
    	_win.render();
    	_sitectg.render();
    };
};
CSJSV3.AUI.CtgSelector1.prototype = new CSJSV3.SuperHelper();
