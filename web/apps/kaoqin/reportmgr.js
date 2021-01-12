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

	this.getCycleStartEndByYMD = function(pars, callback) {
		_me.com().reqByCmd('getcfgcyclestartendbyyearmonthday', pars, function(r) {
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

	this.getCycleStartEndByYM = function(pars, callback) {
		_me.com().reqByCmd('getcfgcyclestartendbyyearmonth', pars, function(r) {
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
	var _userSelector1;

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
			window.open('../../api/kaoqin?cmd=showreport&year=' + field.item().year() + '&month=' + field.item().month() + '&teamid=' + _me.searchArea().findFieldByName('teamid').value());
		};
		cfg.onReset1 = function() {
			var field = _me.searchArea().findFieldByName('yearmonth');
			window.open('../../api/kaoqin?cmd=showreport&year=' + field.item().year() + '&month=' + field.item().month() + '&print=1' + '&teamid=' + _me.searchArea().findFieldByName('teamid').value());
		};
		cfg.resetBtnTitle = '打印';
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.ListMgrView(cfg));
		/* 定义查询字段 */
		this.base.createSearchFields = function() {
			return [ 
				{ label: null, type: 'custom', name: 'yearmonth', body: new CSJSV3.UI.YearMonthPicker({defAuto:true}) },
				{ label: '科室', type: 'custom', name: 'teamid', body: new CSJSV3.AUI.TeamSelectorA1({}), hide: !_me.com().getWebTopObj().hasPpdKey('kq_reportmgr_nobmlimit') }
			 ];
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
		_me.dataGrid().getUICore().hide();
		_me.pager().getUICore().hide();
		
		var now = new Date();
		var nowStr = _me.com().toDateStr(now);
		var arr = nowStr.split('-');
		_dataAgent.getCycleStartEndByYMD({year:arr[0],month:arr[1],day:arr[2]}, function(r) {
			var ymd = r.data;
			_dataAgent.getCycleStartEndByYM({year:arr[0],month:arr[1]}, function(r) {
				var ym = r.data;
				if(ymd != ym) {
					var t = new Date();
					t = _me.com().addMonths(t, 1);
					var field = _me.searchArea().findFieldByName('yearmonth');
					field.value(_me.com().toYearMonthStr(t));
				}
			});
		});
	};
	
	this.createMonthData = function() {
		var field = _me.searchArea().findFieldByName('yearmonth');
		_me.world().confirm('确定要生成' + field.item().year() + '年' + field.item().month() + '月数据（需要3到8分钟）？', function(r) {
			if(r=='yes') {
				_dataAgent.createReport({year:field.item().year(),month:field.item().month()}, function(r) {
					_me.world().showInfoMsg('生成完毕');
				});
			}
		});
	};
	
	this.createUserMonthData = function() {
		var field = _me.searchArea().findFieldByName('yearmonth');
		if(_userSelector1 == null) {
			_userSelector1 = new CSJSV3.AUI.UserSelectorS1({onSelectComplete:function(node) {
				_dataAgent.createUserReport({yearmonth:field.value(),userid:node.id}, function(r) {
					_me.world().showInfoMsg('生成完毕');
				});
			}});
			_userSelector1.init(_me.world());
			_userSelector1.render();
		}
		_userSelector1.show();
	};
};
CSJSV3.AUI.CurrentListMgrView.prototype = new CSJSV3.SuperHelper();

