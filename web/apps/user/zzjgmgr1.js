
CSJSV3.AUI.BMSubmitForm = function (cfg) {
    var _me = this;
    var _toUpdWin;
    var _dataAgent;

    var _curTree;
    var _curPNode;

    {
        _dataAgent = cfg.dataAgent;
        cfg.updTypeFieldName = 'updType';
        cfg.style = '';
        cfg.fieldLabelStyle = 'margin-left:10px;width:60px;';
        cfg.hiddenFields = [
            { label: 'id', name: 'id', value: '', canEmpty: false, canEmptyFor: '' },
            { label: 'pid', name: 'pid', value: '', canEmpty: true, canEmptyFor: '' },
            { label: 'ptype', name: 'ptype', value: '', canEmpty: false, canEmptyFor: '' },
            { label: 'level', name: 'level', value: '', canEmpty: false, canEmptyFor: 'new' },
            { label: 'childcount', name: 'childcount', value: '', canEmpty: false, canEmptyFor: 'new' },
            { label: 'treepath', name: 'treepath', value: '', canEmpty: false, canEmptyFor: 'new' }
        ];
        cfg.rows = [
            {
                fields: [
                    { label: '名称', type: 'text', name: 'title', value: '', canEmpty: false, canEmptyFor: '', style: '' },
                    { label: '序号', type: 'number', name: 'xuhao', value: '0', canEmpty: false, canEmptyFor: '', style: 'width:40px;' },
                    { label: '隐藏', type: 'custom', name: 'hide', value:'', canEmpty: false, canEmptyFor: '', style: 'margin-right:25px;', body: new CSJSV3.UI.Checkbox({}) }
                ]
            }
        ];
        cfg.onSubmit = function (self) {
            _me.world().setLoading(true);
            _dataAgent.saveCtgForm(self.data(), function (r) {
                _me.world().setLoading(false);
                if (r.success == false) {
                    _me.world().showErrorMsg(r.msg);
                }
                else {
                    _curTree.loadChildren(_curPNode);
                    _toUpdWin.hide();
                }
            });
        };
        cfg.onCancel = function (self) {
            _toUpdWin.hide();
        };
        /* 继承父级 */
        this.super0(this, new CSJSV3.UI.SubmitForm(cfg));
    }

    this.init = function (world) {
        /* 继承父级 */
        _me.base.init(world);
        _toUpdWin = new CSJSV3.UI.Win({ title: '', body: _me.getUICore(), closeBtnType: 'hide' });
        _toUpdWin.init(world);
    };

    this.showForNew = function (tree, node) {
        _curTree = tree;
        _curPNode = node;
        var ptype = 'bm';
        _me.world().setLoading(true);
        _dataAgent.loadCtgForm({ updType: 'new', pid: node.id, ptype: ptype, hide: cfg.treeHide }, function (r) {
            _me.world().setLoading(false);
            if (r.success == false) {
                _me.world().showErrorMsg(r.msg);
            }
            else {
                _me.reset();
                _me.data(r.data);
                _toUpdWin.title('新增');
                _toUpdWin.show();
                /* 聚焦提交按钮 */
                _toUpdWin.getUICore().find('.SubmitBtn').focus();
            }
        });
    };

    this.showForEdit = function (tree, node) {
        _curTree = tree;
        _curPNode = node.parent;

        var selected = node;
        if (selected == null) {
            _me.world().showErrorMsg('请先选择一项');
        }
        else {
            _me.world().setLoading(true);
            _dataAgent.loadCtgForm({ updType: 'edit', id: selected.id }, function (r) {
                _me.world().setLoading(false);
                if (r.success == false) {
                    _me.world().showErrorMsg(r.msg);
                }
                else {
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
CSJSV3.AUI.BMSubmitForm.prototype = new CSJSV3.SuperHelper();

CSJSV3.AUI.BMUserMapSubmitForm = function (cfg) {
    var _me = this;
    var _toUpdWin;
    var _dataAgent;

    var _curTree;
    var _curPNode;

    {
        _dataAgent = cfg.dataAgent;
        cfg.updTypeFieldName = 'updType';
        cfg.style = '';
        cfg.fieldLabelStyle = 'margin-left:10px;width:80px;';
        cfg.hiddenFields = [
            { label: 'bmid', name: 'bmid', value: '', canEmpty: false, canEmptyFor: '' },
            { label: 'bmtitle', name: 'bmtitle', value: '', canEmpty: false, canEmptyFor: '' },
            { label: 'userid', name: 'userid', value: '', canEmpty: false, canEmptyFor: '' },
            { label: 'username', name: 'username', value: '', canEmpty: false, canEmptyFor: '' },
            { label: 'duty', name: 'duty', value: '', canEmpty: true, canEmptyFor: '' }
        ];
        cfg.rows = [
            {
                fields: [
                    { label: '信息审批', type: 'custom', name: 'infoshenpi', value:'', canEmpty: false, canEmptyFor: '', style: '', body: new CSJSV3.UI.Checkbox({}) },
                    { label: '请假审批', type: 'custom', name: 'kaoqinshenpi', value:'', canEmpty: false, canEmptyFor: '', style: '', body: new CSJSV3.UI.Checkbox({}) },
                    { label: '绩效审批', type: 'custom', name: 'jixiaoshenpi', value:'', canEmpty: false, canEmptyFor: '', style: 'margin-right:25px;', body: new CSJSV3.UI.Checkbox({}) }
                ]
            }
        ];
        cfg.onSubmit = function (self) {
            _me.world().setLoading(true);
            _dataAgent.saveBMUserMap(self.data(), function (r) {
                _me.world().setLoading(false);
                if (r.success == false) {
                    _me.world().showErrorMsg(r.msg);
                }
                else {
                    _curTree.loadChildren(_curPNode);
                    _toUpdWin.hide();
                }
            });
        };
        cfg.onCancel = function (self) {
            _toUpdWin.hide();
        };
        /* 继承父级 */
        this.super0(this, new CSJSV3.UI.SubmitForm(cfg));
    }

    this.init = function (world) {
        /* 继承父级 */
        _me.base.init(world);
        _toUpdWin = new CSJSV3.UI.Win({ title: '', body: _me.getUICore(), closeBtnType: 'hide' });
        _toUpdWin.init(world);
    };

    this.showForNew = function (tree, node) {
    };

    this.showForEdit = function (tree, node) {
        _curTree = tree;
        _curPNode = node.parent;

        var selected = node;
        if (selected == null) {
            _me.world().showErrorMsg('请先选择一项');
        }
        else {
            _me.world().setLoading(true);
            _dataAgent.loadBMUserMap({ updType: 'edit', bmid: _curPNode.id, userid: selected.id }, function (r) {
                _me.world().setLoading(false);
                if (r.success == false) {
                    _me.world().showErrorMsg(r.msg);
                }
                else {
                    _me.reset();
                    _me.data(r.data);
                    _toUpdWin.title('设置职权');
                    _toUpdWin.show();
                    /* 聚焦提交按钮 */
                    _toUpdWin.getUICore().find('.SubmitBtn').focus();
                }
            });
        }
    };
};
CSJSV3.AUI.BMUserMapSubmitForm.prototype = new CSJSV3.SuperHelper();