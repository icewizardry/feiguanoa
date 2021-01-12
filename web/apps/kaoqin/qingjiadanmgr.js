CSJSV3.AUI.DataAgent = function(cfg) {
	var _me = this;
	var _reqSvrUrl = '../../api/qingjiadan';

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

	this.listShiyou = function(pars, callback) {
		_me.com().reqByCmd('listshiyou', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.list = function(pars, callback) {
		_me.com().reqByCmd('list', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.saveForm = function(pars, callback) {
		_me.com().reqByCmd('save', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.loadForm = function(pars, callback) {
		_me.com().reqByCmd('load', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.removeForm = function(pars, callback) {
		_me.com().reqByCmd('remove', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.destroyForm = function(pars, callback) {
		_me.com().reqByCmd('destroy', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.shenpitg = function(pars, callback) {
		_me.com().reqByCmd('shenpitg', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.shenpich = function(pars, callback) {
		_me.com().reqByCmd('shenpich', pars, function(r) {
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
	var _shenpiTGBtn;
	var _shenpiCHBtn;
	var _saveBtn;
	var _submitBtn;
	var _mode;
	
	var _lxqjmgr;
	// 是否要进行了连续申请验证
	var _needLXCheck = false;
	// 是否已经进行了连续申请验证
	var _hasLXCheck = false;
	// 能否调用endtime字段的readonly功能
	var _canSetReadonlyEndtimeField = true;

	{
		cfg.updTypeFieldName = 'updType';
		cfg.hiddenFields = [
			{ label : 'id', name : 'id', value : '', canEmpty : false, canEmptyFor : '' },
			{ label : 'crttime', name : 'crttime', value : '', canEmpty : false, canEmptyFor : '', onSetValue: function(self, val) { return _me.com().toDateTimeStr(new Date(val)); } },
			{ label : '请假天数', name : 'days', value : '', canEmpty : false, canEmptyFor : '' },
			{ label : '审核次数', name : 'shenhecount', value : '', canEmpty : false, canEmptyFor : '' },
			{ label : 'state', name : 'state', value : '', canEmpty : false, canEmptyFor : '' },
			{ label : 'shenpi1userid', name : 'shenpi1userid', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : 'shenpi1username', name : 'shenpi1username', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : 'shenpi1state', name : 'shenpi1state', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : 'shenpi1doneuserid', name : 'shenpi1doneuserid', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : 'shenpi1doneusername', name : 'shenpi1doneusername', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : 'shenpi1time', name : 'shenpi1time', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : 'shenpi2userid', name : 'shenpi2userid', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : 'shenpi2username', name : 'shenpi2username', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : 'shenpi2state', name : 'shenpi2state', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : 'shenpi2doneuserid', name : 'shenpi2doneuserid', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : 'shenpi2doneusername', name : 'shenpi2doneusername', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : 'shenpi2time', name : 'shenpi2time', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : 'shenpi3userid', name : 'shenpi3userid', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : 'shenpi3username', name : 'shenpi3username', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : 'shenpi3state', name : 'shenpi3state', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : 'shenpi3doneuserid', name : 'shenpi3doneuserid', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : 'shenpi3doneusername', name : 'shenpi3doneusername', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : 'shenpi3time', name : 'shenpi3time', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : 'crtuserid', name : 'crtuserid', value : '', canEmpty : false, canEmptyFor : '' },
			{ label : 'crtusername', name : 'crtusername', value : '', canEmpty : false, canEmptyFor : '' },
			{ label : 'shenhe1maxdays', name : 'shenhe1maxdays', value : '', canEmpty : false, canEmptyFor : '' },
			{ label : 'shenhe2maxdays', name : 'shenhe2maxdays', value : '', canEmpty : false, canEmptyFor : '' },
			{ label : 'hbid', name : 'hbid', value : '', canEmpty : true, canEmptyFor : '' }
		];
		cfg.style = '';
		cfg.fieldLabelStyle = 'width:70px;';
		cfg.rows = [ {
			fields : [ {
				label : '事由',
				type : 'custom',
				name : 'reason',
				value : '',
				canEmpty : false,
				canEmptyFor : '',
				style : '',
				body: new CSJSV3.AUI.SelectorA({ 
					selectonly: true,
					loadData: function(pars, callback) {
					_dataAgent.listShiyou({}, function(r) {
						callback(r);
					});
				} }),
				onChange: function() {
					_onDateTimeChange();
				}
			}, {
				label : '标签1', hideLabel: true, 
				type : 'custom',
				name : 'label1',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : 'margin-left:20px;',
				body: new CSJSV3.UI.Display({ defValue: '共 ? 天，需 ? 审' })
			}, {
				label : '标签2', hideLabel: true, 
				type : 'custom',
				name : 'label2',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : 'margin-left:0px;',
				body: new CSJSV3.UI.Display({ defValue: '' })
			} ]
		}, {
			fields: [
				{
					label: '请假时间',
					type: 'custom',
					name: 'starttime',
					value: '',
					canEmpty : false,
					canEmptyFor : '',
					onChange: function(e, self) {
						_onDateTimeChange();
					},
					body: new CSJSV3.UI.DateTimePickerA({ })
				},
                { 
                	label: '结束时间', hideLabel: true, 
                	type: 'custom', 
                	name: 'endtime', 
                	value: '',
					canEmpty : false,
					canEmptyFor : '',
					onChange: function(e, self) {
						_onDateTimeChange();
					},
					body: new CSJSV3.UI.DateTimePickerA({ }), 
					getFieldLabel: function () { return '<div class="FieldLabel" style="float:left;margin-left:8px;margin-right:8px;"><span>到</span></div>'; } 
				}
			]
		}, {
			fields : [
				{
					label: '申请人',
					type: 'custom',
					name: 'userid',
					nameOfText: 'username',
					canEmpty : false,
					canEmptyFor : '',
					body: new CSJSV3.AUI.UserSelectorA1({})
				}, 
				{
					label: '科室',
					type: 'custom',
					name: 'bmid',
					nameOfText: 'bmtitle',
					canEmpty : true,
					canEmptyFor : '',
					readonly: true,
					body: new CSJSV3.AUI.TeamSelectorA1({floatPanelWidth:200})
				}
			]
		}, {
			fields : [ 
//				{
//					label : '请假说明',
//					type : 'textarea',
//					name : 'content',
//					value : '',
//					canEmpty : false,
//					canEmptyFor : '',
//					style : 'width:510px;height:100px;margin-right:25px;'
//				} 
				{
					label : '请假说明',
					type : 'custom',
					name : 'content',
					value : '',
					canEmpty : false,
					canEmptyFor : '',
					style : 'width:510px;height:200px;margin-right:30px;',
					body: new CSJSV3.UI.EditorA({})
				}
			]
		}, {
			fields : [ {
				label : '撤回理由',
				type : 'textarea',
				name : 'cancelnote',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : 'width:510px;height:100px;margin-right:25px;'
			} ]
		} ];

		cfg.onLoadData = function(self) {
			if(_me.findFieldByName('updType').value() == 'edit' && (_me.findFieldByName('state').value() == '0' || _me.findFieldByName('state').value() == '1')) {//已提交的就不能保存了
				_saveBtn.hide();
			}
			if(_me.findFieldByName('updType').value() == 'edit' && ((_me.findFieldByName('state').value() == '0' && _me.findFieldByName('shenpi1state').value() == '1') || _me.findFieldByName('state').value() == '1')) {//已审过的就不能提交和修改了
				_submitBtn.hide();
				
				// 锁定结束时间字段的修改权限
				_canSetReadonlyEndtimeField = false;
				_me.findFieldByName('reason').readonly(true);
				_me.findFieldByName('starttime').readonly(true);
				_me.findFieldByName('endtime').readonly(true);
				_me.findFieldByName('userid').readonly(true);
				_me.findFieldByName('bmid').readonly(true);
				_me.findFieldByName('content').readonly(true);
			}
			else {
				_canSetReadonlyEndtimeField = true;
				_me.findFieldByName('reason').readonly(false);
				_me.findFieldByName('starttime').readonly(false);
				_me.findFieldByName('endtime').readonly(false);
				_me.findFieldByName('userid').readonly(false);
				_me.findFieldByName('bmid').readonly(false);
				_me.findFieldByName('content').readonly(false);
			}
			// 所有阶段都能自己撤回 //待一审和已通过的允许申请人撤回
			if(_me.findFieldByName('updType').value() != 'new' && (_me.findFieldByName('state').value() == '1' || (_me.findFieldByName('state').value() == '0' && _me.findFieldByName('shenpi1state').value() == '1'))) {// && (_me.findFieldByName('state').value() == '1' || (_me.findFieldByName('state').value() == '0' && _me.findFieldByName('shenpi1state').value() == '0'))
				if(_me.findFieldByName('userid').value() == _me.com().getWebTopObj().getMyAttr('uid')) {
					_shenpiCHBtn.show();
					_me.findFieldByName('cancelnote').getUICore().show();
				}
			}
			_onDateTimeChange();
		};
		cfg.onAppendBtnBefore = function(self, ctrlRow) {
			//审批通过按钮
            _shenpiTGBtn = $('<input type="button" class="ShenpiTGBtn CSJSV3UIBtn1" value="通过" style="margin-right:30px;" />');
            _shenpiTGBtn.click(function() {
            	_me.world().setLoading(true);
            	_dataAgent.shenpitg({ id: self.findFieldByName('id').value() }, function(r) {
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
            });
            ctrlRow.append(_shenpiTGBtn);
            //审批撤回按钮
            _shenpiCHBtn = $('<input type="button" class="ShenpiCHBtn CSJSV3UIBtn1" value="退回" style="margin-right:30px;" />');
            _shenpiCHBtn.click(function() {
            	if($.trim(self.findFieldByName('cancelnote').value()) == '' && (self.findFieldByName('userid').value() != _me.com().getWebTopObj().getMyAttr('uid') || (self.findFieldByName('state').value() == '1'))) {
            		// 领导撤回，自己撤回已通过的需要填写理由
            		_me.world().showErrorMsg('撤回理由不能为空');
            	}
            	else {
	            	_me.world().setLoading(true);
	            	_dataAgent.shenpich({ id: self.findFieldByName('id').value(), cancelnote: self.findFieldByName('cancelnote').value() }, function(r) {
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
            	}
            });
            ctrlRow.append(_shenpiCHBtn);
            //保存按钮
            _saveBtn = $('<input type="button" class="SaveBtn CSJSV3UIBtn1" value="保存" style="margin-right:30px;" />');
            _saveBtn.click(function() {
            	self.findFieldByName('state').value('101');
            	self.submit();
            });
            ctrlRow.append(_saveBtn);
		};
		cfg.onAppendBtnAfter = function(self, ctrlRow) {
			_submitBtn = ctrlRow.find('.SubmitBtn');
			ctrlRow.find('.CancelBtn').val('返回');
		};
		cfg.onCheckData = function(self, callback) {
			var start = _me.findFieldByName('starttime').value();
			var end = _me.findFieldByName('endtime').value();
			if(start.length != 19) {
				_me.world().showErrorMsg('开始日期格式不正确（正确格式：yyyy-mm-dd）');
			}
			else if(end.length != 19) {
				_me.world().showErrorMsg('结束日期格式不正确（正确格式：yyyy-mm-dd）');
			}
			else if(_needLXCheck == true) {
				//进行连续申请验证
				_lxqjmgr.check(_me.findFieldByName('id').value(), _me.findFieldByName('reason').value(), _me.findFieldByName('userid').value(), _me.findFieldByName('userid').text(), start, end, function(self, r, decide) {
					_hasLXCheck = true;
					if(r.data.needhb) {
						_needLXCheck = false;
						// 修改时间
						_me.findFieldByName('starttime').value(r.data.hbstart);
						_me.findFieldByName('endtime').value(r.data.hbend);
						_me.findFieldByName('content').value(_me.findFieldByName('content').value() + '<br/><strong>合并列表：</strong><br/>' + r.data.content);
						_onDateTimeChange();
						
						
						var hbid = '';
						var lxitems = r.data.lxitems;
						for(var i=0;i<lxitems.length;i++) {
							if(i!=0) {
								hbid += ',';
							}
							hbid += lxitems[i].id;
						}
						_me.findFieldByName('hbid').value('tohb:' + hbid);
						
						
						if(decide == 'y') {
            				_me.submit();
							//alert('用户确定合并');
						}
						else if(decide == 'n') {
							_me.findFieldByName('starttime').readonly(true);
							_me.findFieldByName('endtime').readonly(true);
							_me.findFieldByName('reason').readonly(true);
							_me.findFieldByName('content').readonly(true);
							//alert('用户取消合并');
						}
					}
					else {
						_needLXCheck = false;
            			_me.submit();
						//alert('不需要合并');
					}
				});
			}
			else {
				if (callback != null) {
	                callback();
	            }
            	return true;
			}
            return false;
		};
		cfg.onSubmitBtnClick = function(self) {
			var updType = _me.findFieldByName('updType').value();
			var oldFlow = _me.findFieldByName('state').value();
			_me.findFieldByName('state').value(0);
			
			if(updType == 'new') {
				if(_hasLXCheck == false) {
					_needLXCheck = true;
				}
			}
			else {
				if(_hasLXCheck == false && oldFlow == '101') {
					_needLXCheck = true;
				}
			}
		};
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
		
		_lxqjmgr = new CSJSV3.AUI.LXQJMgr({});
		_lxqjmgr.init(world);
		
		_toUpdWin = new CSJSV3.UI.Win({
			title : '',
			body : _me.getUICore(),
			closeBtnType : 'hide',
			height: 'auto'
		});
		_toUpdWin.init(world);
	};
	
	this.mode = function() {
		return _mode;
	};

	this.showForNew = function() {
		_mode = 'new';
		_me.world().setLoading(true);
		_me.hideAllBtns();
		_me.showBtnByClass('SaveBtn');
		_me.showBtnByClass('SubmitBtn');
		_me.showBtnByClass('CancelBtn');
		_me.findFieldByName('cancelnote').getUICore().hide();
		
		_needLXCheck = false;
		_hasLXCheck = false;
		//解除只读限制
		for(var i=0;i<_me.fields().length;i++) {
			if(_me.fields()[i].name() == 'bmid') {
				
			}
			else {
				_me.fields()[i].readonly(false);
			}
		}
		
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
		_mode = 'edit';
		_me.world().setLoading(true);
		_me.hideAllBtns();
		_me.showBtnByClass('SaveBtn');
		_me.showBtnByClass('SubmitBtn');
		_me.showBtnByClass('CancelBtn');
		_me.findFieldByName('cancelnote').getUICore().hide();
		//解除只读限制
		/*
		for(var i=0;i<_me.fields().length;i++) {
			if(_me.fields()[i].name() == 'bmid') {
				
			}
			else {
				_me.fields()[i].readonly(false);
			}
		}*/
		
		_needLXCheck = false;
		_hasLXCheck = false;
		
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
	
	this.showForShenpi = function(selected) {
		_mode = 'shenpi';
		_me.world().setLoading(true);
		_me.hideAllBtns();
		_me.showBtnByClass('ShenpiTGBtn');
		_me.showBtnByClass('ShenpiCHBtn');
		_me.showBtnByClass('CancelBtn');
		_me.findFieldByName('cancelnote').getUICore().show();
		//开启制度限制
		for(var i=0;i<_me.fields().length;i++) {
			_me.fields()[i].readonly(true);
		}
		_me.findFieldByName('cancelnote').readonly(false);
		
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
				/* 聚焦提交按钮 */
				_toUpdWin.getUICore().find('.SubmitBtn').focus();
			}
		});
	};
	
	function _onDateTimeChange() {
		//debugger;
		//零星假控制
		var isLXJ = false;//是否为零星假
		var lxjTipStr = '';
		if(_me.findFieldByName('reason').value() == '零星假') {
			isLXJ = true;
			_me.findFieldByName('endtime').readonly(true);
			lxjTipStr = '<span style="color:red;font-size:12px;vertical-align:middle;">（零星假时间为上午9:00-11:00，下午15:00-17:00）</span>';
			_me.findFieldByName('endtime').value(_me.findFieldByName('starttime').value());
		}
		else {
			if(_canSetReadonlyEndtimeField) {
				_me.findFieldByName('endtime').readonly(false);
			}
		}
		//
		var label1 = _me.findFieldByName('label1');
		var shenhe1maxdays = _me.findFieldByName('shenhe1maxdays').value();
		var shenhe2maxdays = _me.findFieldByName('shenhe2maxdays').value();
		var starttime = _me.com().toDateTimeStr(_me.findFieldByName('starttime').value());
		var endtime = _me.com().toDateTimeStr(_me.findFieldByName('endtime').value());
		var days = 0;var labelDays = '';
		var shenhecount = 0;var labelShenhecount = '';
		
		if(starttime != '' && endtime != '') {
			days = _calQingJiaDays(starttime, endtime);
		}
		
		shenhecount = _callShenHeCount(days, shenhe1maxdays, shenhe2maxdays);
		
		if(isNaN(days)) {
			labelDays = '<span style="color:red;"> ? </span>';
		}
		else if(days <= 0) {
			labelDays = '<span style="color:red;"> ' + days + ' </span>';
		}
		else {
			labelDays = ' ' + days + ' ';
		}
		
		labelShenhecount = ' ' + shenhecount + ' ';
		
		
		label1.value('共' + labelDays + '天，需' + labelShenhecount + '审');
		_me.findFieldByName('label2').value(lxjTipStr);
		if(isNaN(days) || days <= 0) { days = ''; }
		_me.findFieldByName('days').value(days);
		_me.findFieldByName('shenhecount').value(shenhecount);
	}
	
	function _calQingJiaDays(start, end) {
		var days = 0;
		var startAmOrPm = '';
		var endAmOrPm = '';
		var startDate = new Date(start.split(' ')[0]);
		var endDate = new Date(end.split(' ')[0]);
		if(start.indexOf('00:00:00') != -1) { startAmOrPm = 'am'; }
		else { startAmOrPm = 'pm'; }
		if(end.indexOf('00:00:00') != -1) { endAmOrPm = 'am'; }
		else { endAmOrPm = 'pm'; }
		//debugger;
		days = (endDate - startDate) / 1000 / 60 / 60 / 24;
		if(startAmOrPm == 'am' && endAmOrPm == 'am') {
			days += 0.5;
		}
		else if(startAmOrPm == 'pm' && endAmOrPm == 'pm') {
			days += 0.5;
		}
		else if(startDate.toString() == endDate.toString() && startAmOrPm == 'pm' && endAmOrPm == 'am') {
			days = NaN;
		}
		else if(startAmOrPm == 'pm' && endAmOrPm == 'am') {
		}
		else {
			days += 1;
		}
		return days;
	}
	
	function _callShenHeCount(days, shenhe1maxdays, shenhe2maxdays) {
		if(days <= shenhe1maxdays) {
			return 1;
		}
		else if(days <= shenhe2maxdays) {
			return 2;
		}
		return 3;
	}
};
CSJSV3.AUI.CurrentSubmitForm.prototype = new CSJSV3.SuperHelper();

CSJSV3.AUI.CurrentListMgrView = function(cfg) {
	var _me = this;
	var _tab;
	var _submitForm;
	var _dataAgent;
	var _showShenpiState = false;

	{
		_dataAgent = new CSJSV3.AUI.DataAgent({});
		cfg.loadData = function(pars, callback) {
			_me.world().setLoading(true);
			_dataAgent.list(pars, function(r) {
			_me.world().setLoading(false);
				callback(r);
			});
		};
		cfg.resizeNum = -30;
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.ListMgrView(cfg));
		/* 定义查询字段 */
		this.base.createSearchFields = function() {
			return [ {
				label : '',
				type : 'hidden',
				name : 'listtype',
				value : 'wdsq'
			}, {
				label : '申请人',
				type : 'text',
				name : 'username',
				value : ''
			}, {
				label : '事由',
				type : 'custom',
				name : 'reason',
				value : '',
				body: new CSJSV3.AUI.SelectorA({ loadData: function(pars, callback) {
					_dataAgent.listShiyou({}, function(r) {
						callback(r);
					});
				} })
			} ];
		};
		/* 定义控制按钮 */
		this.base.createCtrlFields = function() {
			return [ {
				type : 'button',
				value : '新增',
				ppdKey: 'kq_qingjiadanmgr_new',
				onClick : function(e) {
					_me.toNew();
				}
			}, {
				type : 'button',
				value : '编辑',
				ppdKey: 'kq_qingjiadanmgr_edit',
				onClick : function(e) {
					_me.toEdit();
				}
			}, {
				type : 'button',
				value : '删除',
				ppdKey: 'kq_qingjiadanmgr_del',
				onClick : function(e) {
					_me.toDel();
				}
			}, {
				type : 'button',
				value : '彻底删除',
				ppdKey: 'kq_qingjiadanmgr_destroy',
				onClick : function(e) {
					_me.toDestroy();
				}
			}, {
				type : 'button',
				value : '审核',
				ppdKey: 'kq_qingjiadanmgr_shenpi',
				hide: (_tab.selectedTab() != null && _tab.selectedTab().title != '待我审的'),
				onClick : function(e) {
					_me.toShenpi();
				}
			}, {
				type : 'button',
				value : '批量审核',
				ppdKey: 'kq_qingjiadanmgr_shenpi',
				hide: (_tab.selectedTab() != null && _tab.selectedTab().title != '待我审的'),
				onClick : function(e) {
					_me.toPiLiangShenpi();
				}
			}, {
				type : 'button',
				value : '确认选择',
				ppdKey: 'kq_qingjiadanmgr_shenpi',
				hide: true,
				onClick : function(e) {
					_me.confirmPiLiangShenpi();
				}
			}, {
				type : 'button',
				value : '取消选择',
				ppdKey: 'kq_qingjiadanmgr_shenpi',
				hide: true,
				onClick : function(e) {
					_me.cancelPiLiangShenpi();
				}
			} ];
		};

		this.base.procDataGridCfg = function(cfg1) {
			//cfg1.showCheckbox = true;
			return cfg1;
		};

		/* 定义列表字段 */
		this.base.createDataGridFields = function() {
			var cols = [];
			cols.push({
				title : '事由',
				style : 'text-align:center;width:100px;',
				tpl_func : function(vals, index) {
					return vals.reason;
				}
			});
			cols.push({
				title : '天数',
				style : 'text-align:center;width:50px;',
				tpl_func : function(vals, index) {
					if(vals.reason == '零星假') {
						return '/';
					}
					return vals.days;
				}
			});
			cols.push({
				title : '请假时间',
				style : 'text-align:center;width:280px;',
				tpl_func : function(vals, index) {
					if(vals.reason == '零星假') {
						var str = '';
						if(vals.starttime.indexOf('00:00:00') != -1) {
							str = '9:00-11:00';
						}
						else if(vals.starttime.indexOf('12:00:00') != -1) {
							str = '15:00-17:00';
						}
						return vals.starttime.replace('00:00:00', '').replace('12:00:00', '') + ' ' + str;
					}
					return vals.starttime.replace('00:00:00', '上午').replace('12:00:00', '下午') + '&nbsp;到&nbsp;' + vals.endtime.replace('00:00:00', '上午').replace('12:00:00', '下午');
				}
			});
			cols.push({
				title : '申请人',
				style : 'text-align:center;width:80px;',
				tpl_func : function(vals, index) {
					return vals.username;
				}
			});
			cols.push({
				title : '撤回理由',
				style : 'text-align:left;width:100px;',
				tpl_func : function(vals, index) {
					return vals.cancelnote;
				}
			});
			cols.push({
				title : '状态',
				style : 'text-align:center;',
				onClick: function(self, colDC) {
					if(_showShenpiState == null) {
						_showShenpiState = false;
					}
					
					if(_showShenpiState == false) _showShenpiState = true;
					else { _showShenpiState = false; }
					
					self.getUICore().find('.ListCell').each(function(i, n) {
						if($(n).attr('cell-index') == '6' || $(n).attr('cell-index') == '7' || $(n).attr('cell-index') == '8') {
							if(_showShenpiState == true) {
								$(n).show();
							}
							else {
								$(n).hide();
							}
						}
					});
					
					_me.resize();
				},
				tpl_func : function(vals, index) {
					if(vals.state == 101) {
						return "编辑中";
					}
					else if(vals.state == 102) {
						return "已删除";
					}
					else if(vals.state == -1) {
						if(vals.shenpi1state == -1 && vals.userid != vals.shenpi1doneuserid) {
							return "一审撤回";
						}
						else if(vals.shenpi2state == -1 && vals.userid != vals.shenpi2doneuserid) {
							return "二审撤回";
						}
						else if(vals.shenpi3state == -1 && vals.userid != vals.shenpi3doneuserid) {
							return "三审撤回";
						}
						return "已撤回";
					}
					else if(vals.state == 0) {
						if(vals.shenpi1state == 0) {
							return "待一审";
						}
						else if(vals.shenpi2state == 0) {
							return "待二审";
						}
						else if(vals.shnepi3state == 0) {
							return "待三审";
						}
						return "审核中";
					}
					else if(vals.state == 1) {
						return "已通过";
					}
					return vals.state;
				}
			});
			cols.push({
				title : '一审',
				hide_func: function() { return !_showShenpiState; },
				style : 'text-align:center;width:100px;',
				tpl_func : function(vals, index) {
					if(vals.shenpi1state == 1) {
						return '<span style="color:green;">' + vals.shenpi1doneusername + '已批准</span>';
					}
					else if(vals.shenpi1state == -1) {
						return '<span style="color:red;">' + vals.shenpi1doneusername + '已撤回</span>';
					}
					return vals.shenpi1username;
				}
			});
			cols.push({
				title : '二审',
				hide_func: function() { return !_showShenpiState; },
				style : 'text-align:center;width:100px;',
				tpl_func : function(vals, index) {
					if(vals.shenpi1state != 1) {
						return '<span style="color:silver;">' + vals.shenpi2username + '</span>';
					}
					else if(vals.shenpi1state == 1 && vals.shenpi2state == 0) {
						return vals.shenpi2username;
					}
					else {
						if(vals.shenpi2state == 0) {
							return vals.shenpi2doneusername;
						}
						else if(vals.shenpi2state == 1) {
							return '<span style="color:green;">' + vals.shenpi2doneusername + '已批准</span>';
						}
						else if(vals.shenpi2state == -1) {
							return '<span style="color:red;">' + vals.shenpi2doneusername + '已撤回</span>';
						}
					}
				}
			});
			cols.push({
				title : '三审',
				hide_func: function() { return !_showShenpiState; },
				style : 'text-align:center;width:100px;',
				tpl_func : function(vals, index) {
					if(vals.shenpi2state != 1) {
						return '<span style="color:silver;">' + vals.shenpi3username + '</span>';
					}
					else if(vals.shenpi2state == 1 && vals.shenpi3state == 0) {
						return vals.shenpi3username;
					}
					else {
						if(vals.shenpi3state == 0) {
							return vals.shenpi3doneusername;
						}
						else if(vals.shenpi3state == 1) {
							return '<span style="color:green;">' + vals.shenpi3doneusername + '已批准</span>';
						}
						else if(vals.shenpi3state == -1) {
							return '<span style="color:red;">' + vals.shenpi3doneusername + '已撤回</span>';
						}
					}
				}
			});
			cols.push({
				title : '科室',
				style : 'text-align:center;width:120px;',
				tpl_func : function(vals, index) {
					return vals.bmtitle;
				}
			});
			cols.push({
				title : '创建时间',
				style : 'text-align:center;width:160px;',
				tpl_func : function(vals, index) {
					return vals.crttime;
				}
			});
			cols.push({
				title : '创建人',
				style : 'text-align:center;width:80px;',
				tpl_func : function(vals, index) {
					return vals.crtusername;
				}
			});
			return cols;
		};

		this.base.procPagerCfg = function(cfg1) {
			return cfg1;
		};
	}

	this.init = function(world) {
		var tabItems = [];
		tabItems = [
                { title: '我的申请', body: '', bodyType: '', closeable: false },
                //{ title: '待一审', body: '', bodyType: '', closeable: false },
                //{ title: '待二审', body: '', bodyType: '', closeable: false },
                //{ title: '待三审', body: '', bodyType: '', closeable: false },
                { title: '已通过', body: '', bodyType: '', closeable: false },
                { title: '回收站', body: '', bodyType: '', closeable: false },
                { title: '所有', body: '', bodyType: '', closeable: false }
            ];
        if(world.com().getWebTopObj().hasPpdKey('kq_qingjiadanmgr_shenpi')) {
        	tabItems.splice(1, 0, { title: '待我审的', body: '', bodyType: '', closeable: false });
        }
		_tab = new CSJSV3.UI.TabPanel({
			defSelectedTabIndex: world.com().getWebTopObj().hasPpdKey('kq_qingjiadanmgr_shenpi') ? 1: 0,
			items: tabItems,
            onChange: function(self) {
            	var field = _me.searchArea().findFieldByName('listtype');
            	var tab = self.selectedTab();
            	if(tab.title == '我的申请') {
            		field.value('wdsq');
            	}
            	else if(tab.title == '待我审的') {
            		field.value('dwsd');
            	}
            	else if(tab.title == '待一审') {
            		field.value('shenpi1');
            	}
            	else if(tab.title == '待二审') {
            		field.value('shenpi2');
            	}
            	else if(tab.title == '待三审') {
            		field.value('shenpi3');
            	}
            	else if(tab.title == '已通过') {
            		field.value('ytg');
            	}
            	else if(tab.title == '回收站') {
            		field.value('ysc');
            	}
            	else if(tab.title == '所有') {
            		field.value('sy');
            	}
            	else {
            		field.value('');
            	}
            	_me.loadData();
            	_me.buildCtrlArea();
            }
		});
		_tab.init(world);
		_me.base.getUICore().append(_tab.getUICore());
		/* 继承父级 */
		_me.base.init(world);
		_dataAgent.init(world);
		_submitForm = new CSJSV3.AUI.CurrentSubmitForm({
			dataAgent : _dataAgent,
			onSubmitDone : function() {
				if(_submitForm.mode() == 'new') {
					_tab.selectTabByIndex(0);
				}
				else {
					_me.loadData();
				}
			}
		});
		_submitForm.init(world);
		
	};

	this.render = function() {
		_me.base.render();
		_tab.render();
		_submitForm.render();
		
		if(_me.com().getWebTopObj().hasPpdKey('kq_qingjiadanmgr_shenpi')) {
        	var field = _me.searchArea().findFieldByName('listtype');
    		field.value('dwsd');
		}
	};
	
	this.resize = function() {
		_me.base.resize();
		
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

	this.toDestroy = function() {
		var selected = _me.selectedItem();
		if (selected == null) {
			_me.world().showErrorMsg('请先选择一项');
		} else {
			_me.world().confirm('确认销毁？', function(r) {
				if (r == 'yes') {
					_me.world().setLoading(true);
					_dataAgent.destroyForm({
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
	
	this.toShenpi = function() {
		var selected = _me.selectedItem();
		if (selected == null) {
			_me.world().showErrorMsg('请先选择一项');
		} else {
			_submitForm.showForShenpi(selected);
		}
	};
	
	this.toPiLiangShenpi = function() {
		for(var i=0;i<_me.ctrlBtns().length;i++) {
			/*
			if(_me.ctrlBtns()[i].cfg().value == '批量审核') {
				_me.ctrlBtns()[i].hide();
			}
			else 
			*/
			if(_me.ctrlBtns()[i].cfg().value == '确认选择') {
				_me.ctrlBtns()[i].show();
				//_me.ctrlBtns()[i].item().show();
			}
			else if(_me.ctrlBtns()[i].cfg().value == '取消选择') {
				_me.ctrlBtns()[i].show();
				//_me.ctrlBtns()[i].item().show();
			}
			else {
				//_me.ctrlBtns()[i].disabled(true);
				_me.ctrlBtns()[i].hide();
				//_me.ctrlBtns()[i].item().hide();
			}
		}
		_me.dataGrid().showCheckbox();
	};
	//执行批量审核
	function _piLiangTG(items, index) {
		_me.world().setLoading('执行第' + (index + 1) + '/' + items.length + '条');
		_dataAgent.shenpitg({id:items[index].id}, function(r) {
			if(r.success == false) {
				_me.world().setLoading(false);
				_me.world().showErrorMsg('执行第' + (index + 1) + '条失败 -> ' + r.msg);
				_me.cancelPiLiangShenpi();
			}
			else {
				if((index + 1) >= items.length) {
					_me.world().showInfoMsg('批量审核执行完毕');
					_me.world().setLoading(false);
					_me.cancelPiLiangShenpi();
					_me.loadData();
				}
				else {
					index++;
					_piLiangTG(items, index);
				}
			}
		});
	}
	
	this.confirmPiLiangShenpi = function() {
		var checkeds = _me.dataGrid().checkedItems();
		if(checkeds == null || checkeds.length == 0) {
			_me.world().showErrorMsg('请至少选择一项');
		}
		else {
			_me.world().confirm('确定要通过此 ' + checkeds.length + ' 条申请？', function(r) {
				if(r == 'yes') {
					_piLiangTG(checkeds, 0);
				}
			});
		}
	};
	
	this.cancelPiLiangShenpi = function() {
		for(var i=0;i<_me.ctrlBtns().length;i++) {
			/*
			if(_me.ctrlBtns()[i].cfg().value == '批量审核') {
				_me.ctrlBtns()[i].show();
			}
			else */
			if(_me.ctrlBtns()[i].cfg().value == '确认选择') {
				_me.ctrlBtns()[i].hide();
			}
			else if(_me.ctrlBtns()[i].cfg().value == '取消选择') {
				_me.ctrlBtns()[i].hide();
			}
			else {
				//_me.ctrlBtns()[i].disabled(false);
				_me.ctrlBtns()[i].show();
			}
		}
		_me.dataGrid().hideCheckbox();
	};
};
CSJSV3.AUI.CurrentListMgrView.prototype = new CSJSV3.SuperHelper();