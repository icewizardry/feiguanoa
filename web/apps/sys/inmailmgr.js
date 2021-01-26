CSJSV3.AUI.DataAgent = function(cfg) {
	var _me = this;
	var _reqSvrUrl = '../../api/inmail';

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

	this.loadForm = function(pars, callback) {
		_me.com().reqByCmd('loadform', pars, function(r) {
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

	this.removeForm = function(pars, callback) {
		_me.com().reqByCmd('removeform', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.destroyForm = function(pars, callback) {
		_me.com().reqByCmd('destroyform', pars, function(r) {
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
	var _saveBtn;
	var _replyBtn;
	var _mode;

	{
		cfg.updTypeFieldName = 'updType';
		cfg.hiddenFields = [
			{ label : 'id', name : 'id', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : 'crttime', name : 'crttime', value : '', canEmpty : false, canEmptyFor : '' },
			{ label : 'fromuserid', name : 'fromuserid', value : '', canEmpty : false, canEmptyFor : '' },
			{ label : 'fromuser', name : 'fromuser', value : '', canEmpty : false, canEmptyFor : '' },
			{ label : 'touserids', name : 'touserids', value : '', canEmpty : false, canEmptyFor : '' },
			{ label : 'ccuserids', name : 'ccuserids', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : 'hasreaduserids', name : 'hasreaduserids', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : 'readtime', name : 'readtime', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : 'flow', name : 'flow', value : '', canEmpty : false, canEmptyFor : '' },
			{ label : 'hideuserids', name : 'hideuserids', value : '', canEmpty : true, canEmptyFor : '' }
		];
		cfg.style = '';
		cfg.fieldLabelStyle = 'width:70px;';
		cfg.rows = [ {
			fields : [ {
				label : '收信人',
				type : 'custom',
				name : 'tousersForDisplay',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : '',
				body: new CSJSV3.UI.MailUserDisplayBar({}),
				hide: true
			} ]
		}, {
			fields : [ {
				label : '抄送人',
				type : 'custom',
				name : 'ccusersForDisplay',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : '',
				body: new CSJSV3.UI.MailUserDisplayBar({}),
				hide: true
			} ]
		}, {
			fields : [ {
				label : '收信人',
				type : 'custom',
				name : 'tousers',
				value : '',
				canEmpty : false,
				canEmptyFor : '',
				style : '',
				body: new CSJSV3.AUI.UsersSelector1Box({
					onCheckDone:function(self, checkeds) {
        				var str = '';
        				if(checkeds != null && checkeds.length > 0) {
        					for(var i=0;i < checkeds.length;i++) {
        						if(i!=0) {
        							str += ',';
        						}
        						str += checkeds[i].id;
        					}
        				}
        				_me.findFieldByName('touserids').value(str);
        			}
				})
			} ]
		}, {
			fields : [ {
				label : '抄送人',
				type : 'custom',
				name : 'ccusers',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : '',
				body: new CSJSV3.AUI.UsersSelector1Box({
					onCheckDone:function(self, checkeds) {
        				var str = '';
        				if(checkeds != null && checkeds.length > 0) {
        					for(var i=0;i < checkeds.length;i++) {
        						if(i!=0) {
        							str += ',';
        						}
        						str += checkeds[i].id;
        					}
        				}
        				_me.findFieldByName('ccuserids').value(str);
        			}
				})
			} ]
		}, {
			fields : [ {
				label : '主题',
				type : 'text',
				name : 'title',
				value : '',
				canEmpty : false,
				canEmptyFor : '',
				style : 'width:600px;'
			} ]
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
					label : '内容',
					type : 'custom',
					name : 'content',
					value : '',
					canEmpty : false,
					canEmptyFor : '',
					style : 'width:606px;height:500px;margin-right:25px;margin-top:8px;',
					body: new CSJSV3.UI.EditorA({})
				}
			]
		}];

		cfg.onLoadData = function(self) {
		};
		cfg.onAppendBtnBefore = function(self, ctrlRow) {
            //保存按钮
            _saveBtn = $('<input type="button" class="SaveBtn CSJSV3UIBtn1" value="保存" style="margin-right:30px;" />');
            _saveBtn.click(function() {
            	self.findFieldByName('flow').value('101');
            	self.submit();
            });
            ctrlRow.append(_saveBtn);
            //回复按钮
            _replyBtn = $('<input type="button" class="ReplyBtn CSJSV3UIBtn1" value="回复" style="margin-right:30px;" />');
            _replyBtn.click(function() {
            	_me.showForReply();
            });
            ctrlRow.append(_replyBtn);
		};
		cfg.onAppendBtnAfter = function(self, ctrlRow) {
			ctrlRow.find('.SubmitBtn').val('发送');
			ctrlRow.find('.CancelBtn').val('返回');
		};
		cfg.onSubmitBtnClick = function(self) {
			_me.findFieldByName('flow').value(0);
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

		_me.findFieldByName('tousersForDisplay').hide();
		_me.findFieldByName('tousersForDisplay').item().clear();
		_me.findFieldByName('tousers').show();
		_me.findFieldByName('ccusersForDisplay').hide();
		_me.findFieldByName('ccusersForDisplay').item().clear();
		_me.findFieldByName('ccusers').show();
		
		for(var i=0;i<_me.fields().length;i++) {
			_me.fields()[i].readonly(false);
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
				_toUpdWin.title('写邮件');
				_toUpdWin.show();
				setTimeout(function() {
					_toUpdWin.getUICore().find('.BodyCon').animate({scrollTop:0},60);
				}, 500);
				/* 聚焦提交按钮 */
				_toUpdWin.getUICore().find('.SubmitBtn').focus();
			}
		});
	};

	this.showForSee = function(selected) {
		_mode = 'edit';
		_me.world().setLoading(true);
		_me.hideAllBtns();
		_me.showBtnByClass('CancelBtn');
		//
		
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

				_me.findFieldByName('tousersForDisplay').item().clear();
				if (r.data.tousers != null && r.data.tousers != '') {
					_me.findFieldByName('tousersForDisplay').item().setUsers(JSON.parse(r.data.tousers), r.data.hasreaduserids);
				}
				_me.findFieldByName('tousersForDisplay').show();
				_me.findFieldByName('tousers').hide();

				_me.findFieldByName('ccusersForDisplay').item().clear();
				if (r.data.ccusers != null && r.data.ccusers != '') {
					_me.findFieldByName('ccusersForDisplay').item().setUsers(JSON.parse(r.data.ccusers), r.data.hasreaduserids);
				}
				_me.findFieldByName('ccusersForDisplay').show();
				_me.findFieldByName('ccusers').hide();
				
				if(r.data.flow == '0') {
					for(var i=0;i<_me.fields().length;i++) {
						_me.fields()[i].readonly(true);
					}
					_me.showBtnByClass('ReplyBtn');
				}
				else if(r.data.flow == '101') {
					_me.showBtnByClass('SaveBtn');
					_me.showBtnByClass('SubmitBtn');
				}
				else {
					for(var i=0;i<_me.fields().length;i++) {
						_me.fields()[i].readonly(true);
					}
				}
				
				_toUpdWin.title('查看邮件');
				_toUpdWin.show();
				setTimeout(function() {
					_toUpdWin.getUICore().find('.BodyCon').animate({scrollTop:0},60);
				}, 500);
				/* 聚焦提交按钮 */
				_toUpdWin.getUICore().find('.ReplyBtn').focus();
			}
		});
	};

	this.showForReply = function() {
		_me.world().setLoading(true);
		_me.hideAllBtns();
		_me.showBtnByClass('SaveBtn');
		_me.showBtnByClass('SubmitBtn');
		_me.showBtnByClass('CancelBtn');
		
		_me.findFieldByName('id').value('');
		_me.findFieldByName('updType').value('new');
		
		for(var i=0;i<_me.fields().length;i++) {
			_me.fields()[i].readonly(false);
		}
		
		setTimeout(function() {
			
			var fromuseridField = _me.findFieldByName('fromuserid');
			var fromuserField = _me.findFieldByName('fromuser');
			var touseridsField = _me.findFieldByName('touserids');
			var tousersField = _me.findFieldByName('tousers');
			//设置回复时的主题和内容
			var contentField = _me.findFieldByName('content');
			_me.findFieldByName('hideuserids').value('');
			var str = '';
			str += '<div><br/></div>';
			str += '<div><br/></div>';
			str += '<div>------------------ 原始邮件 ------------------</div>';
			str += '<div style="background-color:#EFEFEF;padding-left:8px;">';
			str += '<div>发件人：' + fromuserField.value() + '</div>';
			str += '<div>发送时间：' + _me.findFieldByName('crttime').value() + '</div>';
			str += '<div>收件人：' + _me.findFieldByName('tousers').text() + '</div>';
			str += '<div>主题：' + _me.findFieldByName('title').value() + '</div>';
			str += '</div>';
			str += '<div style="height:20px;">&nbsp;</div>';
			contentField.value(str + contentField.value() + "<div></div>");
			//设置主题
			var titleField = _me.findFieldByName('title');
			titleField.value("回复: " + titleField.value().replace('回复: ', ''));
			
			//添加原发信人到收信人
			var arr = JSON.parse(tousersField.value());
			if(touseridsField.value().indexOf(fromuseridField.value()) == -1) {
				arr.push({id:fromuseridField.value(),title:fromuserField.value()});
				tousersField.value(JSON.stringify(arr));
			}
			
			//从收信人删除自己
			for(var i=0;i < arr.length;i++) {
				if(arr[i].id == _me.com().getWebTopObj().getMyAttr('uid')) {
					arr.splice(i, 1);
					break;
				}
			}
			var str = '';
			for(var i=0;i < arr.length;i++) {
				if(i!=0) {
					str += ',';
				}
				str += arr[i].id;
			}
			touseridsField.value(str);
			tousersField.value(JSON.stringify(arr));
			
			fromuseridField.value(_me.com().getWebTopObj().getMyAttr('uid'));
			fromuserField.value(_me.com().getWebTopObj().getMyAttr('rn'));
			
			setTimeout(function() {
				_toUpdWin.getUICore().find('.BodyCon').animate({scrollTop:0},60);
			}, 300);
				
			_me.world().setLoading(false);
		}, 600);
	};
};
CSJSV3.AUI.CurrentSubmitForm.prototype = new CSJSV3.SuperHelper();

CSJSV3.AUI.CurrentListMgrView = function(cfg) {
	var _me = this;
	var _tab;
	var _submitForm;
	var _dataAgent;
	var _defSelectedTabIndex = 0;

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
				name : 'state',
				value : 'wdyj'
			}, {
				label : '主题',
				type : 'text',
				name : 'title',
				value : ''
			}, {
				label : '发信人',
				type : 'text',
				name : 'fromusername',
				value : ''
			}, {
				label : '收信人',
				type : 'text',
				name : 'tousername',
				value : ''
			}, {
				label : '抄送人',
				type : 'text',
				name : 'ccusername',
				value : ''
			} ];
		};
		/* 定义控制按钮 */
		this.base.createCtrlFields = function() {
			return [ {
				type : 'button',
				value : '写邮件',
				ppdKey: '',
				onClick : function(e) {
					_me.toNew();
				}
			}, {
				type : 'button',
				value : '删除',
				ppdKey: '',
				onClick : function(e) {
					_me.toDel();
				}
			}, {
				type : 'button',
				value : '彻底删除',
				ppdKey: 'sys_inmailmgr_destroy',
				onClick : function(e) {
					_me.toDestroy();
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
				title : '主题',
				style : 'text-align:left;width:300px;position:relative;',
				tpl_func : function(vals, index) {
					if(vals.hasreaduserids.indexOf(_me.com().getWebTopObj().getMyAttr('uid')) == -1) {
						return '<i class="RedPoint" style="width:10px;height:10px;border-radius:50%;background-color:red;display:block;position:absolute;top:10px;left:0px;"></i><a href="javascript:;" onclick="_listMgrView.toSeeById(\'' + vals.id + '\');$(this).parent().find(\'.RedPoint\').remove();$(this).css(\'margin-left\',0);" style="text-decoration:underline;margin-left:20px;">' + vals.title + '</a>';
					}
					return '<a href="javascript:;" onclick="_listMgrView.toSeeById(\'' + vals.id + '\');" style="text-decoration:underline;">' + vals.title + '</a>';
				}
			});
			cols.push({
				title : '行为',
				style : 'text-align:center;width:40px;',
				tpl_func : function(vals, index) {
					if(vals.touserids.indexOf(_me.com().getWebTopObj().getMyAttr('uid')) != -1) {
						return '发送';
					}
					else if(vals.ccuserids.indexOf(_me.com().getWebTopObj().getMyAttr('uid')) != -1) {
						return '抄送';
					}
					return '';
				}
			});
			cols.push({
				title : '发信人',
				style : 'text-align:center;width:80px;',
				tpl_func : function(vals, index) {
					return vals.fromuser;
				}
			});
			cols.push({
				title : '收信人',
				style : 'text-align:left;width:180px;',
				tpl_func : function(vals, index) {
					var str = '';
					if(vals.tousers != null && vals.tousers != '') {
						var arr = JSON.parse(vals.tousers);
						for(var i=0;i<arr.length;i++) {
							if(i!=0) {
								str += ',';
							}
							str += arr[i].title;
						}
					}
					return str;
				}
			});
			cols.push({
				title : '抄送人',
				style : 'text-align:left;width:180px;',
				tpl_func : function(vals, index) {
					var str = '';
					if(vals.ccusers != null && vals.ccusers != '') {
						var arr = JSON.parse(vals.ccusers);
						for(var i=0;i<arr.length;i++) {
							if(i!=0) {
								str += ',';
							}
							str += arr[i].title;
						}
					}
					return str;
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
		if(world.com().queryString('dsti') != '') {
			_defSelectedTabIndex = parseInt(world.com().queryString('dsti'));
		}
		
		_tab = new CSJSV3.UI.TabPanel({
			defSelectedTabIndex: _defSelectedTabIndex,
			items: [
                { title: '收件箱', body: '', bodyType: '', closeable: false },
                { title: '未读邮件', body: '', bodyType: '', closeable: false },
                { title: '草稿箱', body: '', bodyType: '', closeable: false },
                { title: '已发送', body: '', bodyType: '', closeable: false },
                { title: '已删除', body: '', bodyType: '', closeable: false },
                { title: '所有', body: '', bodyType: '', closeable: false }
            ],
            onChange: function(self) {
            	var field = _me.searchArea().findFieldByName('state');
            	var tab = self.selectedTab();
            	if(tab.title == '收件箱') {
            		field.value('sjx');
            	}
            	else if(tab.title == '未读邮件') {
            		field.value('wdyj');
            	}
            	else if(tab.title == '草稿箱') {
            		field.value('cgx');
            	}
            	else if(tab.title == '已发送') {
            		field.value('yfs');
            	}
            	else if(tab.title == '已删除') {
            		field.value('ysc');
            	}
            	else if(tab.title == '所有') {
            		field.value('sy');
            	}
            	else {
            		field.value('');
            	}
            	_me.loadData();
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
		
		if(_me.com().queryString('seeid') != '') {
        	_me.toSeeById(_me.com().queryString('seeid'));
		}
	};
	
	this.resize = function() {
		_me.base.resize();
		
	};

	this.toNew = function() {
		_submitForm.showForNew();
	};

	this.toSee = function() {
		var selected = _me.selectedItem();
		if (selected == null) {
			_me.world().showErrorMsg('请先选择一项');
		} else {
			_submitForm.showForSee(selected);
		}
	};

	this.toSeeById = function(id) {
		var selected = {id:id};
		if (selected == null) {
			_me.world().showErrorMsg('请先选择一项');
		} else {
			_submitForm.showForSee(selected);
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
			_me.world().confirm('确认彻底删除？', function(r) {
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
};
CSJSV3.AUI.CurrentListMgrView.prototype = new CSJSV3.SuperHelper();