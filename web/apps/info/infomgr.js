CSJSV3.UI.ChannelSelector = function(cfg) {
	var _me = this;
	var _da;
	
	{
		cfg.showCheckbox = true;
		_da = cfg.dataAgent;
		//cfg.items = [{ text: '中国上海', value: '中国上海' }, { text: '绿色上海', value: '绿色上海' }, { text: '政务内网', value: '政务内网' }, { text: '其它', value: '其它' }];
		this.super0(this, new CSJSV3.UI.ComboBox(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
	};
	
	this.render = function() {
		_da.getAllChannels({}, function(r) {
			var arr = [];
			for(var i=0;i<r.data.length;i++) {
				arr.push({text:r.data[i],value:r.data[i]});
			}
			cfg.items = arr;
			_me.base.render();
		});
	};
};
CSJSV3.UI.ChannelSelector.prototype = new CSJSV3.SuperHelper();


CSJSV3.AUI.CurrentListMgrView = function(cfg) {
	var _me = this;
	var _dataAgent;
	var _siteCtgMgr;
	var _leftArea;
	var _mainArea;
	var _lockCtg;
	var _needLockCtg = false;
	var _isShenPiMode = csjsv3com.queryString('shenpi') == '1';

	{
		_dataAgent = new CSJSV3.AUI.DataAgent({});
		cfg.loadData = function(pars, callback) {
			_me.world().setLoading(true);
			if(_me.com().queryString('ctgid') != '') {
				pars.ctgid = _me.com().queryString('ctgid');
			}
			pars.ppdkeylaststr = getRightPpdKey('');
			pars.needReadLimit = _me.com().queryString('needreadlimit');
			if(_isShenPiMode) {
				pars.shenpi = '1';
			}
			if(_siteCtgMgr.selectedItem() != null) {
				var node = _siteCtgMgr.selectedItem();
				//根据层级判定是站点还是类目
				if(node.level == 0) {
					pars.siteid = node.id;
				}
				else {
					pars.ctgid = node.id;
				}
			}
			if(pars.xingzhi != null && pars.xingzhi != '') {
				pars.morewherestr = _me.com().base64().encode('inf.xingzhi = ' + pars.xingzhi + ' ');
			}
			_dataAgent.list(pars, function(r) {
				_me.world().setLoading(false);
				callback(r);
			});
		};
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.ListMgrView(cfg));
		/* 定义查询字段 */
		this.base.createSearchFields = function() {
			var arr = [];
			arr.push({
					label : '',
					type : 'hidden',
					name : 'moreSelectStr',
					value : 'xingzhi'
				}, {
					label : '',
					type : 'hidden',
					name : 'noreaduserid',
					value : ''
				}, {
					label : '',
					type : 'hidden',
					name : 'noSelfLimit',
					value : ''
				}, {
					label : '',
					type : 'hidden',
					name : 'noBMLimit',
					value : ''
				}, {
					label : '',
					type : 'hidden',
					name : 'noCtgLimit',
					value : ''
				}, {
					label : '标题',
					type : 'text',
					name : 'title',
					value : ''
				}
			);
			if(_me.com().queryString('mode') != 'see') {
				arr.push({
					disabled: _isShenPiMode,
					label: '状态', type:'select', name: 'flow', value: '', items: [{ text: '未发布', value: 'wwj' }, { text: '编辑中', value: '101' }, { text: '待我审', value: 'dws' }, { text: '审核中', value: '0' }, { text: '已发布', value: '1' }, { text: '已撤回', value: '-1' }, { text: '已删除', value: '102' }, { text: '全部', value: '' }], autoLoadOnChange: true
				});
			}
			else {
				arr.push({
					label : '',
					type : 'hidden',
					name : 'flow',
					value : '1'
				});
			}
			arr.push(
				{ label: '科室', type: 'custom', name: 'bmid', body: new CSJSV3.AUI.TeamSelectorA1({}), autoLoadOnChange: true },
				{ label: '性质', type: 'select', name: 'xingzhi', items: [{ text: '所有', value: '' }, { text: '行政工作', value: '0' }, { text: '党团工作', value: '1' }], onChange: function(self) { _me.loadData(); } },
				{ label: '发布时间', type: 'datepicker', name: 'start', value: '' }, { label: '', type: 'datepicker', name: 'end', value: '', getFieldLabel: function () { return '<div class="FieldLabel" style="float:left;margin-left:8px;margin-right:8px;"><span>到</span></div>'; } }
            );
			return arr;
			//{ label: null, type: 'custom', name: 'yearmonth', style: 'margin-left:30px;',  body: new CSJSV3.UI.YearMonthPicker({defAuto:false}) } 
		};
		
		
		/* 定义控制按钮 */
		this.base.createCtrlFields = function() {
			return [ {
				type : 'button',
				value : '新增',
				ppdKey: getRightPpdKey('inf_infomgr_new'),
				hide: _isShenPiMode,
				onClick : function(e) {
					_me.toNew();
				}
			}, {
				type : 'button',
				value : '编辑',
				ppdKey: getRightPpdKey('inf_infomgr_edit'),
				hide: _isShenPiMode,
				onClick : function(e) {
					_me.toEdit();
				}
			}, {
				type : 'button',
				value : '删除',
				ppdKey: getRightPpdKey('inf_infomgr_del'),
				hide: _isShenPiMode,
				onClick : function(e) {
					_me.toDel();
				}
			}, {
				type : 'button',
				value : '彻底删除',
				ppdKey: getRightPpdKey('inf_infomgr_destroy'),
				hide: _isShenPiMode,
				onClick : function(e) {
					_me.toDestroy();
				}
			}, {
				type : 'button',
				value : '审核',
				ppdKey: getRightPpdKey('inf_infomgr_shenpi'),
				onClick : function(e) {
					_me.toShenpi();
				}
			}, {
				type : 'button',
				value : '设置渠道',
				ppdKey: getRightPpdKey('inf_infomgr_qudao'),
				hide: _isShenPiMode,
				onClick : function(e) {
					_me.toSetQuDao();
				}
			}, {
				type : 'button',
				value : '预览',
				ppdKey: '',
				onClick : function(e) {
					_me.preview();
				}
			}, {
				type : 'button',
				value : '下载图片',
				ppdKey: '',
				onClick : function(e) {
					_me.downloadInfConImgs();
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
				title : '标题',
				style : 'text-align:left;width:300px;',
				tpl_func : function(vals, index) {
					if(_me.com().queryString('mode') == 'see' || _isShenPiMode) {
						return '<a href="infocontent.htm?infid=' + vals.id + '" target="_blank">' + vals.title + '</a>';
					}
					else {
						return '<a href="javascript:;" onclick="toedit(\'' + vals.id + '\')">' + vals.title + '</a>';
					}
				}
			});
			cols.push({
				title : '特性',
				style : 'text-align:center;width:50px;',
				tpl_func : function(vals, index) {
					var str = '';
					if(vals.hasimg == 1) {
						str += '<img src="' + _me.world().homeUrl() + '/img/img.png" style="height:20px;vertical-align:middle;" />&ensp;';
					}
					if(vals.hasattachment == 1) {
						str += '<img src="' + _me.world().homeUrl() + '/img/attachment_red.png" style="height:20px;vertical-align:middle;" />&ensp;';
					}
					return str;
				}
			});
			cols.push({
				title : '发布人',
				style : 'text-align:center;width:60px;',
				tpl_func : function(vals, index) {
					return vals.cusername;
				}
			});
			if(_me.com().queryString('mode') != 'see') {
				cols.push({
					title : '状态',
					style : 'text-align:center;width:80px;',
					onClick: function(self) {
						if(self.showShenpiState == null) {
							self.showShenpiState = false;
						}
						
						if(self.showShenpiState == false) self.showShenpiState = true;
						else { self.showShenpiState=false; }
						
						self.getUICore().find('.ListCell').each(function(i, n) {
							if($(n).attr('cell-index') == '4' || $(n).attr('cell-index') == '5' || $(n).attr('cell-index') == '6') {
								if(self.showShenpiState == true) {
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
						if(vals.flow == '0') {
							return "审核中";
						}
						else if(vals.flow == '1') {
							return "已发布";
						}
						else if(vals.flow == '-1') {
							return "已撤回";
						}
						else if(vals.flow == '101') {
							return "编辑中";
						}
						else if(vals.flow == '102') {
							return "已删除";
						}
						return vals.flow;
					}
				});
				cols.push({
					title : '一审',
					hide: true,
					style : 'text-align:center;width:100px;',
					tpl_func : function(vals, index) {
						if(vals.shenpi1state == 1) {
							var shenpi1doneusers = JSON.parse(vals.shenpi1doneusers);
							var arr = [];
							for(var i=0;i<shenpi1doneusers.length;i++) {
								arr.push(shenpi1doneusers[i].title);
							}
							return '<span style="color:green;">' + arr.toString() + '已批准</span>';
						}
						else if(vals.shenpi1state == -1) {
							var shenpi1doneusers = JSON.parse(vals.shenpi1doneusers);
							var arr = [];
							for(var i=0;i<shenpi1doneusers.length;i++) {
								arr.push(shenpi1doneusers[i].title);
							}
							return '<span style="color:red;">' + arr.toString() + '已撤回</span>';
						}
						else {
							if(vals.shenpi1users != '') {
								var shenpi1users = JSON.parse(vals.shenpi1users);
								var shenpi1usernames = [];
								for(var i=0;i<shenpi1users.length;i++) {
									shenpi1usernames.push(shenpi1users[i].title);
								}
								return shenpi1usernames.toString();
							}
						}
						return '';
					}
				});
				cols.push({
					title : '二审',
					hide: true,
					style : 'text-align:center;width:100px;',
					tpl_func : function(vals, index) {
						if(vals.shenpi2state == 1) {
							var shenpi2doneusers = JSON.parse(vals.shenpi2doneusers);
							var arr = [];
							for(var i=0;i<shenpi2doneusers.length;i++) {
								arr.push(shenpi2doneusers[i].title);
							}
							return '<span style="color:green;">' + arr.toString() + '已批准</span>';
						}
						else if(vals.shenpi2state == -1) {
							var shenpi2doneusers = JSON.parse(vals.shenpi2doneusers);
							var arr = [];
							for(var i=0;i<shenpi2doneusers.length;i++) {
								arr.push(shenpi2doneusers[i].title);
							}
							return '<span style="color:red;">' + arr.toString() + '已撤回</span>';
						}
						else {
							if(vals.shenpi2users != '') {
								var shenpi2users = JSON.parse(vals.shenpi2users);
								var shenpi2usernames = [];
								for(var i=0;i<shenpi2users.length;i++) {
									shenpi2usernames.push(shenpi2users[i].title);
								}
								if(vals.shenpi1state != 1) {
									return '<span style="color:silver;">' + shenpi2usernames.toString() + '</span>';
								}
								else {
									return shenpi2usernames.toString();
								}
							}
						}
						return '';
					}
				});
				cols.push({
					title : '三审',
					hide: true,
					style : 'text-align:center;width:100px;',
					tpl_func : function(vals, index) {
						if(vals.shenpi3state == 1) {
							var shenpi3doneusers = JSON.parse(vals.shenpi3doneusers);
							var arr = [];
							for(var i=0;i<shenpi3doneusers.length;i++) {
								arr.push(shenpi3doneusers[i].title);
							}
							return '<span style="color:green;">' + arr.toString() + '已批准</span>';
						}
						else if(vals.shenpi3state == -1) {
							var shenpi3doneusers = JSON.parse(vals.shenpi3doneusers);
							var arr = [];
							for(var i=0;i<shenpi3doneusers.length;i++) {
								arr.push(shenpi3doneusers[i].title);
							}
							return '<span style="color:red;">' + arr.toString() + '已撤回</span>';
						}
						else {
							if(vals.shenpi3users != '') {
								var shenpi3users = JSON.parse(vals.shenpi3users);
								var shenpi3usernames = [];
								for(var i=0;i<shenpi3users.length;i++) {
									shenpi3usernames.push(shenpi3users[i].title);
								}
								if(vals.shenpi2state != 1) {
									return '<span style="color:silver;">' + shenpi3usernames.toString() + '</span>';
								}
								else {
									return shenpi3usernames.toString();
								}
							}
						}
						return '';
					}
				});
			}
			cols.push({
				title : '性质',
				style : 'text-align:center;width:120px;',
				tpl_func : function(vals, index) {
					if(vals.xingzhi == 1) {
						return '党团工作';
					}
					return '行政工作';
				}
			});
			/*
			cols.push({
				title : '站点',
				style : 'text-align:center;width:120px;',
				tpl_func : function(vals, index) {
					return vals.sitetitles;
				}
			});*/
			cols.push({
				title : '更新时间',
				style : 'text-align:center;width:145px;',
				tpl_func : function(vals, index) {
					return vals.updtime;
				}
			});
			cols.push({
				title : '发布时间',
				style : 'text-align:center;width:145px;',
				tpl_func : function(vals, index) {
					return vals.crttime;
				}
			});
			return cols;
		};

		this.base.procPagerCfg = function(cfg1) {
			return cfg1;
		};
		
		this.base.appendParts = function(searchArea, ctrlArea, dataGrid, pager) {

    		_siteCtgMgr = new CSJSV3.AUI.SiteCtgMgr({
    			root: {
					id : '',
					pid : '',
					title : '根',
					leaf : false,
					hide: true
				},
				onRenderNodeBefore: function (node) {
		            if (node.level == 0) {
		                node.state = 'expand';
		            }
		        },
    			onSelected:function(self, node) {
    				_me.loadData();
    			}
    		});
    		_siteCtgMgr.init(_me.world());
    		_siteCtgMgr.render();
    		_siteCtgMgr.loadData();
            
			var uiCore = _me.getUICore();
			var leftArea = $('<fieldset style="float:left;width:200px;margin-right:0px;"><legend>类目</legend></fieldset>');
			var mainArea = $('<div style="float:left;"></div>');
			uiCore.append(leftArea);
			uiCore.append(mainArea);
			uiCore.append('<div style="clear:both;"></div>');

			leftArea.append(_siteCtgMgr.getUICore());
			
			mainArea.append(searchArea.getUICore());
			mainArea.append(ctrlArea);
			mainArea.append(dataGrid.getUICore());
			mainArea.append(pager.getUICore());
			
			_leftArea = leftArea;
			_mainArea = mainArea;
	    };
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		_dataAgent.init(world);
	};

	this.render = function() {
		_me.base.render();
		_me.resize();
		
		var noleft = false;
		
		if(_me.com().queryString('noleft') == '1') {
			noleft = true;
		}
		
		if(_isShenPiMode) {
			_me.searchArea().findFieldByName('flow').value('dws');
			noleft = true;
			_needLockCtg = true;
		}
		
		if(_me.com().queryString('mode') == 'see') {
			_leftArea.hide();
			_me.ctrlArea().hide();
		}
		
		if(_me.com().queryString('noread') == '1') {
			_me.searchArea().findFieldByName('noreaduserid').value(_me.com().getWebTopObj().getMyAttr('uid'));
		}
		
		if(noleft == '1') {
			_leftArea.hide();
		}
		
		if(_me.com().queryString('ctgid') != '') {
			//已经在loaddata中写了，传入ctgid必定用这个去查询
		}
		if(_me.com().queryString('ctgid') != '' && _me.com().queryString('ctgtitle') != '') {
			_lockCtg = {id:_me.com().queryString('ctgid'),title:decodeURI(_me.com().queryString('ctgtitle'))};
		}
		
		if(_me.com().queryString('nolimit') == '1') {
			_me.searchArea().findFieldByName('noSelfLimit').value('1');
			_me.searchArea().findFieldByName('noBMLimit').value('1');
			_me.searchArea().findFieldByName('noCtgLimit').value('1');
		}
	};
	
	this.resize = function() {
		_me.base.resize();
		_leftArea.height($(window).height() - 36);
		var leftAreaWidth = _leftArea.outerWidth(true);
		if(_leftArea.css('display') == 'none') {
			leftAreaWidth = 0;
		}
		_mainArea.width($(window).width() - leftAreaWidth - 3);
	};

	this.toNew = function() {
		var t = '';
		if(_lockCtg != null && _lockCtg != '') {
			t = JSON.stringify(_lockCtg)
		}
		_me.com().getWebTopObj().addTab({ title: '新增信息', body: '../apps/info/infomgr_form.htm?lockctg=' + encodeURI(t) });
	};

	this.toEdit = function() {
		var selected = _me.selectedItem();
		if (selected == null) {
			_me.world().showErrorMsg('请先选择一项');
		} else {
			var t = '';
			if(_lockCtg != null && _lockCtg != '') {
				t = JSON.stringify(_lockCtg)
			}
			_me.com().getWebTopObj().addTab({ title: '编辑信息', body: '../apps/info/infomgr_form.htm?id=' + selected.id + '&lockctg=' + encodeURI(t) });
		}
	};

	this.toEdit1 = function(id) {
		var t = '';
		if(_lockCtg != null && _lockCtg != '') {
			t = JSON.stringify(_lockCtg)
		}
		_me.com().getWebTopObj().addTab({ title: '编辑信息', body: '../apps/info/infomgr_form.htm?id=' + id + '&lockctg=' + encodeURI(t) });
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
			var t = '';
			if(_lockCtg != null && _lockCtg != '') {
				t = JSON.stringify(_lockCtg)
			}
			_me.com().getWebTopObj().addTab({ title: '审批信息', body: '../apps/info/infomgr_form.htm?id=' + selected.id + '&adt=1&needlockctg=1' + '&lockctg=' + encodeURI(t) });
		}
	};
	
	this.toSetQuDao = function() {
		var selected = _me.selectedItem();
		if (selected == null) {
			_me.world().showErrorMsg('请先选择一项');
		} else {
			var win;
			
			var cfg = {};
	        cfg.updTypeFieldName = 'updType';
	        cfg.hiddenFields = [
	            { label: '', name: 'id', value: '', canEmpty: false, canEmptyFor: 'new' }
	        ];
	        cfg.fieldLabelStyle = 'width:70px;';
	        cfg.rows = [
            {
                fields: [
                    { 
						label: '渠道', type: 'custom', name: 'channel', value: '', canEmpty : true, canEmptyFor : '', body: new CSJSV3.UI.ChannelSelector({ dataAgent: _dataAgent, inputStyle: 'width:300px;' }) 
					}
                ]
            }];
            cfg.onSubmit = function (self) {
	            _me.world().setLoading(true);
	            _dataAgent.setFieldChannel(self.data(), function (r) {
	                _me.world().setLoading(false);
	                if (r.success == false) {
	                    _me.world().showErrorMsg(r.msg);
	                }
	                else {
	                    win.close();
	                }
	            });
	        };
	        cfg.onCancel = function (self) {
	            win.hide();
	        };
			var form = new CSJSV3.UI.SubmitForm(cfg);
			form.init(_me.world());
			form.render();
			
			win = new CSJSV3.UI.Win({ title: '修改渠道', body: form.getUICore(), width: 500, height: 200, scroll: false });
			win.init(_me.world());
			win.render();
			
			_me.world().setLoading(true);
			_dataAgent.loadForm({
				updType : 'edit',
				id : selected.id
			}, function(r) {
				_me.world().setLoading(false);
				if (r.success == false) {
					_me.world().showErrorMsg(r.msg);
				} else {
					form.reset();
					form.data(r.data);
			
					form.findFieldByName('id').value(selected.id);
					form.findFieldByName('updType').value('edit');
					
					win.show();
				}
			});
		}
	};
	
	this.preview = function() {
		var selected = _me.selectedItem();
		if (selected == null) {
			_me.world().showErrorMsg('请先选择一项');
		} else {
			window.open('infocontent.htm?infid=' + selected.id);
		}
	};
	
	this.downloadInfConImgs = function() {
		var selected = _me.selectedItem();
		if (selected == null) {
			_me.world().showErrorMsg('请先选择一项');
		} else {
			_me.world().setLoading('压缩中');
			_me.com().reqByCmd('compressinfconimgs', { id:selected.id }, function(r) {
				_me.world().setLoading(false);
				if(r.success == false) {
					_me.world().showErrorMsg(r.msg);
				}
				else {
					window.open('../..' + r.data);
				}
			}, '../../api/info');
		}
	};
};
CSJSV3.AUI.CurrentListMgrView.prototype = new CSJSV3.SuperHelper();