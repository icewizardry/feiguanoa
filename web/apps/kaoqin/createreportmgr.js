CSJSV3.AUI.DataAgent = function(cfg) {
	var _me = this;
	var _reqSvrUrl = '../../api/kaoqin';

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

	this.createReport = function(pars, callback) {
		_me.world().setLoading('生成中，请稍等');
		pars.cs_req_canretry = false;
		pars.cs_req_timeout = 1000 * 60 * 30;
		_me.com().reqByCmd('createreport', pars, function(r) {
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

	this.createUserReport = function(pars, callback) {
		_me.world().setLoading('生成中，请稍等');
		pars.cs_req_canretry = false;
		pars.cs_req_timeout = 1000 * 60 * 10;
		_me.com().reqByCmd('createuserreport', pars, function(r) {
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
			_me.world().setLoading(true);
			_dataAgent.list(pars, function(r) {
			_me.world().setLoading(false);
				callback(r);
			});
		};
		cfg.onSearch = function() {
			var field = _me.searchArea().findFieldByName('yearmonth');
			window.open('../../api/kaoqin?cmd=showreport&year=' + field.item().year() + '&month=' + field.item().month());
		};
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.ListMgrView(cfg));
		/* 定义查询字段 */
		this.base.createSearchFields = function() {
			return [ 
			{
				label : '年月日',
				type : 'text',
				name : 'yearmonthday',
				value : _me.com().toDateStr(new Date())
			}
		 	];
		};
		/* 定义控制按钮 */
		this.base.createCtrlFields = function() {
			return [ {
				type : 'button',
				value : '生成月数据',
				ppdKey: '',
				onClick : function(e) {
					_me.createMonthData();
				}
			}, {
				type : 'button',
				value : '生成用户月数据',
				ppdKey: '',
				onClick : function(e) {
					_me.createUserMonthData();
				}
			}, {
				type : 'button',
				value : '生成用户日数据',
				ppdKey: '',
				onClick : function(e) {
					_me.createUserDateData();
				}
			} ];
		};

		this.base.procDataGridCfg = function(cfg1) {
			return cfg1;
		};

		/* 定义列表字段 */
		this.base.createDataGridFields = function() {
			var cols = [];
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
		_me.searchArea().getUICore().find('.SearchBtn').parent().parent().remove();
		_me.searchArea().getUICore().find('.ResetBtn').parent().parent().remove();
	};

	this.render = function() {
		_me.base.render();
		_me.dataGrid().getUICore().hide();
		_me.pager().getUICore().hide();
	};
	
	this.createMonthData = function() {
		var field = _me.searchArea().findFieldByName('yearmonthday');
		var arr = field.value().split('-');
		_me.world().confirm('确定要生成所有人' + arr[0] + '年' + arr[1] + '月数据（需要10到20分钟）？', function(r) {
			if(r=='yes') {
				var win = new CSJSV3.UI.Win({ title: '生成 ' + field.value(), body: '../../api/kaoqin?cmd=createuserreport&type=yearmonth&yearmonthday=' + field.value(), bodyType: 'url', width: 'auto', height: 'auto' });
				win.init(_me.world());
				win.render();
				win.show();
			}
		});
	};
	
	var _userSelector_uym;
	this.createUserMonthData = function() {
		var field = _me.searchArea().findFieldByName('yearmonthday');
		if(_userSelector_uym == null) {
			_userSelector_uym = new CSJSV3.AUI.UserSelectorS1({onSelectComplete:function(node) {
				var win = new CSJSV3.UI.Win({ title: '生成 ' + node.title + ' ' + field.value(), body: '../../api/kaoqin?cmd=createuserreport&type=useryearmonth&yearmonthday=' + field.value() + '&userid=' + node.id, bodyType: 'url', width: 'auto', height: 'auto' });
				win.init(_me.world());
				win.render();
				win.show();
			}});
			_userSelector_uym.init(_me.world());
			_userSelector_uym.render();
		}
		_userSelector_uym.show();
	};
	
	var _userSelector_uymd;
	this.createUserDateData = function() {
		var field = _me.searchArea().findFieldByName('yearmonthday');
		if(_userSelector_uymd == null) {
			_userSelector_uymd = new CSJSV3.AUI.UserSelectorS1({onSelectComplete:function(node) {
				var win = new CSJSV3.UI.Win({ title: '生成 ' + node.title + ' ' + field.value(), body: '../../api/kaoqin?cmd=createuserreport&type=useryearmonthday&yearmonthday=' + field.value() + '&userid=' + node.id, bodyType: 'url', width: 'auto', height: 'auto' });
				win.init(_me.world());
				win.render();
				win.show();
				/*
				_dataAgent.createUserReport({yearmonth:field.value(),userid:node.id}, function(r) {
					_me.world().showInfoMsg('生成完毕');
				});*/
			}});
			_userSelector_uymd.init(_me.world());
			_userSelector_uymd.render();
		}
		_userSelector_uymd.show();
	};
};
CSJSV3.AUI.CurrentListMgrView.prototype = new CSJSV3.SuperHelper();

