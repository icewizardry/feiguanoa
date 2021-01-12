/*
需要：CSUICore,CSUIContextMenu,CSUITree
allowToNewBtn:true
allowToEditBtn:true
allowToDelBtn:true
allowMultiChecked:false

renderTo
rootId
parentIdFieldName
titleFieldName
dataSource
contextMenuItems
onSelectedChange
onUpdateData
*/
function CSUICategory(cfg) {
    var _me = this;
    var _tree;

    {
    }

    this.toNew = function (parentId) {
        if (parentId == null) parentId = _tree.getSelectedItem().Id;

        var html = _me.getFormTpl();
        var form = $(html);
        form.find('input[name=UpdType]').val('new');
        form.find('input[name=ParentId]').val(parentId);
        _me.loadForm(form);
        form.find('.submitBtn').click(function () {
            _me.submitForm(form);
        });
        csui.showWin({ title: '新增', html: form, width: 450, height: 350 });
    };

    this.toEdit = function () {
        var html = _me.getFormTpl();
        var form = $(html);
        form.find('input[name=UpdType]').val('edit');
        form.find('input[name=ParentId]').val(_tree.getSelectedItem().ParentId);
        form.find('input[name=Id]').val(_tree.getSelectedItem().Id);
        _me.loadForm(form);
        form.find('.submitBtn').click(function () {
            _me.submitForm(form);
        });
        csui.showWin({ title: '编辑', html: form, width: 450, height: 350 });
    };

    this.toDel = function () {
        if (confirm('确定删除？')) {
            var pars = { conStr: cfg.conStr, Id: _tree.getSelectedItem().Id };
            csui.reqByCmd('ctg_safeDelCtg', pars, function (r) {
                csui.setLoading(false);

                if (r.success != true) {
                    alert(r.msg);
                }
                else {
                    _tree.loadData();
                    if (cfg.onUpdateData != null) {
                        cfg.onUpdateData();
                    }
                }
            }, '../../admin/Handler.ashx');
        }
    };

    this.loadForm = function (formJq) {
        csui.setLoading(true);

        var pars = { conStr: cfg.conStr };
        formJq.find('input[type=hidden]').each(function (i, n) {
            if ($(n).attr('name') != null && $(n).attr('name') != '') {
                eval('pars.' + $(n).attr('name') + ' = n.value;')
            }
        });
        csui.reqByCmd('ctg_getCtgForm', pars, function (r) {
            csui.setLoading(false);

            if (r.success != true) {
                alert(r.msg);
            }
            else {
                formJq.find('*').each(function (i, n) {
                    if ($(n).attr('name') != null && $(n).attr('name') != '') {
                        if (r.data.length != null) {
                            eval('n.value = r.data[0].' + $(n).attr('name') + ';');
                        }
                        else {
                            if (r.data[$(n).attr('name')] != null) {
                                n.value = r.data[$(n).attr('name')];
                            }
                            else {
                                n.value = '';
                            }
                        }
                    }
                });
            }
        }, '../../admin/Handler.ashx');
    };

    this.submitForm = function (formJq) {
        var pars = { conStr: cfg.conStr };
        formJq.find('*').each(function (i, n) {
            if ($(n).attr('name') != null && $(n).attr('name') != '') {
                eval('pars.' + $(n).attr('name') + ' = n.value;');
            }
        });

        csui.setLoading(true);
        var cmd = 'ctg_updCtgForm';
        csui.reqByCmd(cmd, pars, function (r) {
            csui.setLoading(false);

            if (r.success != true) {
                alert(r.msg);
            }
            else {
                _tree.loadData();
                if (cfg.onUpdateData != null) {
                    cfg.onUpdateData();
                }
                csui.closeWin();
            }
        }, '../../admin/Handler.ashx');
    };

    this.getFormTpl = function () {
        var html = '<form id="form1">\
    <input name="Id" type="hidden" />\
    <input name="ParentId" type="hidden" />\
    <input name="UpdType" type="hidden" value="new" />\
    <input name="NodeType" type="hidden" value="ctg" />\
    <div>\
        <div class="field">\
            <div class="label">名称：</div>\
            <input name="Name" type="text" />\
        </div>\
        <div class="field">\
            <div class="label">备注：</div>\
            <textarea name="Note" style="width: 400px; height: 100px;"></textarea>\
        </div>\
        <div class="field">\
            <div class="label">序号：</div>\
            <input name="Order" type="text" value="0" />\
        </div>\
        <div style="clear:both;"></div>\
    </div>\
    <div class="ctrlBar">\
        <input class="submitBtn" type="button" value="保存" /><input class="cancelBtn" type="button" value="取消" onclick="csui.closeWin();" style="margin-left: 12px;" /></div>\
        <style>\
        body{font: 12px/150% Arial,Verdana, "\5b8b\4f53";}\
        input[type=text], textarea\
        {\
            line-height: 26px;\
            height: 26px;\
            padding-left: 6px;\
            -moz-border-radius: 3px; /* Gecko browsers */\
            -webkit-border-radius: 3px; /* Webkit browsers */\
            border-radius: 3px; /* W3C syntax */\
            border: 1px solid silver;\
        }\
        input[type=button]\
        {\
            padding: 3px;\
            padding-left: 16px;\
            padding-right: 16px;\
        }\
        .label\
        {\
            padding-top: 12px;\
            padding-bottom: 6px;\
            font: 12px/150% Arial,Verdana, "\5b8b\4f53";\
        }\
        .ctrlBar\
        {\
            margin-top: 16px;\
            margin-left: 6px;\
        }\
    </style>\
    </form>';

        return html;
    };

    this.build = function () {
        if (cfg.contextMenuItems == null) {
            cfg.contextMenuItems = [];
        }

        if (cfg.allowToNewBtn != false) {
            cfg.contextMenuItems.push({
                text: '新增',
                onclick: function () {
                    _me.toNew();
                }
            });
        }

        if (cfg.allowToEditBtn != false) {
            cfg.contextMenuItems.push({
                text: '编辑',
                onclick: function () {
                    _me.toEdit();
                }
            });
        }

        if (cfg.allowToDelBtn != false) {
            cfg.contextMenuItems.push({
                text: '删除',
                onclick: function () {
                    _me.toDel();
                }
            });
        }

        if (cfg.contextMenuItems1 != null) {
            for (var i = 0; i < cfg.contextMenuItems1.length; i++) {
                cfg.contextMenuItems.push(cfg.contextMenuItems1[i]);
            }
        }

        _tree = new CSUITree(cfg);
        _tree.init();
    };

    this.hasLoadData = function () {
        return _tree.hasLoadData();
    };

    this.resize = function () {
        _tree.resize();
    };

    this.getSelectedItem = function () {
        return _tree.getSelectedItem();
    };

    this.getSelectedItems = function () {
        return _tree.getSelectedItems();
    };

    this.selectItem = function (func, from, callback) {
        _tree.selectItem(func, from, callback);
    };

    this.selectItemByPath = function (path, callback) {
        _tree.selectItemByPath(path, callback);
    };
    
    this.cancelAllSelectItems = function (notrigger) {
        _tree.cancelAllSelectItems(notrigger);
    };

    this.loadData = function (pars, callback) {
        return _tree.loadData(pars, callback);
    };

    this.setData = function (data) {
        _tree.setData(data);
    };

    this.setHeight = function (v) {
        _tree.setHeight(v);
    };

    this.clear = function () {
        _tree.clear();
    };

    this.getUICore = function () {
        return _tree.getUICore();
    };
}/*res CSUI*/
