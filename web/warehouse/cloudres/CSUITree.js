/*
allowCancelSelected:true
allowMultiChecked:false
allowAutoLoadChild:false（设为true表示逐层加载，不是一次性都加载完）
onlyGetLeafNode:false 只能选取叶结点
childFieldName
startFoldLevel  开始折叠级别,例：0,1,2...


dataSource: {
url: 'handler.ashx?cmd=getTreeTestData1',
getParsFunc: function () {
return { siteId: '' };
}
},
loadChildDataSource: {
url: 'handler.ashx?cmd=getChildCtg',
pidFromFieldName: 'Id',
pidToFieldName: 'PId',
pidTypeFromFieldName: 'ItemType',
pidTypeToFieldName: 'pidType'
},

showRootNode:false
rootId
rootTitle

idFieldName
titleFieldName
parentIdFieldName
isLeafFieldName

onBuildItem:function(self, dc, jqEl){return jqEl;}
onSelectedChange:function(self, dc, itemEl, selected){}
onDblClick:function(self, dc){}
onZDOrZK:function(self, type, item)

getIconFunc:function(self, dc, level)
*/
function CSUITree(cfg) {
    var _me = this;
    var _data;
    var _allDataHasInsert = false;
    var _panel;
    
    var _toUnfoldBtnHtml = '<img class="toUnfoldImg" src="data:image/gif;base64,R0lGODlhEAAUAOMOADFKY0L/QpSlvZylvZytxqW11qm92r3GxrXI48bGxsbS59Te8efv9+vz/////////yH5BAEAAA8ALAAAAAAQABQAAARN8MkpE70462e3/90nSgthDoMgHBnhvG/DAC0MyAqNuS/ALAbdZeAAGI1BzkXgkAEWioKQIpAtAAqENCNgZA2F8HRyOJpZo1EonV6zKREAOw==" style="width:16px;height:20px;" />';
    
    var _toFoldBtnHtml = '<img class="toFoldImg" src="data:image/gif;base64,R0lGODlhEAAUAOMOADFKY0L/QpSlvZylvZytxqW11qm92r3GxrnK5MbGxsbW69jh8efv9+vz/////////yH5BAEAAA8ALAAAAAAQABQAAARM8MkpE70462e3/90nSgthDoMgHBnhvG/DAC3syAiNuTGzGLrLwAEoFoGci+DmWygKQYpAtnAioBkBQ4EwFL7RycFIZo1GofM5raZEAAA7" style="width:16px;height:20px; " />';
    var _checkedBtnStyle = 'display:none;';
    var _preSelecteds = [];
    var _preCheckeds = [];
    var _rootId = '';

    {
        if (cfg.allowCancelSelected == null) {
            cfg.allowCancelSelected = true;
        }

        if (cfg.allowMultiChecked == null) {
            cfg.allowMultiChecked = false;
        }
        else {
            if (cfg.allowMultiChecked) {
                _checkedBtnStyle = '';
            }
        }

        if (cfg.onlyGetLeafNode == null) {
            cfg.onlyGetLeafNode = false;
        }

        
        if (cfg.startFoldLevel == null) {
            cfg.startFoldLevel = 1;
        }

        if (cfg.getIconFunc == null) {
            cfg.getIconFunc = function () {
                return '';
            };
        }

        if (cfg.rootTitle == null) { cfg.rootTitle = '根'; }
    }

    this.getUICore = function () {
        return _panel;
    };

    this.buildUI = function () {
        _panel = $('<div class="cs_ui_tree_panel" oncontextmenu="return false;"></div>');
        if (cfg.renderTo != null) {
            $(cfg.renderTo).append(_panel);
        }
    };

    function resizeNode(n) {
        $(n).find('.cs_ui_tree_item_prefix').first().each(function (i, n) {
            var t = 0;
            $(n).children().each(function (i2, n2) {
                if ($(n2).css('clear') != 'both') {
                    t += $(n2).outerWidth(true);
                }
            });
            $(n).css('min-width', t + 3);
        });
    }

    this.resize = function () {
        
        _panel.find('.cs_ui_tree_item_prefix').each(function (i, n) {
            resizeNode(_findYourItemNode(n));
        });
        
        //        if (_panel.parent()[0] != null) {
        //            _panel.width(_panel.parent()[0].scrollWidth);
        //        }
        var maxNodeWidth = 0;
        _panel.find('.cs_ui_tree_item_head').each(function (i, n) {
            if ($(n).find('table').first().outerWidth(true) > maxNodeWidth) {
                maxNodeWidth = $(n).find('table').first().outerWidth(true);
            }
        });
        if (maxNodeWidth > _panel.parent().width()) {
            _panel.width(maxNodeWidth);
        }
        else {
            _panel.width(_panel.parent().width() - 20);
        }
    };

    function rebuildNode(n, callback) {

        if (cfg.allowAutoLoadChild == true && !_hasChild(n)) {
            if (cfg.isLeafFieldName != null && n.datacontext[cfg.isLeafFieldName] == true) {
                $(n).find('.cs_ui_tree_item_prefix_clickArea').first().children().remove();
                $(n).find('.cs_ui_tree_item_prefix_clickArea').first().append('<div class="cs_ui_tree_item_prefix_2">&nbsp;<div class="cs_ui_tree_item_prefix_2_1">&nbsp;</div></div>');
            }
            else {
                if ($(n).find('.cs_ui_tree_item_prefix_clickArea').first().children().length == 0) {
                    var t_btn = $('<div class="cs_ui_tree_item_btn"></div>');
                    if (_isZD(n)) {
                        t_btn.html(_toUnfoldBtnHtml);
                    }
                    else {
                        t_btn.html(_toFoldBtnHtml);
                    }
                    $(n).find('.cs_ui_tree_item_prefix_clickArea').first().append(t_btn);
                }
            }
        }
        else {
            if ((cfg.isLeafFieldName != null && n.datacontext[cfg.isLeafFieldName] == true) || !_hasChild(n)) {
                $(n).find('.cs_ui_tree_item_prefix_clickArea').first().children().remove();
                $(n).find('.cs_ui_tree_item_prefix_clickArea').first().append('<div class="cs_ui_tree_item_prefix_2">&nbsp;<div class="cs_ui_tree_item_prefix_2_1">&nbsp;</div></div>');
            }
            else {
                if ($(n).find('.cs_ui_tree_item_prefix_clickArea').first().children().length == 0) {
                    var t_btn = $('<div class="cs_ui_tree_item_btn"></div>');
                    if (_isZD(n)) {
                        t_btn.html(_toUnfoldBtnHtml);
                    }
                    else {
                        t_btn.html(_toFoldBtnHtml);
                    }
                    $(n).find('.cs_ui_tree_item_prefix_clickArea').first().append(t_btn);
                }
            }

            if (cfg.startFoldLevel != null) {
                var item = $(n);
                if (item.attr('level') < cfg.startFoldLevel && _isZD(item)) {
                    
                    _zdOrZk(item, true);
                }
            }
        }
        
        $(n).find('.cs_ui_tree_item_btn').first().click(function () {
            var item = $(this).parent().parent().parent().parent().parent().parent().parent();
            _zdOrZk(item);
        });
        
        $(n).find('.cs_ui_tree_item_title').first().click(function (e) {
            _me.selectItem(this, 'user');
        });
        
        $(n).find('.cs_ui_tree_item_title').first().dblclick(function (e) {
            var item = $(this).parent().parent().parent().parent().parent();

            if (cfg.onDblClick != null) {
                cfg.onDblClick(_me, item[0].datacontext);
            }
        });
        
        $(n).find('.cs_ui_tree_item_title').first().mousedown(function (e) {
            if (e.which == 3) {
                if (!_me.isSelected(this)) {
                    _me.selectItem(this);
                }
            }
        });
        
        $(n).find('input[type="checkbox"]').first().each(function (i, n) {
            $(n).click(function () {
                var cbx = $(this);
                var uiNode = cbx.parent().parent().parent().parent().parent().parent();
                _rebuildUINodeForCheckbox(uiNode);
            });
        });
    }

    this.rebuildUI = function () {
        
        _preSelecteds = [];
        _preCheckeds = [];
        _panel.find('.cs_ui_tree_item').each(function (i, n) {
            if ($(n).children().first().find('input[type="checkbox"]').first()[0].checked && $(n).children().first().find('input[type="checkbox"]').first()[0].disabled == false) {
                _preCheckeds.push($(n)[0].datacontext);
            }
            if ($(n).hasClass('cs_ui_tree_item_selected')) {
                _preSelecteds.push($(n)[0].datacontext);
            }
        });
        
        _panel.children().remove();

        if (_data != null && _data.length > 0) {
            var hasNotInsertCount = 0;
            while (!_allDataHasInsert) {
                var hasInsert = _autoInsertItemByData();
                if (!hasInsert) {
                    hasNotInsertCount++;
                }

                if (hasNotInsertCount > 3) {
                    //csui.log('多次未插入项目，则自动取消');
                    break;
                }
            }
            for (var i = 0; i < _data.length; i++) {
                delete _data[i].hasInsert;
            }

            _panel.find('.cs_ui_tree_item').each(function (i, n) {
                rebuildNode(n);
            });
            
            //            _panel.find('.cs_ui_tree_item_head').each(function (i, n) {
            //                if (cfg.startFoldLevel != null) {
            //                    var item = $(n).parent();
            //                    if (item.attr('level') >= cfg.startFoldLevel) {
            //                        _zdOrZk(item, true);
            //                    }
            //                }
            //            });
            _me.resize();
            
            _panel.find('.cs_ui_tree_item').each(function (i, n) {
                if (_isPreSelectedByDC($(n)[0].datacontext)) {
                    _selectItem($(n), 'restorePreSelected');
                }
                if (_isPreCheckedByDC($(n)[0].datacontext)) {
                    $(n).children().first().find('input[type="checkbox"]').first()[0].checked = true;
                    _rebuildUINodeForCheckbox($(n));
                }
            });
        }
    };

    this.init = function () {
        _me.buildUI();
    };

    this.setData = function (val) {
        _allDataHasInsert = false;
        var t = JSON.parse(JSON.stringify(val));
        if (cfg.showRootNode == true) {
            var node = {};
            node[cfg.idFieldName] = cfg.rootId;
            node[cfg.titleFieldName] = cfg.rootTitle;
            node[cfg.parentIdFieldName] = '{NoParent}';
            t.splice(0, 0, node);

            _rootId = '{NoParent}';
        }
        else {
            _rootId = cfg.rootId;
        }
        if (cfg.childFieldName != null) {
            _data = [];
            _convertTreeDataToListData(t, _data);
        }
        else {
            _data = t;
        }

        if (t.length == 0) {
            _allDataHasInsert = true;
        }

        _me.rebuildUI();
    };

    this.setHeight = function (v) {
        if (v != null) {
            _panel.css('overflow-y', 'auto');
        }
        else {
            _panel.css('overflow-y', 'none');
        }
        _panel.height(v);
    };

    this.loadData = function (pars, callback) {

        if (cfg.onPreLoadDataFunc != null) {
            cfg.onPreLoadDataFunc();
        }

        if (cfg.dataSource != null) {
            if (pars == null) {
                pars = {};
            }

            if (cfg.dataSource.getParsFunc != null) {
                var t = cfg.dataSource.getParsFunc();
                for (var pro in t) {
                    pars[pro] = t[pro];
                }
            }

            $.post(cfg.dataSource.url, pars).done(function (txt) {
                var r = eval('(' + txt + ')');

                _me.setData(r.data);

                if (callback != null) {
                    callback(_me, r);
                }

                if (cfg.onLoadDataFunc != null) {
                    cfg.onLoadDataFunc(_me, r.data);
                }
            });
        }
    };

    this.getSelectedItem = function () {
        var selected = null;
        _panel.find('.cs_ui_tree_item').each(function (i, n) {
            if (cfg.allowMultiChecked == true && $(n).children().first().find('input[type="checkbox"]').first()[0].checked == true && n.datacontext[cfg.parentIdFieldName] != '{NoParent}') {
                selected = n.datacontext;
                return false;
            }
            else {
                if ($(n).hasClass('cs_ui_tree_item_selected')) {
                    selected = n.datacontext;
                    return false;
                }
            }
        });

        return selected;
    };
    
    this.getSelectedItems = function () {
        var selecteds = [];
        _panel.find('.cs_ui_tree_item').each(function (i, n) {
            if (cfg.onlyGetLeafNode != true || _isUINodeHasChild($(n)) == false) {
                if (cfg.allowMultiChecked == true) {
                    if ($(n).children().first().find('input[type="checkbox"]').first()[0].checked == true) {
                        if (n.datacontext[cfg.parentIdFieldName] == '{NoParent}') {

                        }
                        else {
                            selecteds.push($(n)[0].datacontext);
                        }
                    }
                }
                else {
                    if ($(n).hasClass('cs_ui_tree_item_selected')) {
                        selecteds.push($(n)[0].datacontext);
                    }
                }
            }
        });

        return selecteds;
    };

    this.hasLoadData = function () {
        return _allDataHasInsert;
    };

    this.isSelected = function (tgt) {
        var item = $(tgt);
        if (cfg.allowMultiChecked == true) {
            return tgt.children().first().find('input[type="checkbox"]').first()[0].checked;
        }
        else {
            return item.hasClass('cs_ui_tree_item_title_selected');
        }
    };

    this.findItem = function (func) {
        var findItem = null;
        _panel.find('.cs_ui_tree_item').each(function (i, n) {
            if (func(n.datacontext)) {
                findItem = $(n);
            }
        });
        return findItem;
    };

    this.selectItem = function (tgt, from, callback) {
        if (_me.hasLoadData()) {
            if (tgt == null) {
            }
            else if (typeof tgt == 'function') {
                var func = tgt;
                _panel.find('.cs_ui_tree_item').each(function (i, n) {
                    if (func(n.datacontext)) {
                        if (cfg.allowMultiChecked == true) {
                            _selectCheckbox($(n));
                        }
                        else {
                            _selectItem($(n), from);
                        }
                    }
                });
            }
            else if ($(tgt).hasClass('cs_ui_tree_item_title')) {
                var item = $(tgt).parent().parent().parent().parent().parent();
                if (cfg.allowMultiChecked == false && cfg.onlyGetLeafNode == true && !_isUINodeHasChild(item)) {
                    
                    _selectItem(item, from);
                }
                else if (cfg.allowMultiChecked == true || cfg.onlyGetLeafNode == false) {
                    _selectItem(item, from);
                }
            }
            else {
                _selectItem(tgt, from);
            }

            if (callback != null) {
                callback();
            }
        }
        else {
            csui.log('(tree)等待重新选中...');
            setTimeout(function () {
                _me.selectItem(tgt, from, callback);
            }, 600);
        }
    };

    var _selectItemByPathCount = 0;
    this.selectItemByPath = function (path, callback) {
        if (_selectItemByPathCount > 30) {
            csui.log('selectItemByPath超过最大搜寻次数');
        }
        else {
            _selectItemByPathCount++;
            if (_me.hasLoadData()) {
                var zkTgt = false;
                var t = path;
                if (t.indexOf('{zkTgt}') != -1) {
                    zkTgt = true;
                    t = t.replace('{zkTgt}', '');
                }
                if (t[0] == '|') {
                    t = t.substr(1);
                }
                if (t[t.length - 1] == '|') {
                    t = t.substr(0, t.length - 1);
                }
                var ids = t.split('|');
                var tgtId = ids[ids.length - 1];
                //展开父级
                var hasFind = false;
                _panel.find('.cs_ui_tree_item').each(function (i, n) {
                    var pNode = _getParentNode($(n));
                    if (path.toUpperCase().indexOf(n.datacontext[cfg.idFieldName].toUpperCase()) != -1 && pNode != null && _isZD(pNode)) {
                        hasFind = true;
                        _zdOrZk(pNode, null, function () {
                            _me.selectItemByPath(path, callback);
                        });
                        return false;
                    }
                    if (path.toUpperCase().indexOf(n.datacontext[cfg.idFieldName].toUpperCase()) != -1 && _isZD($(n)) && (zkTgt == true || tgtId.toUpperCase() != n.datacontext[cfg.idFieldName].toUpperCase())) {
                        hasFind = true;
                        _zdOrZk($(n), null, function () {
                            _me.selectItemByPath(path, callback);
                        });
                        return false;
                    }
                });
                //定位并选中目标项目
                if (!hasFind) {
                    hasFind = false;
                    _panel.find('.cs_ui_tree_item').each(function (i, n) {
                        if (n.datacontext[cfg.idFieldName].toUpperCase() == tgtId.toUpperCase()) {
                            hasFind = true;
                            _selectItem($(n));
                            return false;
                        }
                    });
                    //如果没找到目标，再次展开本节点
                    if (!hasFind) {
                        hasFind = false;
                        _panel.find('.cs_ui_tree_item').each(function (i, n) {
                            if (path.toUpperCase().indexOf(n.datacontext[cfg.idFieldName].toUpperCase()) != -1 && _isZD($(n))) {
                                hasFind = true;
                                _zdOrZk($(n), null, function () {
                                    _me.selectItemByPath(path, callback);
                                });
                                return false;
                            }
                        });
                    }
                    else {
                        _selectItemByPathCount = 0;
                        if (callback != null) {
                            callback();
                        }
                    }
                }
            }
            else {
                csui.log('(tree)等待重新选中...');
                setTimeout(function () {
                    _me.selectItemByPath(path, callback);
                }, 600);
            }
        }
    };
    
    this.cancelAllSelectItems = function (notrigger) {
        var findCount = 0;
        _panel.find('.cs_ui_tree_item_selected').each(function (i, n) {
            findCount++;
            $(n).removeClass('cs_ui_tree_item_selected');
            $(n).find('div').first().removeClass('cs_ui_tree_item_selected_firstDiv');
            $(n).find('.cs_ui_tree_item_title').removeClass('cs_ui_tree_item_title_selected');

            if (notrigger != true && findCount > 0) {
                if (cfg.allowMultiChecked == false) {
                    if (cfg.onSelectedChange != null) {
                        cfg.onSelectedChange(_me, n.datacontext, $(n), false);
                    }
                }
            }
        });
    };

    this.clear = function () {
        _selectItem(null);
        _selectCheckbox(null);
    };
    this.isZK = function (item) {
        return _isZK(item);
    };
    this.isZD = function (item) {
        return _isZD(item);
    }
    
    this.zdOrZk = function (item, noResize, callback) {
        _zdOrZk(item, noResize, callback);
    };

    function _hasChild(node) {
        return $(node).find('.cs_ui_tree_children').first().children().length > 0;
    }

    function _findYourItemNode(el) {
        var t = $(el).parent();
        for (var i = 0; i < 99; i++) {
            if (t.hasClass('cs_ui_tree_item')) {
                return t;
            }
            t = t.parent();
        }
        return null;
    }
    
    function _findRootItem(item) {
        if (item == null) {
            return item;
        }
        else if (item[cfg.parentIdFieldName].toUpperCase() == _rootId.toUpperCase()) {
            return item;
        }
        else {
            for (var i = 0; i < _data.length; i++) {
                if (_data[i][cfg.idFieldName].toUpperCase() == item[cfg.parentIdFieldName].toUpperCase()) {
                    return _findRootItem(_data[i]);
                }
            }
            return null;
        }
    }
    var lastRootItem;
    
    function _autoInsertItemByData() {
        if (_data.length > 0) {
            var oldHasInsertCount = 0;
            var hasInsertCount = 0;
            var totalRootItemCount = 0;
            var curAddRootItemCount = 0;
            
            for (var i = 0; i < _data.length; i++) {
                var item = _data[i];
                if (item[cfg.parentIdFieldName].toUpperCase() == _rootId.toUpperCase()) {
                    totalRootItemCount++;
                }
            }
            
            for (var i = 0; i < _data.length; i++) {
                var item = _data[i];
                if (item[cfg.parentIdFieldName].toUpperCase() == _rootId.toUpperCase()) {
                    curAddRootItemCount++;
                    if (curAddRootItemCount == totalRootItemCount) {
                        lastRootItem = item;
                        break;
                    }
                }
            }

            for (var i = 0; i < _data.length; i++) {
                var item = _data[i];
                if (item.hasInsert != true) {
                    var itemUI;
                    if (item[cfg.parentIdFieldName].toUpperCase() == _rootId.toUpperCase()) {
                        
                        item.hasInsert = true;
                        item.cs_isRoot = true;
                        hasInsertCount++;
                        itemUI = $('<div id="cs_ui_tree_item_' + item[cfg.idFieldName].toUpperCase() + '" pid="cs_ui_tree_item_' + item[cfg.parentIdFieldName].toUpperCase() + '" level="0" class="cs_ui_tree_item cs_ui_tree_item_hidden"><div class="cs_ui_tree_item_head"><table><tr><td class="cs_ui_tree_item_prefix"><div class="cs_ui_tree_item_prefix_clickArea"></div><div style="clear:both"></div></td><td class="cs_ui_tree_item_icon">' + cfg.getIconFunc(_me, item, 0) + '</td><td class="cs_ui_tree_item_checkedBtn" style="' + _checkedBtnStyle + '"><input type="checkbox"/></td><td class="cs_ui_tree_item_title">' + item[cfg.titleFieldName] + '</td><tr></table></div><div class="cs_ui_tree_children" style="display:none;"></div></div>');
                        itemUI[0].datacontext = item;

                        if (cfg.onBuildItem != null) {
                            _panel.append(cfg.onBuildItem(_me, item, itemUI));
                        }
                        else {
                            _panel.append(itemUI);
                        }
                    }
                    else {
                        
                        var findData = _panel.find('.cs_ui_tree_item[id="cs_ui_tree_item_' + item[cfg.parentIdFieldName].toUpperCase() + '"]');
                        if (findData.length > 0) {
                            var pItemUI = findData.first();
                            var level = parseInt(pItemUI.attr('level')) + 1;
                            item.hasInsert = true;
                            hasInsertCount++;

                            var prefix = '';
                            for (var r = 0; r < level; r++) {
                                var rootItemDc = null;
                                if (pItemUI[0].datacontext.cs_isRoot == true) {
                                    rootItemDc = pItemUI[0].datacontext;
                                }
                                else {
                                    rootItemDc = pItemUI[0].datacontext.cs_rootItemDc;
                                }
                                item.cs_rootItemDc = rootItemDc;
                                if (r == 0 && rootItemDc[cfg.idFieldName].toUpperCase() == lastRootItem[cfg.idFieldName].toUpperCase()) {
                                    //if (r == 0 && _findRootItem(pItemUI[0].datacontext)[cfg.idFieldName].toUpperCase() == lastRootItem[cfg.idFieldName].toUpperCase()) {
                                    
                                    prefix += '<div class="cs_ui_tree_item_prefix_4">&nbsp;</div>';
                                }
                                else {
                                    prefix += '<div class="cs_ui_tree_item_prefix_1">&nbsp;</div>';
                                }
                            }
                            prefix += '<div class="cs_ui_tree_item_prefix_clickArea"></div>';

                            itemUI = $('<div id="cs_ui_tree_item_' + item[cfg.idFieldName].toUpperCase() + '" pid="cs_ui_tree_item_' + item[cfg.parentIdFieldName].toUpperCase() + '" level="' + level + '" class="cs_ui_tree_item cs_ui_tree_item_hidden"><div class="cs_ui_tree_item_head"><table><tr><td class="cs_ui_tree_item_prefix">' + prefix + '<div style="clear:both"></div></td><td class="cs_ui_tree_item_icon">' + cfg.getIconFunc(_me, item, level) + '</td><td class="cs_ui_tree_item_checkedBtn" style="' + _checkedBtnStyle + '"><input type="checkbox"/></td><td class="cs_ui_tree_item_title" onselectstart="return false;">' + item[cfg.titleFieldName] + '</td></tr></table></div><div class="cs_ui_tree_children" style="display:none;"></div></div>');
                            itemUI[0].datacontext = item;

                            if (pItemUI[0].datacontext.childCount == null) {
                                pItemUI[0].datacontext.childCount = 1;
                            }
                            else {
                                pItemUI[0].datacontext.childCount++;
                            }

                            if (cfg.onBuildItem != null) {
                                pItemUI.find('.cs_ui_tree_children').first().append(cfg.onBuildItem(_me, item, itemUI));
                            }
                            else {
                                pItemUI.find('.cs_ui_tree_children').first().append(itemUI);
                            }
                        }
                    }


                    if (cfg.contextMenuItems != null && cfg.contextMenuItems.length > 0 && itemUI != null) {
                        var rightMenuItems = [];
                        rightMenuItems = cfg.contextMenuItems;
                        var csuicm = new CSUIContextMenu({});
                        csuicm.attach(itemUI.find('.cs_ui_tree_item_title'), rightMenuItems);
                    }
                }
                else {
                    oldHasInsertCount++;
                }
            }
            //去除已插入的
            var t_arr = [];
            for (var i = 0; i < _data.length; i++) {
                if (_data[i].hasInsert != true) {
                    t_arr.push(_data[i]);
                }
            }
            _data = t_arr;

            if (oldHasInsertCount == _data.length) {
                _allDataHasInsert = true;
            }

            return hasInsertCount > 0;
        }
        return false;
    }
    
    function _zdOrZk(item, noResize, callback) {
        var item = $(item);
        var type = '';
        if (item.hasClass('cs_ui_tree_item_hidden')) {
            item.removeClass('cs_ui_tree_item_hidden');
            item.find('.cs_ui_tree_item_btn').first().html(_toFoldBtnHtml);
            item.find('.cs_ui_tree_children').first().show();
            //item.find('.cs_ui_tree_children').first().css('visibility', 'visible');
            //item.find('.cs_ui_tree_children').first().css('height', '');
            type = 'zk';

            if (cfg.allowAutoLoadChild == true && !_hasChild(item)) {
                var n = $(item);
                if (n[0].datacontext.hasLoadChild == null) {
                    n[0].datacontext.hasLoadChild = true;
                    var t_pars = {};
                    t_pars[cfg.loadChildDataSource.pidToFieldName] = n[0].datacontext[cfg.loadChildDataSource.pidFromFieldName];
                    t_pars[cfg.loadChildDataSource.pidTypeToFieldName] = n[0].datacontext[cfg.loadChildDataSource.pidTypeFromFieldName];
                    var t_curProcNode = n;
                    $(t_curProcNode).find('.cs_ui_tree_item_title').first().html($(t_curProcNode).find('.cs_ui_tree_item_title').first().html() + '<span class="loading_bar" style="color:red;">(loading...)</span>')
                    csui.reqByCmd(cfg.loadChildDataSource.cmd, t_pars, function (r) {
                        if (r.success == true) {
                            _data = r.data;
                            if (r.data.length > 0) {
                                _allDataHasInsert = false;
                                var hasNotInsertCount = 0;
                                while (!_allDataHasInsert) {
                                    var hasInsert = _autoInsertItemByData();
                                    if (!hasInsert) {
                                        hasNotInsertCount++;
                                    }

                                    if (hasNotInsertCount > 3) {
                                        _allDataHasInsert = true;
                                        csui.log('多次未插入项目，则自动取消');
                                        break;
                                    }
                                }
                                for (var i = 0; i < _data.length; i++) {
                                    delete _data[i].hasInsert;
                                }
                                $(t_curProcNode).find('.cs_ui_tree_item').each(function (i, n) {
                                    rebuildNode(n);
                                    resizeNode(n);
                                });
                            }
                            else {
                                _allDataHasInsert = true;
                            }
                            $(t_curProcNode).find('.cs_ui_tree_item_title').find('.loading_bar').remove();

                            if (noResize != true) {
                                _me.resize();
                            }
                            if (cfg.onZDOrZK != null) {
                                cfg.onZDOrZK(_me, type, item);
                            }

                            if (callback != null) {
                                callback();
                            }
                        }
                    }, cfg.loadChildDataSource.url);
                }
                else {
                    if (noResize != true) {
                        _me.resize();
                    }
                    if (cfg.onZDOrZK != null) {
                        cfg.onZDOrZK(_me, type, item);
                    }

                    if (callback != null) {
                        callback();
                    }
                }
            }
            else {
                if (noResize != true) {
                    _me.resize();
                }
                if (cfg.onZDOrZK != null) {
                    cfg.onZDOrZK(_me, type, item);
                }

                if (callback != null) {
                    callback();
                }
            }
        }
        else {
            item.addClass('cs_ui_tree_item_hidden');
            item.find('.cs_ui_tree_item_btn').first().html(_toUnfoldBtnHtml);
            item.find('.cs_ui_tree_children').first().hide();
            //item.find('.cs_ui_tree_children').first().css('visibility', 'collapse');
            //item.find('.cs_ui_tree_children').first().css('height', 0);
            type = 'zd';

            if (noResize != true) {
                _me.resize();
            }
            if (cfg.onZDOrZK != null) {
                cfg.onZDOrZK(_me, type, item);
            }

            if (callback != null) {
                callback();
            }
        }
    }

    function _isZD(item) {
        if ($(item).hasClass('cs_ui_tree_item_hidden')) {
            return true;
        }
        return false;
    }

    function _isZK(item) {
        if ($(item).hasClass('cs_ui_tree_item_hidden')) {
            return false;
        }
        return true;
    }

    function _rebuildUINodeForCheckbox(uiNode) {
        var cbx = _getUINodeCheckbox(uiNode);
        _setNodeCheckbox(uiNode, cbx[0].checked);
        _setNodeHalfCheckbox(_getParentUINode(uiNode));
    }

    function _getParentUINode(uiNode) {
        var parent = uiNode.parent();
        if (parent != null && parent.hasClass('cs_ui_tree_children')) {
            return parent.parent();
        }
        else {
            return null;
        }
    }

    function _getUINodeCheckbox(uiNode) {
        return uiNode.find('.cs_ui_tree_item_head').first().find('input[type="checkbox"]');
    }

    function _isUINodeHasChild(uiNode) {
        var chilItems = uiNode.find('.cs_ui_tree_children').children();
        if (chilItems.length > 0) {
            return true;
        }
        return false;
    }
    
    function _setNodeCheckbox(uiNode, value) {
        var cbx = uiNode.find('.cs_ui_tree_item_head').first().find('input[type="checkbox"]');
        cbx[0].checked = value;
        var chilItems = uiNode.find('.cs_ui_tree_children').children();
        if (chilItems.length > 0) {
            chilItems.each(function (i, n) {
                _setNodeCheckbox($(n), value);
            });
        }
    }
    
    function _setNodeHalfCheckbox(uiNode) {
        if (uiNode != null) {
            var cbx = uiNode.find('.cs_ui_tree_item_head').first().find('input[type="checkbox"]');
            var chilItems = uiNode.find('.cs_ui_tree_children').children();
            if (chilItems.length > 0) {
                var isAllChecked = true;
                var isNoChecked = true;
                chilItems.each(function (i, n) {
                    var t_cbx = _getUINodeCheckbox($(n));
                    if (t_cbx[0].checked == true && t_cbx[0].disabled == true) {
                        isAllChecked = false;
                        isNoChecked = false;
                    }
                    else if (t_cbx[0].checked == false) {
                        isAllChecked = false;
                    }
                    else if (t_cbx[0].checked == true) {
                        isNoChecked = false;
                    }
                });
                if (isAllChecked) {
                    _getUINodeCheckbox(uiNode)[0].checked = true;
                    _getUINodeCheckbox(uiNode)[0].disabled = false;
                }
                else if (isNoChecked) {
                    _getUINodeCheckbox(uiNode)[0].checked = false;
                    _getUINodeCheckbox(uiNode)[0].disabled = false;
                }
                else {
                    _getUINodeCheckbox(uiNode)[0].checked = true;
                    _getUINodeCheckbox(uiNode)[0].disabled = true;
                }
            }

            var parent = _getParentUINode(uiNode);
            if (parent != null) {
                _setNodeHalfCheckbox(parent);
            }
        }
    }

    function _selectItem(uiNode, from) {
        var t_p = _getParentNode(uiNode);
        if (t_p != null) {
            if (_isZD(t_p)) {
                _zdOrZk(t_p);
            }
        }
        if (uiNode != null && uiNode.hasClass('cs_ui_tree_item_selected')) {
            
            if (cfg.allowCancelSelected == true) {
                uiNode.removeClass('cs_ui_tree_item_selected');
                uiNode.find('div').first().removeClass('cs_ui_tree_item_selected_firstDiv');
                uiNode.find('.cs_ui_tree_item_title').removeClass('cs_ui_tree_item_title_selected');

                if (cfg.allowMultiChecked == false && from != 'restorePreSelected') {
                    if (cfg.onSelectedChange != null) {
                        cfg.onSelectedChange(_me, uiNode[0].datacontext, uiNode, false);
                    }
                }
            }
        }
        else {
            
            var oldHasSelectedCount = _panel.find('.cs_ui_tree_item_selected').length;

            _panel.find('.cs_ui_tree_item').removeClass('cs_ui_tree_item_selected');
            _panel.find('.cs_ui_tree_item_selected_firstDiv').removeClass('cs_ui_tree_item_selected_firstDiv');
            _panel.find('.cs_ui_tree_item_title').removeClass('cs_ui_tree_item_title_selected');

            if (uiNode != null) {
                uiNode.addClass('cs_ui_tree_item_selected');
                uiNode.find('div').first().addClass('cs_ui_tree_item_selected_firstDiv');
                uiNode.find('.cs_ui_tree_item_title').first().addClass('cs_ui_tree_item_title_selected');

                if (cfg.allowMultiChecked == false && from != 'restorePreSelected') {
                    if (cfg.onSelectedChange != null) {
                        cfg.onSelectedChange(_me, uiNode[0].datacontext, uiNode, true);
                    }
                }
            }
            else {
                
                if (oldHasSelectedCount > 0) {
                    if (cfg.allowMultiChecked == false && from != 'restorePreSelected') {
                        if (cfg.onSelectedChange != null) {
                            cfg.onSelectedChange(_me, null, uiNode, true);
                        }
                    }
                }
            }
        }
    }

    function _selectCheckbox(uiNode, from) {
        if (uiNode == null) {
            _panel.find('.cs_ui_tree_item').each(function (i, n) {
                _getUINodeCheckbox($(n))[0].checked = false;
            });
        }
        else {
            _getUINodeCheckbox(uiNode)[0].checked = true;
            _rebuildUINodeForCheckbox(uiNode);
        }
    }

    function _getParentNode(item) {
        if (item != null) {
            var t = item;
            for (var i = 0; i < 100; i++) {
                t = t.parent();
                if (t.hasClass('cs_ui_tree_item')) {
                    hasFind = true;
                    return t;
                }
                else if (t.hasClass('cs_ui_tree_panel')) {
                    return null;
                }
            }
            csui.log('超过最大向上搜寻次数');
        }
        return null;
    }

    function _convertTreeDataToListData(treeData, listData) {
        if (treeData != null && treeData.length > 0) {
            for (var i = 0; i < treeData.length; i++) {
                listData.push(treeData[i]);
                if (cfg.childFieldName != null) {
                    _convertTreeDataToListData(treeData[i][cfg.childFieldName], listData);
                }
            }
        }
    }

    function _isSameDatacontext(dc1, dc2) {
        for (var prop in dc1) {
            if (dc1[prop] != dc2[prop]) {
                return false;
            }
        }
        return true;
    }

    function _isPreSelectedByDC(dc) {
        for (var i = 0; i < _preSelecteds.length; i++) {
            var item = _preSelecteds[i];
            if (_isSameDatacontext(item, dc)) {
                return true;
            }
        }
        return false;
    }

    function _isPreCheckedByDC(dc) {
        for (var i = 0; i < _preCheckeds.length; i++) {
            var item = _preCheckeds[i];
            if (_isSameDatacontext(item, dc)) {
                return true;
            }
        }
        return false;
    }
}/*res CSUI*/
