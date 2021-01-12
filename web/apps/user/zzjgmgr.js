CSJSV3.AUI.DataAgent = function (cfg) {
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

    this.saveCtgForm = function (pars, callback) {
        _me.com().reqByCmd('savectgform', pars, function (r) {
            if (callback != null) {
                callback(r);
            }
        }, _reqSvrUrl_ctg);
    };

    this.loadCtgForm = function (pars, callback) {
        _me.com().reqByCmd('loadctgform', pars, function (r) {
            if (callback != null) {
                callback(r);
            }
        }, _reqSvrUrl_ctg);
    };

    this.removeCtgForm = function (pars, callback) {
        _me.com().reqByCmd('removectgform', pars, function (r) {
            if (callback != null) {
                callback(r);
            }
        }, _reqSvrUrl_ctg);
    };

    this.listUserForSelector = function (pars, callback) {
    	if(pars.page == null) { pars.page = 1; }
    	if(pars.limit == null) { pars.limit = 200; }
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
    
    this.addBMUsers = function(pars, callback) {
        _me.com().reqByCmd('addbmusers', pars, function (r) {
            if (callback != null) {
                callback(r);
            }
        }, _reqSvrUrl);
    };
    
    this.removeBMUser = function(pars, callback) {
        _me.com().reqByCmd('removebmuser', pars, function (r) {
            if (callback != null) {
                callback(r);
            }
        }, _reqSvrUrl);
    };
    
    this.setBMUserDuty = function(pars, callback) {
        _me.com().reqByCmd('setbmuserduty', pars, function (r) {
            if (callback != null) {
                callback(r);
            }
        }, _reqSvrUrl);
    };
    
    this.setBMParent = function(pars, callback) {
        _me.com().reqByCmd('setctgparent', pars, function (r) {
            if (callback != null) {
                callback(r);
            }
        }, _reqSvrUrl_ctg);
    };
    
    this.loadBMUserMap = function(pars, callback) {
        _me.com().reqByCmd('loadbmusermap', pars, function (r) {
            if (callback != null) {
                callback(r);
            }
        }, _reqSvrUrl);
    };
    
    this.saveBMUserMap = function(pars, callback) {
        _me.com().reqByCmd('savebmusermap', pars, function (r) {
            if (callback != null) {
                callback(r);
            }
        }, _reqSvrUrl);
    };
};
CSJSV3.AUI.DataAgent.prototype = new CSJSV3.SuperHelper();

CSJSV3.AUI.ZzjgMgr = function (cfg) {
    var _me = this;
    var _uiCore;
    var _contextMenu;
    var _ctgSubmitForm;
    var _dataAgent;
    var _userSelector;

    {
    	cfg.nolimit = 1;
    	if(cfg.treeHide==null) {
    		cfg.treeHide = 0;
    	}
        cfg.root = {
            id: '',
            pid: '',
            title: '根',
            leaf: false
        };
        cfg.data = [];
        cfg.onLoadChild = function (node, nodeUI, callback) {
            if (node.id == '') {
            	var pid = '';
            	if(cfg.treeHide == 0) {
            		pid = '{csaui:all}';
            	}
            	//加载子类
                _dataAgent.listCtg({ pid: pid, ptype: 'bm', hide: cfg.treeHide, nolimit: 1 }, function (r) {
                    _me.world().setLoading(false);
                    if (r.success == false) {
                        _me.world().showErrorMsg(r.msg);
                        callback(node, nodeUI, null);
                    }
                    else {
                        var items = [];
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
                        	var tstr0 = '（';
                        	if(r.data[i].duty == 'leader') {
                        		tstr0 += '主；';
                        	}
                        	else if(r.data[i].duty == 'leader1') {
                        		tstr0 += '副；';
                        	}
                        	if(r.data[i].infoshenpi == 1) {
                        		tstr0 += '信息审；';
                        	}
                        	if(r.data[i].kaoqinshenpi == 1) {
                        		tstr0 += '考勤审；';
                        	}
                        	if(r.data[i].jixiaoshenpi == 1) {
                        		tstr0 += '绩效审；';
                        	}
                       		tstr0 += '）';
                        	if(tstr0=='（）') tstr0 = '';
                            items.push({ id: r.data[i].id, title: r.data[i].realname + tstr0, pid: node.id, duty: r.data[i].duty, type: 'user' });
                        }
                        
		            	var hide = 0;
		            	if(cfg.treeHide != 0) {
		            		hide = -1;
		            	}
		            	//加载子类
		                _dataAgent.listCtg({ pid: node.id, ptype: 'bm', hide: hide, nolimit: 1 }, function (r) {
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
        };
        _uiCore = $('<div class="CSJSV3AUISiteCtgMgr"></div>');
        cfg.uiCore = _uiCore;
        /* 继承父级 */
        this.super0(this, new CSJSV3.UI.Tree(cfg));
    }

    this.init = function (world) {
        /* 继承父级 */
        _me.base.init(world);
        _dataAgent = cfg.dataAgent;
        _ctgSubmitForm = new CSJSV3.AUI.BMSubmitForm({ dataAgent: _dataAgent, treeHide: cfg.treeHide });
        _ctgSubmitForm.init(world);
        _userSelector = new CSJSV3.AUI.UserSelectorM1({
        	onSelectComplete: function (items) {
        		var userids = [];
        		for(var i=0;i<items.length;i++) {
        			if(items[i].level==1) {
        				userids.push(items[i].id);
        			}
        		}
        		_dataAgent.addBMUsers({ userids: JSON.stringify(userids), bmid: _me.selectedItem().id }, function(r) {
        			if(r.success == false) {
        				_me.world().showErrorMsg(r.msg);
        			}
        			else {
        				_me.loadChildren(_me.selectedItem());
        			}
        		});
        	}
        });
        _userSelector.init(world);
    };
    
    this.resize = function () {
    	_userSelector.resize();
    };

    this.render = function () {
        _me.base.render();
        _ctgSubmitForm.render();
        _userSelector.render();
        _contextMenu = new CSJSV3.UI.ContextMenu({
            tgt: _me.getUICore(),
            items: [{
                title: '刷新',
                onClick: function (e) {
                    var treeNode = $(e.target);
                    while (!treeNode.hasClass('TreeNode')) {
                        treeNode = treeNode.parent();
                    }
                    var dc = treeNode[0].datacontext;
                    var parentNode = dc.parent;
                	_me.loadChildren(dc);
                },
                canShow: function (e) {
                    var treeNode = $(e.target);
                    while (!treeNode.hasClass('TreeNode')) {
                        treeNode = treeNode.parent();
                    }
                    var dc = treeNode[0].datacontext;

                    if (dc.level < 2) {
                        return true;
                    }
                    return false;
                }
            }, {
                title: '设置父级',
                onClick: function (e) {
                    var treeNode = $(e.target);
                    while (!treeNode.hasClass('TreeNode')) {
                        treeNode = treeNode.parent();
                    }
                    var dc = treeNode[0].datacontext;
                    showPCtgSelector(function(node) {
                    	_dataAgent.setBMParent({ id:dc.id, pid:node.id }, function(r) {
                    		if(r.success == false) {
                    			_me.world().showErrorMsg(r.msg);
                    		}
                    		else {
                    			_me.loadChildren(dc.parent);
                    			_me.loadChildren(node);
                    		}
                    	});
                    }, [dc.id]);
                },
                canShow: function (e) {
                    var treeNode = $(e.target);
                    while (!treeNode.hasClass('TreeNode')) {
                        treeNode = treeNode.parent();
                    }
                    var dc = treeNode[0].datacontext;

                    if (dc.level > 0 && dc.type == 'bm') {
                        return true;
                    }
                    return false;
                }
            }, {
                title: '新增分组',
                onClick: function (e) {
                    var treeNode = $(e.target);
                    while (!treeNode.hasClass('TreeNode')) {
                        treeNode = treeNode.parent();
                    }
                    var dc = treeNode[0].datacontext;
                    _ctgSubmitForm.showForNew(_me, dc);
                },
                canShow: function (e) {
                    var treeNode = $(e.target);
                    while (!treeNode.hasClass('TreeNode')) {
                        treeNode = treeNode.parent();
                    }
                    var dc = treeNode[0].datacontext;

                    if ((dc.level == 0 || dc.type == 'bm') && cfg.canNew != false) {
                        return true;
                    }
                    return false;
                }
            }, {
                title: '编辑分组',
                onClick: function (e) {
                    var treeNode = $(e.target);
                    while (!treeNode.hasClass('TreeNode')) {
                        treeNode = treeNode.parent();
                    }
                    var dc = treeNode[0].datacontext;
                    _ctgSubmitForm.showForEdit(_me, dc);
                },
                canShow: function (e) {
                    var treeNode = $(e.target);
                    while (!treeNode.hasClass('TreeNode')) {
                        treeNode = treeNode.parent();
                    }
                    var dc = treeNode[0].datacontext;
                    
                    if (dc.level > 0 && dc.type == 'bm') {
                        return true;
                    }
                    return false;
                }
            }, {
                title: '删除分组',
                onClick: function (e) {
                    var treeNode = $(e.target);
                    while (!treeNode.hasClass('TreeNode')) {
                        treeNode = treeNode.parent();
                    }
                    var dc = treeNode[0].datacontext;
                    var parentNode = dc.parent;
                    _me.world().confirm('确定删除？', function (r) {
                        if (r == 'yes') {
                            _dataAgent.removeCtgForm({ id: dc.id }, function (r) {
                                if (r.success == false) {
                                    _me.world().showErrorMsg(r.msg);
                                }
                                else {
                                    _me.loadChildren(parentNode);
                                }
                            });
                        }
                    });
                },
                canShow: function (e) {
                    var treeNode = $(e.target);
                    while (!treeNode.hasClass('TreeNode')) {
                        treeNode = treeNode.parent();
                    }
                    var dc = treeNode[0].datacontext;

                    if (dc.type == 'bm') {
                        return true;
                    }
                    return false;
                }
            }, {
                title: '设置职权',
                onClick: function (e) {
                    var treeNode = $(e.target);
                    while (!treeNode.hasClass('TreeNode')) {
                        treeNode = treeNode.parent();
                    }
                    var dc = treeNode[0].datacontext;
                    var parentNode = dc.parent;
                    showBMPpdForm(function() {}, _me, dc);
                },
                canShow: function (e) {
                    var treeNode = $(e.target);
                    while (!treeNode.hasClass('TreeNode')) {
                        treeNode = treeNode.parent();
                    }
                    var dc = treeNode[0].datacontext;

                    if (dc.level > 1 && dc.type == 'user') {
                        return true;
                    }
                    return false;
                }
            }, {
                title: '添加成员',
                onClick: function (e) {
                    var treeNode = $(e.target);
                    while (!treeNode.hasClass('TreeNode')) {
                        treeNode = treeNode.parent();
                    }
                    var dc = treeNode[0].datacontext;
                    var parentNode = dc.parent;
                    _userSelector.show();
                },
                canShow: function (e) {
                    var treeNode = $(e.target);
                    while (!treeNode.hasClass('TreeNode')) {
                        treeNode = treeNode.parent();
                    }
                    var dc = treeNode[0].datacontext;

                    if (dc.type == 'bm') {
                        return true;
                    }
                    return false;
                }
            }, {
                title: '移除成员',
                onClick: function (e) {
                    var treeNode = $(e.target);
                    while (!treeNode.hasClass('TreeNode')) {
                        treeNode = treeNode.parent();
                    }
                    var dc = treeNode[0].datacontext;
                    var parentNode = dc.parent;
                    
                    _me.world().confirm('确定删除？', function(r) {
                    	if(r == 'yes') {
	                    	_dataAgent.removeBMUser({ bmid:parentNode.id, userid:dc.id }, function(r) {
	                    		_me.loadChildren(parentNode);
	                    	});
                    	}
                    });
                },
                canShow: function (e) {
                    var treeNode = $(e.target);
                    while (!treeNode.hasClass('TreeNode')) {
                        treeNode = treeNode.parent();
                    }
                    var dc = treeNode[0].datacontext;

                    if (dc.type == 'user') {
                        return true;
                    }
                    return false;
                }
            }, {
                title: '设为主领导',
                onClick: function (e) {
                    var treeNode = $(e.target);
                    while (!treeNode.hasClass('TreeNode')) {
                        treeNode = treeNode.parent();
                    }
                    var dc = treeNode[0].datacontext;
                    var parentNode = dc.parent;
                    
                	_dataAgent.setBMUserDuty({ bmid:parentNode.id, userid:dc.id, duty:'leader' }, function(r) {
                		_me.loadChildren(parentNode);
                	});
                },
                canShow: function (e) {
                    var treeNode = $(e.target);
                    while (!treeNode.hasClass('TreeNode')) {
                        treeNode = treeNode.parent();
                    }
                    var dc = treeNode[0].datacontext;

                    if (dc.type == 'user' && dc.duty != 'leader') {
                        return true;
                    }
                    return false;
                }
            }, {
                title: '取消主领导',
                onClick: function (e) {
                    var treeNode = $(e.target);
                    while (!treeNode.hasClass('TreeNode')) {
                        treeNode = treeNode.parent();
                    }
                    var dc = treeNode[0].datacontext;
                    var parentNode = dc.parent;
                    
                	_dataAgent.setBMUserDuty({ bmid:parentNode.id, userid:dc.id, duty:'' }, function(r) {
                		_me.loadChildren(parentNode);
                	});
                },
                canShow: function (e) {
                    var treeNode = $(e.target);
                    while (!treeNode.hasClass('TreeNode')) {
                        treeNode = treeNode.parent();
                    }
                    var dc = treeNode[0].datacontext;

                    if (dc.type == 'user' && dc.duty == 'leader') {
                        return true;
                    }
                    return false;
                }
            }, {
                title: '设为副领导',
                onClick: function (e) {
                    var treeNode = $(e.target);
                    while (!treeNode.hasClass('TreeNode')) {
                        treeNode = treeNode.parent();
                    }
                    var dc = treeNode[0].datacontext;
                    var parentNode = dc.parent;
                    
                	_dataAgent.setBMUserDuty({ bmid:parentNode.id, userid:dc.id, duty:'leader1' }, function(r) {
                		_me.loadChildren(parentNode);
                	});
                },
                canShow: function (e) {
                    var treeNode = $(e.target);
                    while (!treeNode.hasClass('TreeNode')) {
                        treeNode = treeNode.parent();
                    }
                    var dc = treeNode[0].datacontext;

                    if (dc.type == 'user' && dc.duty != 'leader1') {
                        return true;
                    }
                    return false;
                }
            }, {
                title: '取消副领导',
                onClick: function (e) {
                    var treeNode = $(e.target);
                    while (!treeNode.hasClass('TreeNode')) {
                        treeNode = treeNode.parent();
                    }
                    var dc = treeNode[0].datacontext;
                    var parentNode = dc.parent;
                    
                	_dataAgent.setBMUserDuty({ bmid:parentNode.id, userid:dc.id, duty:'' }, function(r) {
                		_me.loadChildren(parentNode);
                	});
                },
                canShow: function (e) {
                    var treeNode = $(e.target);
                    while (!treeNode.hasClass('TreeNode')) {
                        treeNode = treeNode.parent();
                    }
                    var dc = treeNode[0].datacontext;

                    if (dc.type == 'user' && dc.duty == 'leader1') {
                        return true;
                    }
                    return false;
                }
            }
            ]
        });
        _contextMenu.init(_me.world());
        $(document.body).append(_contextMenu.getUICore());
    };
};
CSJSV3.AUI.ZzjgMgr.prototype = new CSJSV3.SuperHelper();