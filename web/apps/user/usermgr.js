CSJSV3.AUI.DataAgent = function(cfg) {
	var _me = this;
	var _reqSvrUrl = '../../api/user';

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
		_me.com().reqByCmd('list', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.saveForm = function(pars, callback) {
		_me.com().reqByCmd('saveform', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.loadForm = function(pars, callback) {
		_me.com().reqByCmd('loadform', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.removeForm = function(pars, callback) {
		_me.com().reqByCmd('removeform', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.lizhi = function(pars, callback) {
		_me.com().reqByCmd('lizhi', pars, function(r) {
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
			label : '',
			name : 'sacode',
			value : '',
			canEmpty : true,
			canEmptyFor : ''
		}, {
			label : '',
			name : 'passwordformat',
			value : '',
			canEmpty : true,
			canEmptyFor : ''
		} ];
		cfg.fieldLabelStyle = 'width:120px;';
		cfg.rows = [ {
			fields : [ {
				label : '用户名',
				type : 'text',
				name : 'username',
				value : '',
				canEmpty : false,
				canEmptyFor : '',
				style : ''
			}, {
				label : '密码',
				type : (canSeePwd() ? 'text' : 'password'),
				name : 'password',
				value : '',
				canEmpty : false,
				canEmptyFor : 'edit',
				style : ''
			}, {
				label : '锁定',
				type : 'custom',
				name : 'islock',
				value : '',
				canEmpty : false,
				canEmptyFor : '',
				style : '',
				body: new CSJSV3.UI.Checkbox({})
			} ]
		}, {
			fields : [ {
				label : '姓名',
				type : 'text',
				name : 'realname',
				value : '',
				canEmpty : false,
				canEmptyFor : '',
				style : ''
			}, {
				label : '曾用名',
				type : 'text',
				name : 'realname1',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : ''
			}, {
				label : '性别',
				type : 'radio',
				name : 'sex',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : '',
				items: [{text:'男',value:'0'},{text:'女',value:'1'}]
			} ]
		}, {
			fields : [ {
				label : '本人照片',
				type : 'custom',
				name : 'imgurl0',
				canEmpty : true,
				canEmptyFor : '',
				style : '',
				body: new CSJSV3.UI.PhotoSelector({width:106,height:140})
			}, {
				label : '角色',
				type : 'custom',
				name : 'roles',
				canEmpty : true,
				canEmptyFor : '',
				style : 'width:359px;',
				body: new CSJSV3.AUI.RolesSelector({})
			} ]
		}, {
			fields : [ {
				label : '入职日期',
				type : 'datepicker',
				name : 'ruzhidate',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : 'width:100px;'
			},{
				label : '离职日期',
				type : 'datepicker',
				name : 'lizhidate',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : 'width:100px;'
			},{
				label : '退休日期',
				type : 'datepicker',
				name : 'tuixiudate',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : 'width:100px;margin-right:50px;'
			} ]
		}, {
			fields : [{
				label : '参加工作日期',
				type : 'datepicker',
				name : 'cjgzdate',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : 'width:100px;'
			},{
				label : '籍贯',
				type : 'text',
				name : 'jiguan',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : ''
			},{
				label : '民族',
				type : 'text',
				name : 'minzu',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : ''
			} ]
		}, {
			fields : [{
				label : '户口所在地',
				type : 'text',
				name : 'hukousuozaidi',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : 'width:353px;'
			}, {
				label : '文化程度',
				type : 'custom',
				name : 'wenhuachengdu',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : '',
				body: new CSJSV3.UI.ComboBox({ items:[{text:'博士',value:'博士'},{text:'硕士',value:'硕士'},{text:'研究生',value:'研究生'},{text:'本科',value:'本科'},{text:'大专',value:'大专'},{text:'高中',value:'高中'},{text:'小学',value:'小学'}] })
			} ]
		}, {
			fields : [{
				label : '职级',
				type : 'number',
				name : 'level',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : ''
			},{
				label : '职务',
				type : 'text',
				name : 'duty',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : ''
			}, {
				label : '专业技术等级',
				type : 'text',
				name : 'zyjsdj',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : ''
			} ]
		}, {
			fields : [ {
				label : '身份证',
				type : 'text',
				name : 'idcard',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : ''
			},{
				label : '出生日期',
				type : 'datepicker',
				name : 'csrq',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : 'width:100px;'
			},{
				label : '出生地',
				type : 'text',
				name : 'csd',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : ''
			} ]
		}, {
			fields : [ {
				label : '手机号',
				type : 'text',
				name : 'mobile',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : ''
			},{
				label : 'QQ',
				type : 'text',
				name : 'qq',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : ''
			},{
				label : '微信号',
				type : 'text',
				name : 'qywxid',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : ''
			} ]
		}, {
			fields : [ {
				label : '邮箱',
				type : 'text',
				name : 'email',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : ''
			},{
				label : '序号',
				type : 'text',
				name : 'xuhao',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : ''
			},{
				label : '门禁卡',
				type : 'text',
				name : 'mjcard',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : ''
			} ]
		}, {
			fields : [ {
				label : '家庭地址',
				type : 'text',
				name : 'homeaddress',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : 'width:353px;'
			},{
				label : '家庭电话',
				type : 'text',
				name : 'homephone',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : ''
			} ]
		}, {
			fields : [ {
				label : '通讯地址',
				type : 'text',
				name : 'tongxunaddress',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : 'width:353px;'
			},{
				label : '邮编',
				type : 'text',
				name : 'postcode',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : ''
			} ]
		}, {
			fields : [ {
				label : '政治面貌',
				type : 'text',
				name : 'zhengzhimianmao',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : ''
			},{
				label : '入党日期',
				type : 'datepicker',
				name : 'rudangdate',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : 'width:100px;'
			},{
				label : '入党介绍人',
				type : 'text',
				name : 'rudangjieshaoren',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : ''
			} ]
		}, {
			fields : [ {
				label : '备注',
				type : 'textarea',
				name : 'note',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : 'width:604px;height:100px;margin-top:12px;'
			} ]
		}, {
			fields : [ {
				label : '干部任免审批表',
				type : 'custom',
				name : 'uploadfiles0',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : '',
				body: new CSJSV3.UI.UploadBoxA({ style: 'max-width:612px;', btns1: [{ title: '下载模板', onClick: function () { alert('暂无模板'); }}] })
			} ]
		}, {
			fields : [ {
				label : '工作经历',
				type : 'custom',
				name : 'gongzuojingli',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : 'width:614px;',
				body: new CSJSV3.AUI.GongZuoJingLiList({  })
			} ]
		}, {
			fields : [ {
				label : '学习情况',
				type : 'custom',
				name : 'xuexiqingkuang',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : 'width:614px;',
				body: new CSJSV3.AUI.XueXiQingKuangList({  })
			} ]
		} ];

		cfg.onCheckData = function(self, callback) {
			var ruzhidate = _me.findFieldByName('ruzhidate').value();
			var cjgzdate = _me.findFieldByName('cjgzdate').value();
			if(ruzhidate != '' && (ruzhidate.indexOf('-') == -1 || ruzhidate.length != 10)) {
				_me.world().showErrorMsg('入职日期格式不正确（正确格式：yyyy-mm-dd）');
			}
			else if(cjgzdate != '' && (cjgzdate.indexOf('-') == -1 || cjgzdate.length != 10)) {
				_me.world().showErrorMsg('参加工作日期格式不正确（正确格式：yyyy-mm-dd）');
			}
			else {
				if (callback != null) {
	                callback();
	            }
            	return true;
			}
            return false;
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
		_toUpdWin = new CSJSV3.UI.Win({
			title : '',
			body : _me.getUICore(),
			closeBtnType : 'hide'
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
				}, 300);
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
				}, 300);
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
		cfg.loadListCmd = 'list';
		_dataAgent = new CSJSV3.AUI.DataAgent({});
		cfg.reqSvrUrl = _dataAgent.reqSvrUrl();
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.ListMgrView(cfg));
		/* 定义查询字段 */
		this.base.createSearchFields = function() {
			return [ {
				label : '姓名',
				type : 'text',
				name : 'realname',
				value : ''
			}, {
				label : '用户名',
				type : 'text',
				name : 'username',
				value : ''
			}, {
				label : '角色',
				type : 'text',
				name : 'role1',
				value : ''
			}, {
				label : '科室',
				type : 'text',
				name : 'bm',
				value : ''
			}, {
				label : '状态',
				type : 'select',
				name : 'state',
				value : '',
				items: [
					{ text: '全部', value: 'all' },
					{ text: '正常', value: '' },
					{ text: '离职', value: 'lz' }
				],
				onChange: function() {
					_me.loadData();
				}
			} ];
		};
		/* 定义控制按钮 */
		this.base.createCtrlFields = function() {
			return [ {
				type : 'button',
				value : '新增',
				onClick : function(e) {
					_me.toNew();
				}
			}, {
				type : 'button',
				value : '编辑',
				onClick : function(e) {
					_me.toEdit();
				}
			}, {
				type : 'button',
				value : '删除',
				onClick : function(e) {
					_me.toDel();
				}
			}, {
				type : 'button',
				value : '权限',
				onClick : function(e) {
					_me.toPpd();
				}
			}, {
				type : 'button',
				value : '离职',
				ppdKey: 'usr_usermgr_lizhi',
				onClick : function(e) {
					//_me.toLiZhi();
					_me.world().alert('此功能已取消，请在表单里设置离职时间');
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
				title : '姓名',
				style : 'text-align:center;width:120px;',
				tpl_func : function(vals, index) {
					return vals.realname;
				}
			});
			cols.push({
				title : '用户名',
				style : 'text-align:center;width:120px;',
				tpl_func : function(vals, index) {
					return vals.username;
				}
			});
			cols.push({
				title : '角色',
				style : 'text-align:left;width:180px;',
				tpl_func : function(vals, index) {
					return vals.rolesstr;
				}
			});
			cols.push({
				title : '职务',
				style : 'text-align:center;width:100px;',
				tpl_func : function(vals, index) {
					return vals.duty;
				}
			});
			cols.push({
				title : '职级',
				style : 'text-align:center;width:50px;',
				tpl_func : function(vals, index) {
					return vals.level;
				}
			});
			cols.push({
				title : '部门',
				style : 'text-align:center;width:120px;',
				tpl_func : function(vals, index) {
					return vals.bm;
				}
			});
			cols.push({
				title : '门禁卡',
				style : 'text-align:center;width:90px;',
				tpl_func : function(vals, index) {
					return vals.mjcard;
				}
			});
			cols.push({
				title : '在职状态',
				style : 'text-align:center;width:60px;',
				tpl_func : function(vals, index) {
					if(vals.tuixiudate != null && vals.tuixiudate != '') {
						return '退休';
					}
					else if(vals.lizhidate != null && vals.lizhidate != '') {
						return '离职';
					}
					return '在职';
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

	this.toPpd = function() {
		var selected = _me.selectedItem();
		if (selected == null) {
			_me.world().showErrorMsg('请先选择一项');
		} else {
			parent.addTab({ title: '用户“' + selected.realname + '”的权限', body: '../apps/user/ppdmgr.htm?tgttype=user&tgtid=' + selected.id, bodyType: 'url', closeable: true });
		}
	};
	
	this.toLiZhi = function() {
		var selected = _me.selectedItem();
		if (selected == null) {
			_me.world().showErrorMsg('请先选择一项');
		} else {
			_me.world().confirm('确认设为离职？', function(r) {
				if (r == 'yes') {
					_me.world().setLoading(true);
					_dataAgent.lizhi({
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
};
CSJSV3.AUI.CurrentListMgrView.prototype = new CSJSV3.SuperHelper();