
CSJSV3.AUI.GongZuoJingLiForm = function(cfg) {
	var _me = this;
	var _toUpdWin;
	var _dataAgent;
	var _shenpiTGBtn;
	var _shenpiCHBtn;
	var _saveBtn;
	var _submitBtn;
	var _mode;

	{
		cfg.updTypeFieldName = 'updType';
		cfg.hiddenFields = [
			{ label : 'id', name : 'id', value : '', canEmpty : false, canEmptyFor : '' }
		];
		cfg.style = '';
		cfg.fieldLabelStyle = 'width:70px;';
		cfg.rows = [ 
			{
				fields : [ 
					{
						label: '起始时间',
						type: 'custom',
						name: 'start',
						value: '',
						canEmpty : false,
						canEmptyFor : '',
						body: new CSJSV3.UI.YearMonthPicker({  })
					},
					{
						label: '截至时间',
						type: 'custom',
						name: 'end',
						value: '',
						canEmpty : false,
						canEmptyFor : '',
						body: new CSJSV3.UI.YearMonthPicker({  })
					}
				]
			}, 
			{
				fields : [
					{
						label: '工作单位',
						type: 'text',
						name: 'dw',
						canEmpty : false,
						canEmptyFor : '',
						style: 'width:303px;'
					}
				]
			}, 
			{
				fields : [
					{
						label: '部门',
						type: 'text',
						name: 'bm',
						canEmpty : false,
						canEmptyFor : ''
					},
					{
						label: '职务',
						type: 'text',
						name: 'zw',
						canEmpty : false,
						canEmptyFor : ''
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
};
CSJSV3.AUI.GongZuoJingLiForm.prototype = new CSJSV3.SuperHelper();


CSJSV3.AUI.GongZuoJingLiList = function(cfg) {
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
		_form = new CSJSV3.AUI.GongZuoJingLiForm({
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
            columns: [
                {
                    title: '序号',
                    style: 'text-align:center;width:30px;',
                    tpl_func: function (vals, index) {
                        return index + 1;
                    }
                },
                {
                    title: '起始时间',
                    style: 'text-align:center;width:60px;',
                    tpl_func: function (vals, index) {
                        return vals.start;
                    }
                },
                {
                    title: '截至时间',
                    style: 'text-align:center;width:60px;',
                    tpl_func: function (vals, index) {
                        return vals.end;
                    }
                },
                {
                    title: '工作单位',
                    style: 'text-align:center;',
                    flex: 1,
                    tpl_func: function (vals, index) {
                        return vals.dw;
                    }
                },
                {
                    title: '部门',
                    style: 'text-align:center;',
                    tpl_func: function (vals, index) {
                        return vals.bm;
                    }
                },
                {
                    title: '职务',
                    style: 'text-align:center;',
                    tpl_func: function (vals, index) {
                        return vals.zw;
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
		_form.showForNew({});
	};
	
	this.toEdit = function() {
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
CSJSV3.AUI.GongZuoJingLiList.prototype = new CSJSV3.SuperHelper();