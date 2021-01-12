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
			var start = _me.searchArea().findFieldByName('start').value();
			var end = _me.searchArea().findFieldByName('end').value();
			var tjtype = _me.searchArea().findFieldByName('tjtype').value();
			//var ctgstr = _me.searchArea().findFieldByName('ctg').value();
			
			var ctgid = '';
			/*if(ctgstr != null && ctgstr != '') {
				var ctg = JSON.parse(ctgstr);
				if(ctg != null && ctg.length > 0) {
					ctgid = ctg[0].id;
				}
			}*/
			
			if(tjtype == 'xx') {
				if(start == '' || end == '') {
					_me.world().showAlertMsg('开始与结束时间不能为空');
				}
				else {
					window.open('../../api/info?cmd=showinforeportb&start=' + start + '&end=' + end + '&ctgid=' + ctgid);
				}
			}
			else {
				window.open('../../api/info?cmd=showinforeporta&start=' + start + '&end=' + end + '&ctgid=' + ctgid);
			}
		};
		cfg.onReset1 = function() {
			var start = _me.searchArea().findFieldByName('start').value();
			var end = _me.searchArea().findFieldByName('end').value();
			var tjtype = _me.searchArea().findFieldByName('tjtype').value();
			//var ctgstr = _me.searchArea().findFieldByName('ctg').value();
			
			var ctgid = '';
			/*if(ctgstr != null && ctgstr != '') {
				var ctg = JSON.parse(ctgstr);
				if(ctg != null && ctg.length > 0) {
					ctgid = ctg[0].id;
				}
			}*/
			
			if(tjtype == 'xx') {
				if(start == '' || end == '') {
					_me.world().showAlertMsg('开始与结束时间不能为空');
				}
				else {
					window.open('../../api/info?cmd=showinforeportb&start=' + start + '&end=' + end + '&ctgid=' + ctgid + '&output=1');
				}
			}
			else {
				window.open('../../api/info?cmd=showinforeporta&start=' + start + '&end=' + end + '&ctgid=' + ctgid + '&output=1');
			}
		};
		cfg.resetBtnTitle = '导出';
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.ListMgrView(cfg));
		/* 定义查询字段 */
		this.base.createSearchFields = function() {
			return [ 
				{ label: '时间', type: 'datepicker', name: 'start', value: '' }, 
				{ label: '', type: 'datepicker', name: 'end', value: '', getFieldLabel: function () { return '<div class="FieldLabel" style="float:left;margin-left:8px;margin-right:8px;"><span>到</span></div>'; } },
				{ label: '统计类型', type: 'select', name: 'tjtype', value: 'ks', items: [{text:'科室',value:'ks'},{text:'信息',value:'xx'}] }//,
				//{ label: '类目', type: 'custom', name: 'ctg', value: '', body: new CSJSV3.AUI.CtgSelector({}) }
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
	};
};
CSJSV3.AUI.CurrentListMgrView.prototype = new CSJSV3.SuperHelper();

