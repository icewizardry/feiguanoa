
CSJSV3.AUI.SiteSubmitForm = function(cfg) {
	var _me = this;
	var _toUpdWin;
	var _dataAgent;

	var _curTree;
	var _curPNode;

	{
		_dataAgent = cfg.dataAgent;
		cfg.updTypeFieldName = 'updType';
		cfg.fieldLabelStyle = 'width:70px;';
		cfg.hiddenFields = [ {
			label : '',
			name : 'id',
			value : '',
			canEmpty : false,
			canEmptyFor : ''
		} ];
		cfg.rows = [ {
			fields : [ {
				label : '名称',
				type : 'text',
				name : 'title',
				value : '',
				canEmpty : false,
				canEmptyFor : '',
				style : ''
			}, {
				label : '序号',
				type : 'number',
				name : 'xuhao',
				value : '0',
				canEmpty : false,
				canEmptyFor : '',
				style : 'margin-right:30px;'
			} ]
		} ];
		cfg.onSubmit = function(self) {
			_me.world().setLoading(true);
			_dataAgent.saveSiteForm(self.data(), function(r) {
				_me.world().setLoading(false);
				if (r.success == false) {
					_me.world().showErrorMsg(r.msg);
				} else {
					_curTree.loadChildren(_curPNode);
					_toUpdWin.hide();
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
		_toUpdWin = new CSJSV3.UI.Win({
			title : '',
			body : _me.getUICore(),
			closeBtnType : 'hide'
		});
		_toUpdWin.init(world);
	};

	this.showForNew = function(tree, node) {
		_curTree = tree;
		_curPNode = node;
		_me.world().setLoading(true);
		_dataAgent.loadSiteForm({
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
				/* 聚焦提交按钮 */
				_toUpdWin.getUICore().find('.SubmitBtn').focus();
			}
		});
	};

	this.showForEdit = function(tree, node) {
		_curTree = tree;
		_curPNode = node.parent;

		var selected = node;
		if (selected == null) {
			_me.world().showErrorMsg('请先选择一项');
		} else {
			_me.world().setLoading(true);
			_dataAgent.loadSiteForm({
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
		}
	};
};
CSJSV3.AUI.SiteSubmitForm.prototype = new CSJSV3.SuperHelper();

CSJSV3.AUI.CtgSubmitForm = function(cfg) {
	var _me = this;
	var _toUpdWin;
	var _dataAgent;

	var _curTree;
	var _curPNode;

	{
		_dataAgent = cfg.dataAgent;
		cfg.updTypeFieldName = 'updType';
		cfg.fieldLabelStyle = 'margin-left:10px;width:60px;';
		cfg.hiddenFields = [ {
			label : 'id',
			name : 'id',
			value : '',
			canEmpty : false,
			canEmptyFor : ''
		}, {
			label : 'pid',
			name : 'pid',
			value : '',
			canEmpty : false,
			canEmptyFor : ''
		}, {
			label : 'ptype',
			name : 'ptype',
			value : '',
			canEmpty : false,
			canEmptyFor : ''
		}, {
			label : 'level',
			name : 'level',
			value : '',
			canEmpty : false,
			canEmptyFor : 'new'
		}, {
			label : 'childcount',
			name : 'childcount',
			value : '',
			canEmpty : false,
			canEmptyFor : 'new'
		}, {
			label : 'treepath',
			name : 'treepath',
			value : '',
			canEmpty : false,
			canEmptyFor : 'new'
		} ];
		cfg.rows = [ {
			fields : [ {
				label : '名称',
				type : 'text',
				name : 'title',
				value : '',
				canEmpty : false,
				canEmptyFor : '',
				style : ''
			}, {
				label : '序号',
				type : 'number',
				name : 'xuhao',
				value : '0',
				canEmpty : false,
				canEmptyFor : '',
				style : 'width:40px;'
			} ]
		} ];
		cfg.onSubmit = function(self) {
			_me.world().setLoading(true);
			_dataAgent.saveCtgForm(self.data(), function(r) {
				_me.world().setLoading(false);
				if (r.success == false) {
					_me.world().showErrorMsg(r.msg);
				} else {
					_curTree.loadChildren(_curPNode);
					_toUpdWin.hide();
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
		_toUpdWin = new CSJSV3.UI.Win({
			title : '',
			body : _me.getUICore(),
			closeBtnType : 'hide'
		});
		_toUpdWin.init(world);
	};

	this.showForNew = function(tree, node) {
		_curTree = tree;
		_curPNode = node;
		var ptype = 'ctg';
		if (node.level == 1) {
			ptype = 'site';
		}
		_me.world().setLoading(true);
		_dataAgent.loadCtgForm({
			updType : 'new',
			pid : node.id,
			ptype : ptype
		}, function(r) {
			_me.world().setLoading(false);
			if (r.success == false) {
				_me.world().showErrorMsg(r.msg);
			} else {
				_me.reset();
				_me.data(r.data);
				_toUpdWin.title('新增');
				_toUpdWin.show();
				/* 聚焦提交按钮 */
				_toUpdWin.getUICore().find('.SubmitBtn').focus();
			}
		});
	};

	this.showForEdit = function(tree, node) {
		_curTree = tree;
		_curPNode = node.parent;

		var selected = node;
		if (selected == null) {
			_me.world().showErrorMsg('请先选择一项');
		} else {
			_me.world().setLoading(true);
			_dataAgent.loadCtgForm({
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
		}
	};
};
CSJSV3.AUI.CtgSubmitForm.prototype = new CSJSV3.SuperHelper();
