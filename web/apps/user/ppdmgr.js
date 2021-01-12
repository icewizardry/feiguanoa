CSJSV3.AUI.DataAgent = function(cfg) {
	var _me = this;
	var _reqSvrUrl = '../../api/ppd';
	var _reqSvrUrl_sitectg = '../../api/sitectg';

	{
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
	};

	this.reqSvrUrl = function() {
		return _reqSvrUrl;
	};

	this.loadPpdActForm = function(pars, callback) {
		_me.com().reqByCmd('loadppdactform', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.savePpdActForm = function(pars, callback) {
		_me.com().reqByCmd('saveppdactform', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.loadPpdCtgForm = function(pars, callback) {
		_me.com().reqByCmd('loadppdctgform', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.savePpdCtgForm = function(pars, callback) {
		_me.com().reqByCmd('saveppdctgform', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};
	
	this.getSitectgtreelineardata = function(pars, callback) {
		_me.com().reqByCmd('getsitectgtreelineardata', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl_sitectg);
	};
};
CSJSV3.AUI.DataAgent.prototype = new CSJSV3.SuperHelper();

CSJSV3.AUI.ActPpdMgr = function(cfg) {
	var _me = this;
	var _dataAgent;

	{
    	cfg.canAutoCheckForParentAndChild = false;
		cfg.root = {
			id : '0',
			pid : '',
			title : '根',
			leaf : false,
			hide : false
		};
		cfg.showCheckbox = true;
		cfg.onRenderNodeBefore = function(node) {
			if (node.level < 2) {
				node.state = 'expand';
			}
		};
		cfg.onRenderCheckBox = function(self, node) {
			if(node.level <= 1) {
				return false;
			}
			return true;
		};
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.Tree(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		_dataAgent = new CSJSV3.AUI.DataAgent({});
		_dataAgent.init(world);
	};

	this.saveData = function() {
		_me.world().setLoading(true);
		var keys = [];
		var items = _me.checkedItems(function(dc) {
			if (dc.level > 1) {
				keys.push(dc.id);
			}
			return dc.level > 1;
		});

		_dataAgent.savePpdActForm({
			tgtid : cfg.tgtid,
			tgttype : cfg.tgttype,
			myppdkeys : JSON.stringify(keys)
		}, function(r) {
			_me.world().setLoading(false);
			if (r.success == false) {
				_me.world().showErrorMsg(r.msg);
			} else {
				_me.world().showInfoMsg('保存完毕');
			}
		});
	};

	this.loadData = function(callback) {
		_dataAgent.loadPpdActForm({
			tgtid : cfg.tgtid,
			tgttype : cfg.tgttype
		}, function(r) {
			if (r.success == false) {
				_me.world().showErrorMsg(r.msg);
			} else {
				var arr = [];
				// 遍历组
				for (var i = 0; i < r.data.allppds.length; i++) {
					var group = r.data.allppds[i];
					arr.push({
						id : group.title,
						pid : '0',
						title : group.title
					});
					// 遍历菜单权限
					for (var i1 = 0; i1 < group.items.length; i1++) {
						var ppdMenu = group.items[i1];
						arr.push({
							id : ppdMenu.key,
							pid : group.title,
							title : ppdMenu.title
						});
						// 遍历操作权限
						for (var i2 = 0; i2 < ppdMenu.items.length; i2++) {
							var ppdAct = ppdMenu.items[i2];
							arr.push({
								id : ppdAct.key,
								pid : ppdMenu.key,
								title : ppdAct.title
							});
						}
					}
				}

				_me.data(arr);
				_me.render();

				// 设置默认选中项
				if (r.data.myppdkeys != null && r.data.myppdkeys.length > 0) {
					_me.checkItems(function(dc) {
						return dc.level == 2
								&& _containKey(r.data.myppdkeys, dc.id);
					});
					_me.checkItems(function(dc) {
						return dc.level == 3
								&& _containKey(r.data.myppdkeys, dc.id);
					});
				}
				
				if(callback != null) {
					callback();
				}
			}
		});
	};

	function _containKey(keys, key) {
		for (var i = 0; i < keys.length; i++) {
			if (keys[i] == key) {
				return true;
			}
		}
		return false;
	}
};
CSJSV3.AUI.ActPpdMgr.prototype = new CSJSV3.SuperHelper();

CSJSV3.AUI.CtgPpdMgr = function(cfg) {
	var _me = this;
	var _dataAgent;

	{
		cfg.root = {
			id : '',
			pid : '',
			title : '根',
			leaf : false,
			hide : false
		};
		cfg.showCheckbox = true;
		cfg.onRenderNodeBefore = function(node) {
			if (node.level < 2) {
				node.state = 'expand';
			}
		};
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.Tree(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		_dataAgent = new CSJSV3.AUI.DataAgent({});
		_dataAgent.init(world);
	};

	this.saveData = function() {
		_me.world().setLoading(true);
		var keys = [];
		_me.checkedItems(function(dc) {
			if (dc.level >= 1) {
				keys.push(dc.id);
			}
			return false;
		});

		_dataAgent.savePpdCtgForm({
			tgtid : cfg.tgtid,
			tgttype : cfg.tgttype,
			myppdkeys : JSON.stringify(keys)
		}, function(r) {
			_me.world().setLoading(false);
			if (r.success == false) {
				_me.world().showErrorMsg(r.msg);
			} else {
				_me.world().showInfoMsg('保存完毕');
			}
		});
	};

	this.loadData = function(callback) {
		_dataAgent.loadPpdCtgForm({
			tgtid : cfg.tgtid,
			tgttype : cfg.tgttype
		}, function(r) {
			if (r.success == false) {
				_me.world().showErrorMsg(r.msg);
			} else {
				_me.data(r.data.allppds);
				_me.render();
				
				// 设置默认选中项
				if (r.data.myppdkeys != null && r.data.myppdkeys.length > 0) {
					_me.checkItems(function(dc) {
						return _containKey(r.data.myppdkeys, dc.id);
					});
				}
				
				if(callback != null) {
					callback();
				}
			}
		});
	};

	function _containKey(keys, key) {
		for (var i = 0; i < keys.length; i++) {
			if (keys[i] == key) {
				return true;
			}
		}
		return false;
	}
};
CSJSV3.AUI.CtgPpdMgr.prototype = new CSJSV3.SuperHelper();