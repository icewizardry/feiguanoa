
CSJSV3.AUI.JiaBanUserForm = function(cfg) {
	var _me = this;
	var _toUpdWin;
	var _dataAgent;
	var _shenpiTGBtn;
	var _shenpiCHBtn;
	var _saveBtn;
	var _submitBtn;
	var _mode;
	var _isDayOff = false;
	var _isDayOff_end = false;

	{
		cfg.updTypeFieldName = 'updType';
		cfg.hiddenFields = [
			{ label : 'id', name : 'id', value : '', canEmpty : false, canEmptyFor : '' },
			{ label : 'txts', name : 'txts', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : 'zbf', name : 'zbf', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : 'dayoffdates', name : 'dayoffdates', value : '', canEmpty : true, canEmptyFor : '' }
		];
		cfg.style = '';
		cfg.fieldLabelStyle = 'width:70px;';
		cfg.rows = [ 
			{
				fields : [ 
					{
						label: '开始日期',
						type: 'datepicker',
						name: 'startdate',
						value: '',
						canEmpty : false,
						canEmptyFor : '',
						onChange: function(e, self) {
							/*
							_me.world().setLoading('检测日期');
							_me.com().reqByCmd('isspecialday', {date:self.value(),userid:''}, function(r) {
								_me.world().setLoading(false);
								if(r.success == false) {
									_me.world().showErrorMsg(r.msg);
								}
								else {
									_isDayOff = r.data;
								}
							}, '../../api/kaoqin');*/
							/*
							_me.findFieldByName('enddate').value(self.value());*/
						}
					},
					{
						hideLabel: true,
						label : '开始时间', 
						type : 'text',
						name : 'starttime',
						value : '',
						canEmpty : false,
						canEmptyFor : '',
						style : 'width:50px;margin-left:20px;'
					},
					{
						label: '结束日期',
						type: 'datepicker',
						name: 'enddate',
						value: '',
						canEmpty : false,
						canEmptyFor : '',
						onChange: function(e, self) {
							/*
							_me.world().setLoading('检测日期');
							_me.com().reqByCmd('isspecialday', {date:self.value(),userid:''}, function(r) {
								_me.world().setLoading(false);
								if(r.success == false) {
									_me.world().showErrorMsg(r.msg);
								}
								else {
									_isDayOff_end = r.data;
								}
							}, '../../api/kaoqin');*/
						}
					}, 
					{
						hideLabel: true,
						label : '结束时间', 
						type : 'text',
						name : 'endtime',
						value : '',
						canEmpty : false,
						canEmptyFor : '',
						style : 'width:50px;margin-left:20px;margin-right:20px;'
					} 
				]
			}, 
			{
				fields : [
					{
						label: '人员',
						type: 'custom',
						name: 'userid',
						nameOfText: 'username',
						canEmpty : false,
						canEmptyFor : '',
						body: new CSJSV3.AUI.UsersSelector1Box({
							valueType: 'id',
							inputStyle: 'width:80px;',
        					showCheckbox:false//,
        					//onlyMyTeams:true
						})
					}, {
						label : '补偿类型',
						type : 'select',
						name : 'bctype',
						value : '',
						canEmpty : false,
						canEmptyFor : '',
						style : '',
						items: [
							{text:'调休单',value:'0'},
							{text:'值班费（仅限法定节假日值班）',value:'1'}
						],
						onChange: function() {
						}
					}
				]
			}
		];

		cfg.onLoadData = function(self) {
		};
		cfg.onAppendBtnBefore = function(self, ctrlRow) {
		};
		cfg.onAppendBtnAfter = function(self, ctrlRow) {
		};
		cfg.onCheckData = function(self, callback) {
			var bctype = _me.findFieldByName('bctype').value();
			var startdate = _me.findFieldByName('startdate').value();
			var enddate = _me.findFieldByName('enddate').value();
			var starttime = _me.findFieldByName('starttime').value();
			var endtime = _me.findFieldByName('endtime').value();
			if(starttime.length != 5 || starttime.indexOf(':') == -1) {
				_me.world().showErrorMsg('开始时间格式不正确（正确格式：HH:mm）');
			}
			else if(endtime.length != 5 || endtime.indexOf(':') == -1) {
				_me.world().showErrorMsg('结束时间格式不正确（正确格式：HH:mm）');
			}
			/*else if((_isDayOff == false || _isDayOff_end == false) && bctype == '1') {
				_me.world().showErrorMsg('选择的日期不是法定节假日，不可选择此补偿类型');
			}*/
			else {
				_calTxtsOrJbf();
				var dayoffdates = _me.findFieldByName('dayoffdates').value();
				if(bctype == '1' && dayoffdates == '') {
					_me.world().showErrorMsg('选择的日期不是法定节假日，不可选择值班费');
					return false;
				}
				
				if(bctype == '0') {
					if(_me.findFieldByName('txts').value() == '') {
						//_me.world().showErrorMsg('调休天数不正确');
						return false;
					}
				}
				
				if (callback != null) {
	                callback();
	            }
            	return true;
			}
            return false;
		};
		cfg.onSubmitBtnClick = function(self) {
			
		};
		cfg.onSubmit = function(self) {
			_toUpdWin.hide();
			if (cfg.onSubmitDone != null) {
				cfg.onSubmitDone();
			}
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
	
	this.mode = function() {
		return _mode;
	};

	this.showForNew = function(data) {
		_mode = 'new';
		_me.reset();
		data.id = _me.com().newGuid();
		_me.data(data);
		_toUpdWin.title('新增人员');
		_toUpdWin.show();
		setTimeout(function() {
			_toUpdWin.getUICore().find('.BodyCon').animate({scrollTop:0},60);
		}, 500);
		/* 聚焦提交按钮 */
		_toUpdWin.getUICore().find('.SubmitBtn').focus();
	};

	this.showForEdit = function(data) {
		_mode = 'edit';
		_me.reset();
		_me.data(data);
		_toUpdWin.title('编辑人员');
		_toUpdWin.show();
		setTimeout(function() {
			_toUpdWin.getUICore().find('.BodyCon').animate({scrollTop:0},60);
		}, 500);
		/* 聚焦提交按钮 */
		_toUpdWin.getUICore().find('.SubmitBtn').focus();
	};
	
	function _calTxtsOrJbf() {
		var bctype = _me.findFieldByName('bctype').value();
		var userid = _me.findFieldByName('userid').value();
		var startdate = _me.findFieldByName('startdate').value();
		var enddate = _me.findFieldByName('enddate').value();
		var starttime = _me.findFieldByName('starttime').value();
		var endtime = _me.findFieldByName('endtime').value();
		var dayoffdates = _me.findFieldByName('dayoffdates');
		
		_me.findFieldByName('txts').value('');
		_me.findFieldByName('zbf').value('');
		
			
		$.ajax({
            type: "POST",
            url: "../../api/jiabandan?cmd=caljiabantime",
            data: { userid:userid, start:startdate + ' ' + starttime, end:enddate + ' ' + endtime },
            async: false,
            timeout: 1000 * 60,
            success: function (txt) {
                var r = eval('(' + txt + ')');
                if (r.success == false) {
                	_me.world().showErrorMsg(r.msg);
                }
                else {
                    txts = r.data.days;
		
					_me.findFieldByName('txts').value(txts);
					
					dayoffdates.value(r.data.dayoffdates);
                }
            },
            error: function (r) {
                alert('请求失败，可能网络或服务器当前不可用');
                _me.findFieldByName('txts').value('');
            }
        });
            
		if(bctype == '0') {
			var txts = 0;
			var datetime1 = new Date(startdate + ' ' + starttime);
			var datetime2 = new Date(enddate + ' ' + endtime);
			var hour = (datetime2 - datetime1) / 1000 / 60 / 60;
			if(hour > 20) {
				txts = 3;
			}
			else if(hour > 16) {
				txts = 2.5;
			}
			else if(hour > 12) {
				txts = 2;
			}
			else if(hour > 8) {
				txts = 1.5;
			}
			else if(hour > 4) {
				txts = 1;
			}
			else {
				txts = 0.5;
			}
			
			if(_isDayOff) {
				txts = txts * 2;
			}
		}
		else if(bctype == '1') {
			var zbf = 100;
			_me.findFieldByName('zbf').value(zbf);
			_me.findFieldByName('txts').value('');
		}
	}
};
CSJSV3.AUI.JiaBanUserForm.prototype = new CSJSV3.SuperHelper();


CSJSV3.AUI.JiaBanUserList = function(cfg) {
	var _me = this;
	var _uiCore;
	var _form;
	var _dataGrid;
	
	{
		if(cfg.name == null) cfg.name = '';
		_uiCore = $('<div class="CanChangeListPanel"><div class="CtrlArea"><input class="NewBtn Btn" type="button" value="新增" />&emsp;<input class="EditBtn Btn" type="button" value="编辑" />&emsp;<input class="DelBtn Btn" type="button" value="删除" /></div><div class="ListArea"></div><input type="hidden" name="' + cfg.name + '" /></div>');
		_uiCore.append('<style>.CanChangeListPanel .Btn { padding-top:3px;padding-bottom:3px; }</style>');
		_uiCore.find('.NewBtn').click(function() {
			_me.toNew();
		});
		_uiCore.find('.EditBtn').click(function() {
			_me.toEdit();
		});
		_uiCore.find('.DelBtn').click(function() {
			_me.toDel();
		});
		cfg.uiCore = _uiCore;
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		_form = new CSJSV3.AUI.JiaBanUserForm({
			onSubmitDone: function () {
				if(_form.mode() == 'new') {
					var item = _form.data();
					var data = _dataGrid.data();
					if(data == null) data = [];
					data.push(item);
					_dataGrid.data(data);
					_dataGrid.render();
				}
				else {
					var item = _form.data();
					var data = _dataGrid.data();
					for(var i=0;i<data.length;i++) {
						if(data[i].id == item.id) {
							data[i] = item;
							break;
						}
					}
					_dataGrid.data(data);
					_dataGrid.render();
				}
	        	convertDataToStr();
			}
		});
		_form.init(world);
		_dataGrid = new CSJSV3.UI.DataGrid({
            //showCheckbox: true,
            bodyHeight: 200,
            allowNiceScroll:false,
            columns: [
                {
                    title: '姓名',
                    style: 'text-align:center;width:60px;',
                    tpl_func: function (vals, index) {
                        return vals.username;
                    }
                },
                {
                    title: '补偿方式',
                    style: 'text-align:center;width:100px;',
                    tpl_func: function (vals, index) {
                    	if(vals.bctype == '0') {
                    		return '调休单';
                    	}
                    	else if(vals.bctype == '1') {
                    		return '值班费（仅限法定节假日值班）';
                    	}
                        return vals.bctype;
                    }
                },
                {
                    title: '加班时间',
                    style: 'text-align:center;width:260px;',
                    tpl_func: function (vals, index) {
                    	var t1 = '';
                    	var t2 = '';
                    	if(vals.dayoffdates == null) vals.dayoffdates = '';
                    	if(vals.dayoffdates.indexOf(vals.startdate) != -1) {
                    		t1 = 'color:red;';
                    	}
                    	if(vals.dayoffdates.indexOf(vals.enddate) != -1) {
                    		t2 = 'color:red;';
                    	}
                        return '<span style="' + t1 + '">' + vals.startdate + ' ' + vals.starttime + '</span> ~ <span style="' + t2 + '">' + vals.enddate + ' ' + vals.endtime + '</span>';
                    }
                },
                {
                    title: '调休天数',
                    style: 'text-align:center;width:60px;',
                    tpl_func: function (vals, index) {
                        return vals.txts;
                    }
                },
                {
                    title: '值班费',
                    style: 'text-align:center;width:60px;',
                    tpl_func: function (vals, index) {
                        return vals.zbf;
                    }
                }
            ],
            onSelectedChange: function (self) {
                
            }
        });
        _dataGrid.init(world);
        _dataGrid.getUICore().css('box-shadow', 'none');
        _uiCore.find('.ListArea').append(_dataGrid.getUICore());
	};
	
	this.render = function() {
		_me.base.render();
        _dataGrid.render();
	};
	
	this.hideBtns = function() {
		_uiCore.find('.CtrlArea').hide();
	};
	
	this.showBtns = function() {
		_uiCore.find('.CtrlArea').show();
	};
	
	this.toNew = function() {
		_form.render();
		_form.showForNew({starttime:'09:00',endtime:'17:00'});
		var starttime = cfg.parent.findFieldByName('starttime').value();
		_form.findFieldByName('startdate').value(starttime.split(' ')[0]);
		_form.findFieldByName('starttime').value(starttime.split(' ')[1]);
		var endtime = cfg.parent.findFieldByName('endtime').value();
		_form.findFieldByName('enddate').value(endtime.split(' ')[0]);
		_form.findFieldByName('endtime').value(endtime.split(' ')[1]);
	};
	
	this.toEdit = function() {
		_form.render();
		var selected = _dataGrid.selectedItem();
		if(selected == null) {
			_me.world().showErrorMsg('请选择一项');
		}
		else {
			_form.showForEdit(selected);
		}
	};
	
	this.toDel = function() {
		var selected = _dataGrid.selectedItem();
		if(selected == null) {
			_me.world().showErrorMsg('请选择一项');
		}
		else {
			var data = _dataGrid.data();
	        for(var i=0; i < data.length; i++) {
	        	if(data[i].id == selected.id) {
	        		data.splice(i, 1);
	        		_dataGrid.data(data);
	        		_dataGrid.render();
	        		break;
	        	}
	        }
	        convertDataToStr();
		}
	};
	
	this.name = function(v) {
		if(v != null) {
			_uiCore.find('input[type=hidden]').attr('name', v);
		}
		else {
			return _uiCore.find('input[type=hidden]').attr('name');
		}
	};
	
	this.value = function(v) {
		if(v != null) {
			_uiCore.find('input[type=hidden]').val(v);
			convertStrToData();
		}
		else {
			return _uiCore.find('input[type=hidden]').val();
		}
	};
	
	this.val = function(v) {
		return _me.value(v);
	};

    this.showInputErrorTip = function () {
        _uiCore.addClass('InputErrorTip');
    };

    this.hideInputErrorTip = function () {
        _uiCore.removeClass('InputErrorTip');
    };
    
    this.userids = function() {
    	var arr = [];
    	var data = _dataGrid.data();
    	for(var i=0;i<data.length;i++) {
    		arr.push(data[i].userid);
    	}
    	return arr;
    };
    
    this.usernames = function() {
    	var arr = [];
    	var data = _dataGrid.data();
    	for(var i=0;i<data.length;i++) {
    		arr.push(data[i].username);
    	}
    	return arr;
    }
    
    function convertDataToStr() {
    	var data = _dataGrid.data();
    	if(data == null || data.length == 0) {
			_uiCore.find('input[type=hidden]').val('');
    	}
    	else {
			_uiCore.find('input[type=hidden]').val(JSON.stringify(data));
    	}
    }
    
    function convertStrToData() {
    	var str = _uiCore.find('input[type=hidden]').val();
    	if(str == null || str == '') {
    		_dataGrid.data([]);
    		_dataGrid.render();
    	}
    	else {
    		var data = JSON.parse(str);
    		_dataGrid.data(data);
    		_dataGrid.render();
    	}
    }
};
CSJSV3.AUI.JiaBanUserList.prototype = new CSJSV3.SuperHelper();