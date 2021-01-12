
CSJSV3.AUI.SiteCtgMgr = function(cfg) {
	var _me = this;
	var _uiCore;
	var _contextMenu;
	var _siteSubmitForm;
	var _ctgSubmitForm;
	var _dataAgent;
	var _isFirstSiteExpand = false;
	var _webTopObj;
	
	var _needLoadCount = 0;
	var _hasLoadCount = 0;

	{
		if(cfg == null) cfg = {};
		if(cfg.needLoadCount != null) _needLoadCount = cfg.needLoadCount;
		if(cfg.onReady == null) cfg.onReady = function(){};
		if(cfg.nolimit == null) cfg.nolimit = 0;
		if(cfg.root == null) {
			cfg.root = {
				id : '',
				pid : '',
				title : '根',
				leaf : false
			};
		}
		cfg.data = [];
		if(cfg.onRenderNodeBefore == null) {
			cfg.onRenderNodeBefore = function (node) {
	            if (node.level == 1 && !_isFirstSiteExpand) {
	            	_isFirstSiteExpand = true;
	                node.state = 'expand';
	            }
	        };
		}
		cfg.onLoadChild = function(node, nodeUI, callback) {
			if (node.id == '') {
				_dataAgent.listSite({
					nolimit: cfg.nolimit
				}, function(r) {
					_me.world().setLoading(false);
					if (r.success == false) {
						_me.world().showErrorMsg(r.msg);
						callback(node, nodeUI, null);
					} else {
						var items = [];
						for (var i = 0; i < r.data.length; i++) {
							r.data[i].pid = '';
							if (r.data[i].ctgcount > 0) {
								r.data[i].leaf = false;
							}
							items.push(r.data[i]);
						}
						callback(node, nodeUI, items);
						_hasLoadCount++;
	                	onLoadChange();
					}
				});
			} else if (node.parent != null && node.parent.id == '' && (node.type == null || node.type == 'site')) {
				_dataAgent.listCtg({
					pid : node.id,
					ptype : 'site',
					nolimit: cfg.nolimit
				}, function(r) {
					_me.world().setLoading(false);
					if (r.success == false) {
						_me.world().showErrorMsg(r.msg);
						callback(node, nodeUI, null);
					} else {
						var items = [];
						for (var i = 0; i < r.data.length; i++) {
							if (r.data[i].childcount > 0) {
								r.data[i].leaf = false;
							}
							items.push(r.data[i]);
						}
						callback(node, nodeUI, items);
						_hasLoadCount++;
	                	onLoadChange();
					}
				});
			} else {
				_dataAgent.listCtg({
					pid : node.id,
					ptype : 'ctg',
					nolimit: cfg.nolimit
				}, function(r) {
					_me.world().setLoading(false);
					if (r.success == false) {
						_me.world().showErrorMsg(r.msg);
						callback(node, nodeUI, null);
					} else {
						var items = [];
						for (var i = 0; i < r.data.length; i++) {
							if (r.data[i].childcount > 0) {
								r.data[i].leaf = false;
							}
							items.push(r.data[i]);
						}
						callback(node, nodeUI, items);
						_hasLoadCount++;
	                	onLoadChange();
					}
				});
			}
		};
		_uiCore = $('<div class="CSJSV3AUISiteCtgMgr"></div>');
		cfg.uiCore = _uiCore;
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.Tree(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		_webTopObj = world.com().getWebTopObj();
		_dataAgent = new CSJSV3.AUI.SiteCtgDataAgent({});
		_dataAgent.init(world);
		_siteSubmitForm = new CSJSV3.AUI.SiteSubmitForm({
			dataAgent : _dataAgent
		});
		_siteSubmitForm.init(world);
		_ctgSubmitForm = new CSJSV3.AUI.CtgSubmitForm({
			dataAgent : _dataAgent
		});
		_ctgSubmitForm.init(world);
	};

	this.render = function() {
		_me.base.render();
		_siteSubmitForm.render();
		_ctgSubmitForm.render();
		_contextMenu = new CSJSV3.UI.ContextMenu({
			tgt : _me.getUICore(),
			items : [ {
				title : '刷新',
				onClick : function(e) {
					var selected = _me.selectedItem();
					_me.loadChildren(selected);
				},
				canShow : function(e) {
					var treeNode = $(e.target);
					while (!treeNode.hasClass('TreeNode')) {
						treeNode = treeNode.parent();
					}
					var dc = treeNode[0].datacontext;
					
					if (dc.level == 0 || dc.ctgcount > 0) {
						return true;
					}
					return false;
				}
			}, {
				title : '新增站点',
				onClick : function(e) {
					var treeNode = $(e.target);
					while (!treeNode.hasClass('TreeNode')) {
						treeNode = treeNode.parent();
					}
					var dc = treeNode[0].datacontext;
					_siteSubmitForm.showForNew(_me, dc);
				},
				canShow : function(e) {
					var treeNode = $(e.target);
					while (!treeNode.hasClass('TreeNode')) {
						treeNode = treeNode.parent();
					}
					var dc = treeNode[0].datacontext;

					if (dc.level == 0 && _webTopObj.hasPpdKey('inf_sitectgmgr_newSite')) {
						return true;
					}
					return false;
				}
			}, {
				title : '编辑站点',
				onClick : function(e) {
					var treeNode = $(e.target);
					while (!treeNode.hasClass('TreeNode')) {
						treeNode = treeNode.parent();
					}
					var dc = treeNode[0].datacontext;
					_siteSubmitForm.showForEdit(_me, dc);
				},
				canShow : function(e) {
					var treeNode = $(e.target);
					while (!treeNode.hasClass('TreeNode')) {
						treeNode = treeNode.parent();
					}
					var dc = treeNode[0].datacontext;

					if (dc.level == 1 && _webTopObj.hasPpdKey('inf_sitectgmgr_editSite')) {
						return true;
					}
					return false;
				}
			}, {
				title : '删除站点',
				onClick : function(e) {
					var treeNode = $(e.target);
					while (!treeNode.hasClass('TreeNode')) {
						treeNode = treeNode.parent();
					}
					var dc = treeNode[0].datacontext;
					var parentNode = dc.parent;
					_me.world().confirm('确定删除？', function(r) {
						if (r == 'yes') {
							_dataAgent.removeSiteForm({
								id : dc.id
							}, function(r) {
								if (r.success == false) {
									_me.world().showErrorMsg(r.msg);
								} else {
									_me.loadChildren(parentNode);
								}
							});
						}
					});
				},
				canShow : function(e) {
					var treeNode = $(e.target);
					while (!treeNode.hasClass('TreeNode')) {
						treeNode = treeNode.parent();
					}
					var dc = treeNode[0].datacontext;
					if (dc.level == 1 && _webTopObj.hasPpdKey('inf_sitectgmgr_delSite')) {
						return true;
					}
					return false;
				}
			}, {
				title : '新增类目',
				onClick : function(e) {
					var treeNode = $(e.target);
					while (!treeNode.hasClass('TreeNode')) {
						treeNode = treeNode.parent();
					}
					var dc = treeNode[0].datacontext;
					_ctgSubmitForm.showForNew(_me, dc);
				},
				canShow : function(e) {
					var treeNode = $(e.target);
					while (!treeNode.hasClass('TreeNode')) {
						treeNode = treeNode.parent();
					}
					var dc = treeNode[0].datacontext;

					if (dc.level >= 1 && _webTopObj.hasPpdKey('inf_sitectgmgr_newCtg')) {
						return true;
					}
					return false;
				}
			}, {
				title : '编辑类目',
				onClick : function(e) {
					var treeNode = $(e.target);
					while (!treeNode.hasClass('TreeNode')) {
						treeNode = treeNode.parent();
					}
					var dc = treeNode[0].datacontext;
					_ctgSubmitForm.showForEdit(_me, dc);
				},
				canShow : function(e) {
					var treeNode = $(e.target);
					while (!treeNode.hasClass('TreeNode')) {
						treeNode = treeNode.parent();
					}
					var dc = treeNode[0].datacontext;
					if (dc.level > 1 && _webTopObj.hasPpdKey('inf_sitectgmgr_editCtg')) {
						return true;
					}
					return false;
				}
			}, {
				title : '删除类目',
				onClick : function(e) {
					var treeNode = $(e.target);
					while (!treeNode.hasClass('TreeNode')) {
						treeNode = treeNode.parent();
					}
					var dc = treeNode[0].datacontext;
					var parentNode = dc.parent;
					_me.world().confirm('确定删除？', function(r) {
						if (r == 'yes') {
							_dataAgent.removeCtgForm({
								id : dc.id
							}, function(r) {
								if (r.success == false) {
									_me.world().showErrorMsg(r.msg);
								} else {
									_me.loadChildren(parentNode);
								}
							});
						}
					});
				},
				canShow : function(e) {
					var treeNode = $(e.target);
					while (!treeNode.hasClass('TreeNode')) {
						treeNode = treeNode.parent();
					}
					var dc = treeNode[0].datacontext;

					if (dc.level > 1 && _webTopObj.hasPpdKey('inf_sitectgmgr_delCtg')) {
						return true;
					}
					return false;
				}
			} ]
		});
		_contextMenu.init(_me.world());
		$(document.body).append(_contextMenu.getUICore());
	};
	
	function onLoadChange() {
		if(_hasLoadCount == _needLoadCount) {
			cfg.onReady();
		}
	}
};
CSJSV3.AUI.SiteCtgMgr.prototype = new CSJSV3.SuperHelper();