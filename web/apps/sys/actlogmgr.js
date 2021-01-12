CSJSV3.AUI.DataAgent = function(cfg) {
	var _me = this;
	var _reqSvrUrl = '../../api/sys';

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

	this.list = function(pars, callback) {
		_me.world().setLoading(true);
		_me.com().reqByCmd('listactlog', pars, function(r) {
			_me.world().setLoading(false);
			if(r.success == false) {
				_me.world().showErrorMsg(r.msg);
			}
			else {
				if (callback != null) {
					callback(r);
				}
			}
		}, _reqSvrUrl);
	};
};
CSJSV3.AUI.DataAgent.prototype = new CSJSV3.SuperHelper();

CSJSV3.AUI.CurrentListMgrView = function(cfg) {
	var _me = this;
	var _dataAgent;

	{
		_dataAgent = new CSJSV3.AUI.DataAgent({});
		cfg.loadData = function(pars, callback) {
			_dataAgent.list(pars, function(r) {
				callback(r);
			});
		};
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.ListMgrView(cfg));
		/* 定义查询字段 */
		this.base.createSearchFields = function() {
			return [ {
				label : '操作人',
				type : 'text',
				name : 'username',
				value : ''
			}, {
				label : '行为',
				type : 'text',
				name : 'action',
				value : ''
			}, {
				label : '内容',
				type : 'text',
				name : 'content',
				value : ''
			} ];
		};
		/* 定义控制按钮 */
		this.base.createCtrlFields = function() {
			return [];
		};

		this.base.procDataGridCfg = function(cfg1) {
			return cfg1;
		};

		/* 定义列表字段 */
		this.base.createDataGridFields = function() {
			var cols = [];
			cols.push({
				title : 'IP',
				style : 'text-align:center;width:120px;',
				tpl_func : function(vals, index) {
					return vals.ip;
				}
			});
			cols.push({
				title : '操作人',
				style : 'text-align:center;width:80px;',
				tpl_func : function(vals, index) {
					return vals.username;
				}
			});
			cols.push({
				title : '行为',
				style : 'text-align:center;width:120px;',
				tpl_func : function(vals, index) {
					return vals.action;
				}
			});
			cols.push({
				title : '内容',
				style : 'text-align:left;width:300px;',
				tpl_func : function(vals, index) {
					return '<a href="javascript:;" onclick="_world.showInfoMsg(this.innerHTML)">' + vals.content + '</a>';
				}
			});
			cols.push({
				title : '时间',
				style : 'text-align:center;width:160px;',
				tpl_func : function(vals, index) {
					return vals.crttime;
				}
			});
			cols.push({
				title : '浏览器',
				style : 'text-align:left;width:200px;',
				tpl_func : function(vals, index) {
					return '<a href="javascript:;" onclick="_world.showInfoMsg(this.innerHTML)">' + vals.useragent + '</a>';
				}
			});
			cols.push({
				title : '结果',
				style : 'text-align:center;width:60px;',
				tpl_func : function(vals, index) {
					if(vals.success == 1) {
						return '成功';
					}
					return '失败';
				}
			});
			return cols;
		};

		this.base.procPagerCfg = function(cfg1) {
			return cfg1;
		};
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		_dataAgent.init(world);
	};

	this.render = function() {
		_me.base.render();
	};
};
CSJSV3.AUI.CurrentListMgrView.prototype = new CSJSV3.SuperHelper();