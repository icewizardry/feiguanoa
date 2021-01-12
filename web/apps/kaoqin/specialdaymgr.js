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

	this.list = function(pars, callback) {
		_me.world().setLoading(true);
		_me.com().reqByCmd('listspecialday', pars, function(r) {
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

	this.saveForm = function(pars, callback) {
		_me.com().reqByCmd('savespecialday', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.loadForm = function(pars, callback) {
		_me.com().reqByCmd('loadspecialday', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.removeForm = function(pars, callback) {
		_me.com().reqByCmd('removespecialday', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};
};
CSJSV3.AUI.DataAgent.prototype = new CSJSV3.SuperHelper();

CSJSV3.AUI.CurrentSubmitForm = function(cfg) {
	var _me = this;
	var _toUpdWin;
	var _dataAgent;

	{
		cfg.updTypeFieldName = 'updType';
		cfg.hiddenFields = [ {
			label : '',
			name : 'id',
			value : '',
			canEmpty : false,
			canEmptyFor : ''
		}, {
			label : '执行人',
			name : 'userids',
			value : '',
			canEmpty : true,
			canEmptyFor : ''
		}, {
			label : 'crttime',
			name : 'crttime',
			value : '',
			canEmpty : false,
			canEmptyFor : ''
		}, {
			label : 'crtuserid',
			name : 'crtuserid',
			value : '',
			canEmpty : false,
			canEmptyFor : ''
		}, {
			label : 'crtusername',
			name : 'crtusername',
			value : '',
			canEmpty : false,
			canEmptyFor : ''
		} ];
		cfg.style = '';
		cfg.fieldLabelStyle = 'width:60px;';
		cfg.rows = [ {
			fields : [ {
				label : '类型',
				type : 'select',
				name : 'type',
				value : '',
				canEmpty : false,
				canEmptyFor : '',
				style : '',
				items: [{text:'节假日',value:'节假日'},{text:'上班日',value:'上班日'}]
			}, {
				label : '开始',
				type : 'custom',
				name : 'startdate',
				value : '',
				canEmpty : false,
				canEmptyFor : '',
				style : '',
				body: new CSJSV3.UI.DateTimePickerA({ })
			}, {
				label : '结束',
				type : 'custom',
				name : 'enddate',
				value : '',
				canEmpty : false,
				canEmptyFor : '',
				style : 'margin-right:25px;',
				body: new CSJSV3.UI.DateTimePickerA({ defTimeStr: '12:00:00' })
			} ]
		}, {
			fields : [ {
				label : '执行人',
				type : 'custom',
				name : 'users',
				nameOfText: 'usernames',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : '',
				body: new CSJSV3.AUI.UsersSelector1Box({inputStyle:'width:590px;', 
					onCheckDone:function(self, checkeds) { 
						if(checkeds == null || checkeds.length == 0) {
							_me.findFieldByName('userids').value('*');
							self.text('*');
							//_me.findFieldByName('usernames').value('');
						}
						else {
							var userids = [];
							var usernames = [];
							for(var i=0;i<checkeds.length;i++) {
								if(checkeds[i].level > 1) {
									userids.push(checkeds[i].id);
									usernames.push(checkeds[i].title);
								}
							}
							_me.findFieldByName('userids').value(userids.toString());
							//_me.findFieldByName('usernames').value(usernames.toString());
						}
					}
				})
			} ]
		}, {
			fields : [ {
				label : '备注',
				type : 'textarea',
				name : 'note',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : 'width:588px;height:100px;'
			} ]
		} ];

		cfg.onSubmit = function(self) {
			_me.world().setLoading(true);
			_dataAgent.saveForm(self.data(), function(r) {
				_me.world().setLoading(false);
				if (r.success == false) {
					_me.world().showErrorMsg(r.msg);
				} else {
					_toUpdWin.hide();
					if (cfg.onSubmitDone != null) {
						cfg.onSubmitDone();
					}
				}
			});
		};
		cfg.onCancel = function(self) {
			_toUpdWin.hide();
		};
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.SubmitForm(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		_dataAgent = cfg.dataAgent;
		_toUpdWin = new CSJSV3.UI.Win({
			title : '',
			body : _me.getUICore(),
			closeBtnType : 'hide',
			height: 'auto'
		});
		_toUpdWin.init(world);
	};

	this.showForNew = function() {
		_me.world().setLoading(true);
		_dataAgent.loadForm({
			updType : 'new'
		}, function(r) {
			_me.world().setLoading(false);
			if (r.success == false) {
				_me.world().showErrorMsg(r.msg);
			} else {
				_me.reset();
				_me.data(r.data);
				_toUpdWin.title('新增');
				_toUpdWin.show();
				setTimeout(function() {
					_toUpdWin.getUICore().find('.BodyCon').animate({scrollTop:0},60);
				}, 500);
				/* 聚焦提交按钮 */
				_toUpdWin.getUICore().find('.SubmitBtn').focus();
			}
		});
	};

	this.showForEdit = function(selected) {
		_me.world().setLoading(true);
		_dataAgent.loadForm({
			updType : 'edit',
			id : selected.id
		}, function(r) {
			_me.world().setLoading(false);
			if (r.success == false) {
				_me.world().showErrorMsg(r.msg);
			} else {
				_me.reset();
				_me.data(r.data);
				_toUpdWin.title('编辑');
				_toUpdWin.show();
				setTimeout(function() {
					_toUpdWin.getUICore().find('.BodyCon').animate({scrollTop:0},60);
				}, 500);
				/* 聚焦提交按钮 */
				_toUpdWin.getUICore().find('.SubmitBtn').focus();
			}
		});
	};
};
CSJSV3.AUI.CurrentSubmitForm.prototype = new CSJSV3.SuperHelper();

CSJSV3.AUI.CurrentListMgrView = function(cfg) {
	var _me = this;
	var _submitForm;
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
			return [ 
			{ label: '', type: 'text', name: 'userid', value: 'all', hide: true },
			{
				label : '姓名',
				type : 'text',
				name : 'realname',
				value : ''
			}, 
			{ label: '开始', type: 'datepicker', name: 'start' },
			{ label: '结束', type: 'datepicker', name: 'end' }
			//{ label: null, type: 'custom', name: 'yearmonth', style: 'margin-left:30px;',  body: new CSJSV3.UI.YearMonthPicker({defAuto:true}) } 
			];
		};
		/* 定义控制按钮 */
		this.base.createCtrlFields = function() {
			return [ {
				type : 'button',
				value : '新增',
				ppdKey: '',
				onClick : function(e) {
					_me.toNew();
				}
			}, {
				type : 'button',
				value : '编辑',
				ppdKey: '',
				onClick : function(e) {
					_me.toEdit();
				}
			}, {
				type : 'button',
				value : '删除',
				ppdKey: '',
				onClick : function(e) {
					_me.toDel();
				}
			} ];
		};

		this.base.procDataGridCfg = function(cfg1) {
			return cfg1;
		};

		/* 定义列表字段 */
		this.base.createDataGridFields = function() {
			var cols = [];
			cols.push({
				title : '类型',
				style : 'text-align:center;width:80px;',
				tpl_func : function(vals, index) {
					return vals.type;
				}
			});
			cols.push({
				title : '时间段',
				style : 'text-align:center;width:300px;',
				tpl_func : function(vals, index) {
					var amStr = '';
					var pmStr = '';
					
					if(vals.startdate.indexOf('00:00:00') != -1) {
						amStr = '上午';
					}
					else if(vals.startdate.indexOf('12:00:00') != -1) {
						amStr = '下午';
					}
					
					if(vals.enddate.indexOf('00:00:00') != -1) {
						pmStr = '上午';
					}
					else if(vals.enddate.indexOf('12:00:00') != -1) {
						pmStr = '下午';
					}
					
					return '从 ' + vals.startdate.replace('00:00:00', '').replace('12:00:00', '') + ' ' + amStr + ' 到 ' + vals.enddate.replace('00:00:00', '').replace('12:00:00', '') + ' ' + pmStr;
				}
			});
			cols.push({
				title : '执行人',
				style : 'text-align:center;width:180px;',
				tpl_func : function(vals, index) {
					return vals.usernames;
				}
			});
			cols.push({
				title : '备注',
				style : 'text-align:left;width:200px;',
				tpl_func : function(vals, index) {
					return vals.note;
				}
			});
			cols.push({
				title : '创建人',
				style : 'text-align:center;width:100px;',
				tpl_func : function(vals, index) {
					return vals.crtusername;
				}
			});
			cols.push({
				title : '创建时间',
				style : 'text-align:center;width:160px;',
				tpl_func : function(vals, index) {
					return vals.crttime;
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
		_submitForm = new CSJSV3.AUI.CurrentSubmitForm({
			dataAgent : _dataAgent,
			onSubmitDone : function() {
				_me.loadData();
			}
		});
		_submitForm.init(world);
	};

	this.render = function() {
		_me.base.render();
		_submitForm.render();
	};

	this.toNew = function() {
		_submitForm.showForNew();
	};

	this.toEdit = function() {
		var selected = _me.selectedItem();
		if (selected == null) {
			_me.world().showErrorMsg('请先选择一项');
		} else {
			_submitForm.showForEdit(selected);
		}
	};

	this.toDel = function() {
		var selected = _me.selectedItem();
		if (selected == null) {
			_me.world().showErrorMsg('请先选择一项');
		} else {
			_me.world().confirm('确认删除？', function(r) {
				if (r == 'yes') {
					_me.world().setLoading(true);
					_dataAgent.removeForm({
						id : selected.id
					}, function(r) {
						_me.world().setLoading(false);
						if (r.success == false) {
							_me.world().showErrorMsg(r.msg);
						} else {
							_me.loadData();
						}
					});
				}
			});
		}
	};

	this.toSync = function() {
		var field = _me.searchArea().findFieldByName('yearmonth');
		if(field.value() == '') {
			_me.world().showErrorMsg('年份不能为空');
		}
		else {
			_me.world().confirm('确认要同步' + field.item().year() + '年' + field.item().month() + '月数据？', function(r) {
				if (r == 'yes') {
					_dataAgent.syncSigninout({yearmonth:field.value()}, function(r) {
						_me.world().showInfoMsg('同步完毕，共添加' + r.data + '条');
					});
				}
			});
		}
	};
};
CSJSV3.AUI.CurrentListMgrView.prototype = new CSJSV3.SuperHelper();