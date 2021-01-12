CSJSV3.AUI.ChannelSelector = function(cfg) {
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
CSJSV3.AUI.ChannelSelector.prototype = new CSJSV3.SuperHelper();

CSJSV3.AUI.CurrentSubmitForm = function(cfg) {
	var _me = this;
	var _toUpdWin;
	var _dataAgent;
	
	var _historyArea;
	var _conChangesArea;
	var _pager;
	
	var _ylBtn;
	var _bcBtn;
	var _tjBtn;
	var _fbBtn;
	var _tgBtn;
	var _kfBtn;
	var _chBtn;
	
	var _selected;
	
	var _editHeight = 400;
	
	var _isReady = false;
	var _needLockCtg = false;

	{
		if(cfg.onReady == null) cfg.onReady = function() {};
		cfg.updTypeFieldName = 'updType';
		cfg.hiddenFields = [ 
			{ label : '', name : 'id', value : '', canEmpty : false, canEmptyFor : '' },
			{ label : '', name : 'cuserid', value : '', canEmpty : false, canEmptyFor : '' },
			{ label : '', name : 'cusername', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : '', name : 'uuserid', value : '', canEmpty : false, canEmptyFor : '' },
			{ label : '类目关联', name : 'ctgids', value : '', canEmpty : false, canEmptyFor : '' },
			{ label : '类目关联', name : 'ctgtitles', value : '', canEmpty : false, canEmptyFor : '' },
			{ label : '站点关联', name : 'siteids', value : '', canEmpty : false, canEmptyFor : '' },
			{ label : '站点关联', name : 'sitetitles', value : '', canEmpty : false, canEmptyFor : '' },
			{ label : '', name : 'flow', value : '', canEmpty : false, canEmptyFor : '' },
			{ label : '', name : 'updtime', value : '', canEmpty : false, canEmptyFor : '' },
			{ label : '', name : 'hasreadusers', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : '', name : 'shenpi1state', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : '', name : 'shenpi1users', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : '', name : 'shenpi1doneusers', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : '', name : 'shenpi2state', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : '', name : 'shenpi2users', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : '', name : 'shenpi2doneusers', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : '', name : 'shenpi3state', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : '', name : 'shenpi3users', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : '', name : 'shenpi3doneusers', value : '', canEmpty : true, canEmptyFor : '' },
			{ label : '', name : 'cuserbm', value : '', canEmpty : true, canEmptyFor : '' }
		];
		cfg.style = '';
		cfg.fieldLabelStyle = 'width:70px;';
		cfg.rows = [ 
		{
			fields : [ {
				label : '标题',
				type : 'text',
				name : 'title',
				value : '',
				canEmpty : false,
				canEmptyFor : '',
				style : 'width:354px;'
			}, {
				label : '作者',
				type : 'text',
				name : 'author',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : ''
			} ]
		},
		{
			fields : [ {
				label : '副标题',
				type : 'text',
				name : 'title1',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : 'width:300px;'
			}, {
				label : '发布时间',
				type : 'custom',
				name : 'crttime',
				value : '',
				canEmpty : false,
				canEmptyFor : '',
				style : '',
				body: new CSJSV3.UI.DateTimePicker({style:'margin-right:25px;'})
			} ]
		},
		{
			fields : [ {
					label : '类目',
					type : 'custom',
					name : 'ctgs',
					value : '',
					canEmpty : false,
					canEmptyFor : '',
					body: new CSJSV3.AUI.CtgSelector({
						style : 'width:125px;',
						needLoadCount: 1,
						onRenderNodeBefore: function (node) {
				            if (node.level == 0) {
				                node.state = 'expand';
				            }
				        },
						onReady: function() {
							_isReady = true;
							cfg.onReady();
						},
						onChange: function(self, tree) {
							var finditemsAction = function() {
								_me.world().log('遍历节点来寻找需要节点');
								var t = self.items();
								var ctgids = [];
								var ctgtitles = [];
								var siteids = [];
								var sitetitles = [];
								var tmpObj = {};
								for(var i=0;i<t.length;i++) {
									ctgids.push(t[i].id);
									ctgtitles.push(t[i].title);
									var site = tree.findParentItemById(t[i].id, function(node) {
										return node.level == 0;
									});
									if(site != null) {
										tmpObj[site.id] = site;
									}
								}
								for(var prop in tmpObj) {
									siteids.push(prop);
									sitetitles.push(tmpObj[prop].title);
								}
								_me.findFieldByName('ctgids').value(ctgids.toString());
								_me.findFieldByName('ctgtitles').value(ctgtitles.toString());
								_me.findFieldByName('siteids').value(siteids.toString());
								_me.findFieldByName('sitetitles').value(sitetitles.toString());
								
								if(self.items() != null && self.items().length > 0) {
									if(self.items()[0].id == '9a9b8792-fa53-4d4b-8c6c-7e4f8298c1f7' && _me.com().getWebTopObj().hasPpdKey('inf_infomgr_dtxx_zwxx')) {
										_me.findFieldByName('xingzhi').disabled(false);
									}
								}
								
								return siteids.length > 0;
							};
							
							var retryfindAction = function(curCount, maxCount, callback) {
								if(curCount == null) curCount = 0;
								setTimeout(function() {
									var r = finditemsAction();
									if(r == false) {
										curCount++;
										if(curCount >= maxCount) {
											callback(false);
										}
									}
									else {
										callback(true);
									}
								}, 600);
							};
							
							if(_isReady) {
								_me.world().setLoading(true);
								retryfindAction(0, 6, function(r) {
									_me.world().setLoading(false);
									if(!r) {
										_me.world().showErrorMsg('遍历节点匹配要素失败');
									}
								});
							}
						}
					})
				},
				{ 
					label: '性质', type: 'select', name: 'xingzhi', value: '', canEmpty : false, canEmptyFor : '', 
		                items: [
		                    { text: '行政工作', value: '0' },
		                    { text: '党团工作', value: '1' }
		                ], disabled: true
				},
				{ 
					label: '渠道', type: 'custom', name: 'channel', value: '', canEmpty : true, canEmptyFor : '', body: new CSJSV3.AUI.ChannelSelector({ dataAgent: cfg.dataAgent, inputStyle: 'width:125px' }) 
				}
			 ]
		},
		{
			fields : [ {
				label : '阅读人',
				type : 'custom',
				name : 'needreadusers',
				value : '',
				canEmpty : true,
				canEmptyFor : '',
				style : '',
				body: new CSJSV3.AUI.UsersSelector1Box({inputStyle:'width:557px;'})
			} ]
		},
		{
			fields : [ {
					label : '内容',
					type : 'custom',
					name : 'content',
					value : '',
					canEmpty : false,
					canEmptyFor : '',
					style : 'width:996px;height:300px;margin-right:25px;margin-top:8px;margin-bottom:8px;',
					body: new CSJSV3.UI.EditorA({})
				} ]
		},
		{
			fields : [ {
					label : '留言',
					type : 'custom',
					name : 'message',
					value : '',
					canEmpty : true,
					canEmptyFor : '',
					style : 'width:563px;height:215px;margin-right:25px;margin-top:8px;margin-bottom:8px;',
					body: new CSJSV3.UI.EditorA({})
				} ]
		}
		];

		cfg.onAppendBtnBefore = function(self, ctrlRow) {
		};
		cfg.onAppendBtnAfter = function(self, ctrlRow) {
			ctrlRow.find('.CancelBtn').val('返回');
			//预览按钮
			_ylBtn = $('<input type="button" class="BaoCunBtn CSJSV3UIBtn1" value="预览" style="margin-right:30px;" />');
			_ylBtn.click(function() {
				var pars = {};
				pars['title'] = _me.findFieldByName('title').value();
				pars['title1'] = _me.findFieldByName('title1').value();
				pars['content'] = _me.findFieldByName('content').value();
				pars['crttime'] = _me.findFieldByName('crttime').value();
				pars['cuserbm'] = _me.findFieldByName('cuserbm').value();
				pars['cusername'] = _me.findFieldByName('cusername').value();
				pars['author'] = _me.findFieldByName('author').value();
				pars['channel'] = _me.findFieldByName('channel').value();
				if(window.sessionStorage == null) {
					_me.world().showErrorMsg('你的浏览器不支持此功能');
				}
				else {
					window.sessionStorage.infoPreviewData = JSON.stringify(pars);
				}
				window.open('infocontent.htm?preview=1');
				//submitFormToNewWin('infocontent.htm', pars);
			});
            ctrlRow.find('.SubmitBtn').before(_ylBtn);
            
			//保存按钮
			_bcBtn = $('<input type="button" class="BaoCunBtn CSJSV3UIBtn1" value="保存" style="margin-right:30px;" />');
			_bcBtn.click(function() {
				if(_me.findFieldByName('updType').value() == 'new') {
					_me.findFieldByName('flow').value(101);
				}
            	self.submit();
			});
            ctrlRow.find('.SubmitBtn').before(_bcBtn);
            
            //提交按钮
            _tjBtn = ctrlRow.find('.SubmitBtn');
            
            //发布按钮
			_fbBtn = $('<input type="button" class="FaBuBtn CSJSV3UIBtn1" value="发布" style="margin-right:30px;" />');
			_fbBtn.click(function() {
				_me.findFieldByName('flow').value(1);
            	self.submit();
			});
            ctrlRow.find('.SubmitBtn').after(_fbBtn);
            if(!_me.com().getWebTopObj().hasPpdKey(getRightPpdKey('inf_infomgr_form_fb'))) {
            	_fbBtn.hide();
            }
            
			//通过按钮
			_tgBtn = $('<input type="button" class="TongGuoBtn CSJSV3UIBtn1" value="通过" style="margin-right:30px;" />');
			_tgBtn.click(function() {
				_me.findFieldByName('flow').value('tg');
            	self.submit();
			});
            ctrlRow.find('.SubmitBtn').before(_tgBtn);
            
			//可发按钮
			_kfBtn = $('<input type="button" class="KeFaBtn CSJSV3UIBtn1" value="可发" style="margin-right:30px;" />');
			_kfBtn.click(function() {
				_me.findFieldByName('flow').value('kf');
            	self.submit();
			});
            ctrlRow.find('.SubmitBtn').before(_kfBtn);
            
			//撤回按钮
			_chBtn = $('<input type="button" class="CheHuiBtn CSJSV3UIBtn1" value="退回" style="margin-right:30px;" />');
			_chBtn.click(function() {
				_me.findFieldByName('flow').value('ch');
            	self.submit();
			});
            ctrlRow.find('.SubmitBtn').before(_chBtn);
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
					if (cfg.onSubmitDone != null) {
						cfg.onSubmitDone();
					}
					_me.world().showInfoMsg('处理完毕', function() {
						var body = _me.com().getWebTopObj().findTabBodyById(_me.com().getWebTopObj().preSelectedTabId());
						body.find('iframe')[0].contentWindow.loadData();
						_me.com().getWebTopObj().closeTabById(window.csjsv3_ui_tabid);
					});
				}
			});
		};
		cfg.onCancel = function(self) {
			_me.com().getWebTopObj().closeTabById(window.csjsv3_ui_tabid);
			//_toUpdWin.hide();
		};
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.SubmitForm(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		_dataAgent = cfg.dataAgent;
		
		$(document.body).append(_me.getUICore());
		/*
		_toUpdWin = new CSJSV3.UI.Win({
			title : '',
			body : _me.getUICore(),
			closeBtnType : 'hide',
			width: 'auto',
			height: 'auto'
		});
		_toUpdWin.init(world);*/
		
		_historyArea = $('<fieldset class="HistoryChangeArea"><legend>历史记录</legend><div class="ListBody"></div><div class="PagerBar"></div></fieldset>');
		_conChangesArea = $('<fieldset class="ContentChangesArea"><legend>内容更改记录</legend><div class="ListBody"></div></fieldset>');
		_pager = new CSJSV3.UI.Pager({limit:8,mode:'simple1',onPage:function(page,limit){ if(_selected!=null){loadHistoryChangeData(_selected.id);} }});
		_pager.init(world);
	};
	
	this.render = function() {
		_me.base.render();
		_me.getUICore().css('position', 'relative');
		_me.getUICore().append(_historyArea);
		_me.getUICore().append(_conChangesArea);
		_historyArea.find('.PagerBar').append(_pager.getUICore());
		_pager.render();
		//_historyArea.find('.ListBody').niceScroll({ autohidemode: false, zindex: 11 });
		
		if(!_me.com().getWebTopObj().hasPpdKey(getRightPpdKey('inf_infomgr_qudao'))) {
			_me.findFieldByName('channel').readonly(true);
		}
	};
	
	this.resize = function() {
		_me.base.resize();
		
		_me.findFieldByName('content').item().getUICore().height(_editHeight);
		//_historyArea.find('.ListBody').height(minHeight + 321 - 173);
		_historyArea.css('top', _editHeight + 321 - 175 + 80);
		
		_conChangesArea.css('top', '0px');
		//_historyArea.find('.ListBody').getNiceScroll().resize();
	};
	
	this.needLockCtg = function(v) {
		_needLockCtg = v;
	};

	this.showForNew = function(lockCtg) {
		clearHistoryChange();
		_me.world().setLoading(true);
		
		_bcBtn.show();
		_tjBtn.show();
        if(_me.com().getWebTopObj().hasPpdKey(getRightPpdKey('inf_infomgr_form_fb'))) {
        	_fbBtn.show();
        }
		_tgBtn.hide();
		_kfBtn.hide();
		_chBtn.hide();
		
		_dataAgent.loadForm({
			updType : 'new'
		}, function(r) {
			_me.world().setLoading(false);
			if (r.success == false) {
				_me.world().showErrorMsg(r.msg);
			} else {
				_me.reset();
				if(lockCtg != null) {
					r.data.ctgids = lockCtg.id;
					r.data.ctgtitles = lockCtg.title;
					r.data.ctgs = JSON.stringify([lockCtg]);
					_me.findFieldByName('ctgs').readonly(true);
					// 解锁性质选择
					if(lockCtg.id == '9a9b8792-fa53-4d4b-8c6c-7e4f8298c1f7' && _me.com().getWebTopObj().hasPpdKey('inf_infomgr_dtxx_zwxx')) {
						_me.findFieldByName('xingzhi').disabled(false);
					}
				}
				if(_needLockCtg) {
					_me.findFieldByName('ctgs').readonly(true);
				}
				_me.data(r.data);
				
				
				//_toUpdWin.title('新增');
				//_toUpdWin.show();
				//setTimeout(function() {
				//	_toUpdWin.getUICore().find('.BodyCon').animate({scrollTop:0},60);
				//}, 300);
				/* 聚焦提交按钮 */
				//_toUpdWin.getUICore().find('.SubmitBtn').focus();
			}
		});
	};

	this.showForEdit = function(selected, lockCtg) {
		clearHistoryChange();
		_selected = selected;
		_me.world().setLoading(true);
		
		_bcBtn.show();
		_tjBtn.hide();
        if(_me.com().getWebTopObj().hasPpdKey(getRightPpdKey('inf_infomgr_form_fb'))) {
        	_fbBtn.show();
        }
		_tgBtn.hide();
		_kfBtn.hide();
		_chBtn.hide();
		
		_dataAgent.loadForm({
			updType : 'edit',
			id : selected.id
		}, function(r) {
			_me.world().setLoading(false);
			if (r.success == false) {
				_me.world().showErrorMsg(r.msg);
			} else {
				_me.reset();
				if(lockCtg != null) {
					r.data.ctgids = lockCtg.id;
					r.data.ctgtitles = lockCtg.title;
					r.data.ctgs = JSON.stringify([lockCtg]);
					_me.findFieldByName('ctgs').readonly(true);
					// 解锁性质选择
					if(lockCtg.id == '9a9b8792-fa53-4d4b-8c6c-7e4f8298c1f7' && _me.com().getWebTopObj().hasPpdKey(getRightPpdKey('inf_infomgr_dtxx'))) {
						_me.findFieldByName('xingzhi').disabled(false);
					}
				}
				if(_needLockCtg) {
					_me.findFieldByName('ctgs').readonly(true);
				}
				_me.data(r.data);
				//_toUpdWin.title('编辑');
				//_toUpdWin.show();
				//setTimeout(function() {
				//	_toUpdWin.getUICore().find('.BodyCon').animate({scrollTop:0},60);
				//}, 300);
				/* 聚焦提交按钮 */
				//_toUpdWin.getUICore().find('.SubmitBtn').focus();
				
				loadHistoryChangeData(selected.id);
				
				if(r.data.flow == '-1' || r.data.flow == '101') {
					_tjBtn.show();
				}
			}
		});
	};

	this.showForShenpi = function(selected) {
		clearHistoryChange();
		_selected = selected;
		_me.world().setLoading(true);
		
		_bcBtn.show();
		_tjBtn.hide();
    	_fbBtn.hide();
        if(_me.com().getWebTopObj().hasPpdKey(getRightPpdKey('inf_infomgr_shenpifb'))) {
        	_fbBtn.show();
        }
		_tgBtn.show();
		_kfBtn.show();
		_chBtn.show();
		
		_dataAgent.loadForm({
			updType : 'edit',
			id : selected.id
		}, function(r) {
			_me.world().setLoading(false);
			if (r.success == false) {
				_me.world().showErrorMsg(r.msg);
			} else {
				_me.reset();
				if(_needLockCtg) {
					_me.findFieldByName('ctgs').readonly(true);
				}
				_me.data(r.data);
				
				if(r.data.shenpi3users == '') {//只有3审才需要可发
					_kfBtn.hide();
				}
				if(r.data.shenpi1state != '0') {//只有一审的时候需要显示
					_kfBtn.hide();
				}
				if(r.data.shenpi1state == '0' && r.data.shenpi2users != '') {//1审的时候（不只1审）
					_tgBtn.val('复审');
				}
				if(r.data.shenpi1state == '1' && r.data.shenpi2state == '0' && r.data.shenpi3users != '') {//2审的时候（一共3审）
					_tgBtn.val('通过');
				}
				if(r.data.shenpi1state == '1' && r.data.shenpi2state == '1' && r.data.shenpi3state == '0' && r.data.shenpi3users != '') {//3审的时候（一共3审）
					_tgBtn.val('发布');
				}
				if(r.data.shenpi1state == '1' && r.data.shenpi2state == '0' && r.data.shenpi3users == '') {//2审的时候（一共2审）
					_tgBtn.val('发布');
				}
				if(r.data.shenpi1state == '0' && r.data.shenpi2users == '') {//1审的时候（一共1审）
					_tgBtn.val('发布');
				}
				
				loadHistoryChangeData(selected.id);
			}
		});
	};
	
	function clearHistoryChange() {
		var listBody = _historyArea.find('.ListBody');
		listBody.children().remove();
		
		_conChangesArea.find('.ListBody').children().remove();
	}
	
	function loadHistoryChangeData(infid) {
		var listBody = _historyArea.find('.ListBody');
		listBody.children().remove();
		_dataAgent.listHistoryChanges({ tgtid: infid, key: 'info', page: _pager.getPageIndex(), limit: _pager.getPageSize() }, function(r) {
			if(r.success == false) {
				_me.world().showErrorMsg(r.msg);
			}
			else {
				_pager.setTotalRowCount(r.total);
				for(var i=0;i<r.data.length;i++) {
					var item = $('<div class="ListItem"><div class="ListItemHead"><img src="' + _me.world().homeUrl() + '/img/user1.png" style="height:20px;vertical-align:middle;" />&ensp;<span style="vertical-align:middle;">' + r.data[i].username + '</span><span style="color:silver;vertical-align:middle;">（' + r.data[i].action + '）</span></div><div class="ListItemBody"></div><div class="ListItemFoot">（' + r.data[i].crttime + '）</div></div>');
					item.find('.ListItemBody').html(r.data[i].message);
					listBody.append(item);
				}
				
				listBody = _conChangesArea.find('.ListBody');
				listBody.children().remove();
				_dataAgent.listHistoryContentChanges({ tgtid: infid, key: 'info' }, function(r) {
					if(r.success == false) {
						_me.world().showErrorMsg(r.msg);
					}
					else {
						for(var i=0;i<r.data.length;i++) {
							var item = $('<div class="ListItem"><div class="ListItemHead"><img src="' + _me.world().homeUrl() + '/img/user1.png" style="height:20px;vertical-align:middle;" />&ensp;<span style="vertical-align:middle;">' + r.data[i].username + '</span><span style="color:silver;vertical-align:middle;">（' + r.data[i].action + '）</span></div><div class="ListItemBody"></div><div class="ListItemFoot"><a href="../sys/historychangecontent.htm?id=' + r.data[i].id + '" target="_blank">查看内容</a>（' + r.data[i].crttime + '）</div></div>');
							item.find('.ListItemBody').html(r.data[i].message);
							listBody.append(item);
						}
					}
				});
			}
		});
	}
	
    // post到新窗口
    function submitFormToNewWin(url, pars) {
        var temp = document.createElement("form");
        temp.action = url;
        temp.method = "post";
        temp.target = "_blank";
        $(temp).css('display', 'none');

        for (var prop in pars) {
            var field = $('<input type="hidden" name="' + prop + '" />');
            field.val(pars[prop]);
            $(temp).append(field);
        }
        
        $(document.body).append(temp);
        temp.submit();
        $(temp).remove();
    }
};
CSJSV3.AUI.CurrentSubmitForm.prototype = new CSJSV3.SuperHelper();
