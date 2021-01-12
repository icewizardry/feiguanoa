/*组织架构式用户选择器*/
CSJSV3.AUI.UsersSelector1DataAgent = function (cfg) {
    var _me = this;
    var _reqSvrUrl = '../../api/zzjg';
    var _reqSvrUrl_ctg = '../../api/sitectg';
    var _reqSvrUrl_user = '../../api/user';

    {
        /* 继承父级 */
        this.super0(this, new CSJSV3.UI.BaseObject(cfg));
    }

    this.init = function (world) {
        /* 继承父级 */
        _me.base.init(world);
    };

    this.listCtg = function (pars, callback) {
        _me.com().reqByCmd('listctgs1', pars, function (r) {
            if (callback != null) {
                callback(r);
            }
        }, _reqSvrUrl_ctg);
    };

    this.listUserForSelector = function (pars, callback) {
    	if(pars.page == null) { pars.page = 1; }
    	if(pars.limit == null) { pars.limit = 60; }
        _me.com().reqByCmd('listforselector', pars, function (r) {
            if (callback != null) {
                callback(r);
            }
        }, _reqSvrUrl_user);
    };

    this.listBMUsers = function (pars, callback) {
        _me.com().reqByCmd('loadbmusers', pars, function (r) {
            if (callback != null) {
                callback(r);
            }
        }, _reqSvrUrl);
    };

    this.getBMUserTreeLinearData = function (pars, callback) {
        _me.com().reqByCmd('getbmusertreelineardata', pars, function (r) {
            if (callback != null) {
                callback(r);
            }
        }, _reqSvrUrl_user);
    };
};
CSJSV3.AUI.UsersSelector1DataAgent.prototype = new CSJSV3.SuperHelper();

CSJSV3.AUI.UsersSelector1 = function (cfg) {
    var _me = this;
    var _uiCore;
    var _dataAgent;

    {
    	if(cfg.treeHide==null) {
    		cfg.treeHide = 0;
    	}
        cfg.root = {
            id: '',
            pid: '',
            title: '所有人',
            leaf: true
        };
        cfg.data = [];
        cfg.onRenderNodeBefore = function (node) {
	    	if(cfg.onlyMyTeams == true) {
	            if (node.level < 2) {
	                node.state = 'expand';
	            }
	    	}
        };
        if(cfg.showCheckbox == null) cfg.showCheckbox = true;
        /*
        cfg.onLoadChild = function (node, nodeUI, callback) {
            if (node.id == '') {
            }
            else {
                var items = [];
                //加载成员
                _dataAgent.listBMUsers({ bmid: node.id }, function (r) {
                    _me.world().setLoading(false);
                    if (r.success == false) {
                        _me.world().showErrorMsg(r.msg);
                        callback(node, nodeUI, null);
                    }
                    else {
                        for (var i = 0; i < r.data.length; i++) {
                            items.push({ id: r.data[i].id, title: r.data[i].realname, pid: node.id, duty: r.data[i].duty, type: 'user' });
                        }
                        
		            	var hide = 0;
		            	if(cfg.treeHide != 0) {
		            		hide = -1;
		            	}
		            	//加载子类
		                _dataAgent.listCtg({ pid: node.id, ptype: 'bm', hide: hide }, function (r) {
		                    _me.world().setLoading(false);
		                    if (r.success == false) {
		                        _me.world().showErrorMsg(r.msg);
		                        callback(node, nodeUI, null);
		                    }
		                    else {
		                        for (var i = 0; i < r.data.length; i++) {
		                            r.data[i].pid = '';
		                            r.data[i].leaf = false;
		                            r.data[i].type = 'bm';
		                            items.push(r.data[i]);
		                        }
		                        callback(node, nodeUI, items);
		                    }
		                });
                    }
                });
            }
        };*/
        _uiCore = $('<div class="CSJSV3AUISiteCtgMgr"></div>');
        cfg.uiCore = _uiCore;
        /* 继承父级 */
        this.super0(this, new CSJSV3.UI.Tree(cfg));
    }

    this.init = function (world) {
        /* 继承父级 */
        _me.base.init(world);
        _dataAgent = new CSJSV3.AUI.UsersSelector1DataAgent({});
        _dataAgent.init(world);
    };
    
    this.resize = function () {
    };

    this.render = function () {
        _me.base.render();
    };
    
    this.loadData = function(callback) {
    	var pars = {};
    	if(cfg.onlyMyTeams == true) {
    		pars.onlymyteams = '1';
    	}
    	_dataAgent.getBMUserTreeLinearData(pars, function(r) {
    		_me.world().setLoading(false);
            if (r.success == false) {
                _me.world().showErrorMsg(r.msg);
            }
            else {
            	_me.data(r.data);
            	_me.render();
            	if(callback != null) callback();
            }
    	});
    };
};
CSJSV3.AUI.UsersSelector1.prototype = new CSJSV3.SuperHelper();

/*showCheckbox:true  onSelectDone(self, selected)  onCheckDone(self, checkeds)*/
CSJSV3.AUI.UsersSelector1Box = function(cfg) {
    var _me = this;
    var _uiCore;
    var _tbx;
    var _hidden;
    var _userSelector1;
    var _userSelectorWin;
    var _hasLoadData = false;

    {
    	if(cfg.style==null)cfg.style=''; 
    	if(cfg.inputStyle==null)cfg.inputStyle='';
    	if(cfg.showCheckbox==null)cfg.showCheckbox=true;
    	if(cfg.valueType==null)cfg.valueType='obj';//obj id
        _uiCore = $('<div class="CSJSV3UIUsersSelector1Box" style="' + cfg.style + '"><input type="text" autocomplete="off" style="width:600px;' + cfg.inputStyle + '" /><input type="hidden" /></div>');
        _tbx = _uiCore.find('input').first();
        if(cfg.nameOfText != null) { _tbx.attr('name', cfg.nameOfText); };
        _hidden = _uiCore.find('input[type=hidden]');
        if (cfg.name != null) _hidden.attr('name', cfg.name);
        if(cfg.readonly) _tbx.attr('readonly', cfg.readonly);
        cfg.uiCore = _uiCore;
        /*继承父级*/
        this.super0(this, new CSJSV3.UI.BaseObject(cfg));
    }

    this.init = function (world) {
        /*继承父级*/
        _me.base.init(world);
        if(cfg.showCheckbox == false) {
        	buildUserSelector(world);
        }
        else {
        	buildUsersSelector(world);
        }
    };

    this.render = function () {
        _me.base.render();
    };
    
    this.name = function (v) {
        if (v != null) {
            cfg.name = v;
            _hidden.attr('name', v);
        }
        else {
            return _hidden.attr('name');
        }
    };

    this.nameOfText = function (v) {
        if (v != null) {
            cfg.nameOfText = v;
            _tbx.attr('name', v);
        }
        else {
            return _tbx.attr('name');
        }
    };

    this.value = function (v) {
        if (v != null) {
        	if(v instanceof Array) {
        		_setItems(v);
        	}
        	else {
	            _hidden.val(v);
	            _hiddenToInput();
        	}
        }
        else {
            return _hidden.val();
        }
    };

    this.text = function (v) {
        if (v != null) {
            _tbx.val(v);
        }
        else {
            return _tbx.val();
        }
    };

    this.val = function (v) {
        return _me.value(v);
    };

    this.reset = function () {
       _me.value('');
    };

    this.readonly = function (v) {
        if (v != null) {
            cfg.readonly = v;
            _tbx.attr('readonly', v);
        }
        else {
            return cfg.readonly;
        }
    };

    this.disabled = function (v) {
        if (v != null) {
            cfg.disabled = v;
            _tbx.attr('disabled', v);
        }
        else {
            return cfg.disabled;
        }
    };

    this.showInputErrorTip = function () {
        _tbx.addClass('InputErrorTip');
    };

    this.hideInputErrorTip = function () {
        _tbx.removeClass('InputErrorTip');
    };

    function _hiddenToInput() {
        if (_hidden.val() == '') {
        	_tbx.val('');
        }
        else {
	    	if(cfg.valueType == 'obj') {
	        	var items = JSON.parse(_hidden.val());
	        	var str = '';
	        	for(var i=0;i<items.length;i++) {
	        		if(i!=0) {
	        			str += ',';
	        		}
	        		str += items[i].title;
	        	}
	        	_tbx.val(str);
	    	}
        }
    }

    function _inputToHidden() {
        
    }
    
    function _setItems(items) {
    	if(cfg.valueType=='obj') {
    		_hidden.val(JSON.stringify(items));
    	}
    	else if(cfg.valueType=='id') {
    		var ids = [];
    		var txts = [];
        	for(var i=0;i<items.length;i++) {
        		ids.push(items[i].id);
        		txts.push(items[i].title);
        	}
    		_hidden.val(ids.toString());
        	_tbx.val(txts.toString());
    	}
    	_hiddenToInput();
    }
    
    function _onSelectDone() {
    	var node = _userSelector1.selectedItem();
		var t = {id:node.id,title:node.title};
		_setItems([t]);
		_userSelectorWin.hide();
		
		if(cfg.onSelectDone != null) {
			cfg.onSelectDone(_me, node);
		}
    }
    
    function _onCheckDone() {
    	var arr = [];
    	var hasArrExist = function(item) { for(var i=0;i<arr.length;i++) {if(arr[i].id==item.id)return true;} return false; };
    	var items = _userSelector1.checkedItems();
    	for(var i=0;i<items.length;i++) {
    		if(items[i].type == 'user') {
	    		var item = {id:items[i].id,title:items[i].title};
	    		if(!hasArrExist(item)) {
	    			arr.push(item);
	    		}
    		}
    	}
    	_setItems(arr);
    	_userSelectorWin.hide();
    	
    	if(cfg.onCheckDone != null) {
    		cfg.onCheckDone(_me, items);
    	}
    }
    // 构建单选选择器
    function buildUserSelector(world) {
    	_userSelector1 = new CSJSV3.AUI.UsersSelector1({
    		showCheckbox: false,
    		onlyMyTeams: cfg.onlyMyTeams,
    		canSelectProc: function(self, node) {
    			if(node.type == 'user') {
    				return true;
    			}
    			return false;
    		},
    		onSelected: function (self, node) {
    			_onSelectDone();
        	},
    		onNodeClick: function (self, node) {
    			if(node.type == 'bm') {
    				self.expandOrFoldNode(node);
    			}
        	}
    	});
    	_userSelector1.init(world);
    	_userSelector1.render();
    	
    	_userSelectorWin = new CSJSV3.UI.Win({title:'请选择', body:_userSelector1.getUICore(), width: 324, height: 'auto', closeBtnType: 'hide'});
    	_userSelectorWin.init(world);
    	_userSelectorWin.render();
    	
    	_tbx.focus(function() {
    		if(!_hasLoadData) {
    			_hasLoadData = true;
        		_userSelector1.loadData();
    		}
    		if(cfg.readonly != true) {
    			_userSelectorWin.show();
    		}
    	});
    }
    // 构建多选选择器
    function buildUsersSelector(world) {
    	_userSelector1 = new CSJSV3.AUI.UsersSelector1({
    		showCheckbox: true,
    		onNodeClick: function (self, node) {
    			if(node.type == 'bm') {
    				self.expandOrFoldSelectedNode();
    			}
        	}
    	});
    	_userSelector1.init(world);
    	_userSelector1.render();
    	
    	_userSelectorWin = new CSJSV3.UI.Win({title:'请选择', body:_userSelector1.getUICore(), width: 324, height: 'auto', offsetAutoHeight: -50, closeBtnType: 'hide'});
    	_userSelectorWin.init(world);
    	_userSelectorWin.render();
    	
    	var btnBar = $('<div style="text-align:center;"><div style="height:6px;">&nbsp;</div><input type="button" value="确认选择" style="width:150px;background-color:#B67759;" />&emsp;<input type="button" value="清空" style="width:60px;" /><div style="height:12px;">&nbsp;</div></div>');
    	var btn = btnBar.find('input[type=button]').eq(0);
    	btn.click(function() { _onCheckDone(); });
    	var btn1 = btnBar.find('input[type=button]').eq(1);
    	btn1.click(function() { _userSelector1.clearCheckedItems(); });
    	_userSelectorWin.getUICore().find('.BodyCon').after(btnBar);
    	
    	_tbx.focus(function() {
    		var func1 = function() {
	    		/*清除默认选中项*/
	    		_userSelector1.clearCheckedItems();
	    		/*设置默认选中项*/
	    		_userSelector1.checkItems(function(node) {
	    			if(_hidden.val() == '' || _hidden.val() == '[]') {
	    				return false;
	    			}
	    			if(node.type == 'user') {
	    				return _hidden.val().indexOf(node.id) != -1;
	    			}
	    		});
	    		if(cfg.readonly != true) {
	    			_userSelectorWin.show();
	    		}
    		};
    		
    		if(!_hasLoadData) {
    			_hasLoadData = true;
    			_userSelector1.loadData(function() {
    				func1();
    			});
    		}
    		else {
    			func1();
    		}
    	});
    }
};
CSJSV3.AUI.UsersSelector1Box.prototype = new CSJSV3.SuperHelper();