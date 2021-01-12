/// <reference path="../jq/jquery-1.11.2.min.js" />
/*
//设置鼠标悬浮定位类型
overflowTriggerPositionType:null
allowHeader:true
allowCancelSelected:false
allowMultiSelected:false
allowRadioMode（多选模式下才有效）
isSameRadioGroupFunc(objA,objB)
onLoadDataAndBeforeRebuildFunc(self, data)
onLoadDataFunc(self, data, r)
onBuildBodyCell:function(self, dc, ui){return ui;}
onBuildBodyRow:function(self, dc, ui){return ui;}
onRebuildFunc:function(self){}
//能中途控制不选中
onSelectedChange:function(self, dc, ui, selected){}
//选择完毕后触发
onSelectedChanged:function(self, dc, ui, selected){}
//点击行触发
onItemClick:function(self, dc, ui){}
//触发排序
onOrderBy:function(self, orderBy){}
*/
function CSUIDataGrid(cfg) {
    var _me = this;
    var _renderTo = cfg.renderTo;
    var _hasInit = false;
    var _panel;
    var _panel_head;
    var _panel_body;
    var _panel_foot;
    var _pager;

    var _data = cfg.data;
    var _loadedData;
    var _totalRowCount = 0;
    var _columns = cfg.columns;
    var _style = cfg.style;
    var _allowHSplitLine = true;
    var _hSplitLineStyle = '';
    var _vSplitLineStyle = '';
    var _allowHeader = true;
    var _allowAutoRebuild = true;
    var _selectedItemDC = null;

    var _resizeThread = null;

    var _orderBy = { n: '', d: '' };

    {
        if (cfg.allowHeader != null) {
            _allowHeader = cfg.allowHeader;
        }
        if (cfg.hSplitLineStyle != null) {
            _hSplitLineStyle = cfg.hSplitLineStyle;
        }
        if (cfg.vSplitLineStyle != null) {
            _vSplitLineStyle = cfg.vSplitLineStyle;
        }
        if (cfg.allowAutoRebuild != null) {
            _allowAutoRebuild = cfg.allowAutoRebuild;
        }
        if (cfg.allowCheckBox == null) {
            cfg.allowCheckBox = true;
        }
    }

    this.getUICore = function () {
        return _panel;
    };

    this.buildUI = function () {
        _panel = $('<div class="cs_ui_grid_panel" style="text-align:center;' + _style + '" cellspacing="0" cellpadding="0"><div class="cs_ui_grid_head_container"><table class="cs_ui_grid_head_panel" style="text-align:center;"></table></div><div class="cs_ui_grid_body_container"><table class="cs_ui_grid_body_panel" style="text-align:center;"></table></div><div class="cs_ui_grid_foot_panel" style="text-align:center;"></div></div>');
        _panel_head = _panel.find('.cs_ui_grid_head_panel');
        _panel_body = _panel.find('.cs_ui_grid_body_panel');
        _panel_foot = _panel.find('.cs_ui_grid_foot_panel');

        _panel.find('.cs_ui_grid_body_container').scroll(function () {
            var t = $(this);
            setTimeout(function () {
                _panel.find('.cs_ui_grid_head_container').scrollLeft(t.scrollLeft());
            }, 30);
        });

        if (_panel != null && _renderTo != null) {
            $(_renderTo).append(_panel);
        }
    };

    this.rebuildUI = function () {
        if (_hasInit) {
            _panel_head.children().remove();
            _panel_body.children().remove();
            _panel_foot.children().remove();
            _panel.find('.cs_ui_mouseHoverPanel').remove();

            if (_pager != null) {
                _pager.buildUI();
            }

            if (_allowHeader) {
                var headerRow = $('<tr class="cs_ui_grid_headerRow"></tr>');
                if (cfg.allowCheckBox && cfg.allowMultiSelected) {
                    var headerCell = $('<td class="cs_ui_grid_headerItemCell cs_ui_grid_col_check" style="min-width:38px;"><input type="checkbox" /></td>');
                    headerCell.find('input').click(function (e) {
                        //e.preventDefault();
                        e.stopPropagation();
                        if ($(this)[0].checked == true) {
                            
                            _panel_body.find('.cs_ui_grid_bodyRow').each(function (i, n) {
                                if (!$(n).hasClass('cs_ui_grid_bodyRowSelected') && !$(n).hasClass('cs_ui_grid_bodyRowFoot')) {
                                    _me.selectItemByRow($(n));
                                }
                            });
                        }
                        else {
                            
                            _panel_body.find('.cs_ui_grid_bodyRow').each(function (i, n) {
                                if ($(n).hasClass('cs_ui_grid_bodyRowSelected') && !$(n).hasClass('cs_ui_grid_bodyRowFoot')) {
                                    _me.selectItemByRow($(n));
                                }
                            });
                        }
                    });
                    headerCell.click(function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        if ($(this).find('input')[0].checked == false) {
                            
                            _panel_body.find('.cs_ui_grid_bodyRow').each(function (i, n) {
                                if (!$(n).hasClass('cs_ui_grid_bodyRowSelected') && !$(n).hasClass('cs_ui_grid_bodyRowFoot')) {
                                    _me.selectItemByRow($(n));
                                }
                            });
                            $(this).find('input')[0].checked = true;
                        }
                        else {
                            
                            _panel_body.find('.cs_ui_grid_bodyRow').each(function (i, n) {
                                if ($(n).hasClass('cs_ui_grid_bodyRowSelected') && !$(n).hasClass('cs_ui_grid_bodyRowFoot')) {
                                    _me.selectItemByRow($(n));
                                }
                            });
                            $(this).find('input')[0].checked = false;
                        }
                    });
                    headerRow.append(headerCell);
                }
                for (var c = 0; c < _columns.length; c++) {
                    var headerCell = $('<td class="cs_ui_grid_headerItemCell cs_ui_grid_col' + c + ' cs_ui_grid_row0" ' + (_columns[c].flex != null ? 'flex=' + _columns[c].flex : '') + ' style="white-space:pre-wrap; word-wrap:break-word; text-align:center; ' + (c == _columns.length - 1 ? '/*border-right:0px;*/' : '') + (_columns[c].headerStyle != '' ? _columns[c].headerStyle + ';' : '') + (_columns[c].style != '' ? _columns[c].style + ';' : '') + '"><div style="padding-left:6px; padding-right:6px; overflow:hidden; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + _columns[c].title + '<span class="orderByTag"></span></div></td>');

                    if (headerCell[0].style.width != '' && headerCell[0].style.minWidth == '') {
                        headerCell.css('min-width', headerCell.css('width'));
                    }

                    if (_columns[c].orderBy != null && _columns[c].orderBy.isMyClickOrder == true) {
                        if (_columns[c].orderBy.d == 'asc') {
                            headerCell.find('.orderByTag').html('&nbsp;&uarr;');
                        }
                        else {
                            headerCell.find('.orderByTag').html('&nbsp;&darr;');
                        }
                    }

                    if (_columns[c].orderBy != null) {
                        headerCell[0].orderBy = _columns[c].orderBy;
                        headerCell.css('cursor', 'pointer');
                        headerCell.click(function () {
                            if (cfg.onOrderBy != null) {
                                _panel_head.find('.orderByTag').html('');
                                for (var d = 0; d < _columns.length; d++) {
                                    if (_columns[d].orderBy != null && _columns[d].orderBy != this.orderBy) {
                                        _columns[d].orderBy.hasUseFirstD = null;
                                    }
                                }

                                _panel_head.find('.cs_ui_grid_headerItemCell').each(function (i, n) {
                                    if (n.orderBy != null) {
                                        n.isMyClickOrder = null;
                                    }
                                });
                                this.orderBy.isMyClickOrder = true;

                                if (this.orderBy.firstD != null && this.orderBy.hasUseFirstD != true) {
                                    this.orderBy.d = this.orderBy.firstD;
                                    this.orderBy.hasUseFirstD = true;
                                }
                                else {
                                    if (this.orderBy.d == null || this.orderBy.d == '') {
                                        this.orderBy.d = 'asc'
                                    }
                                    else {
                                        if (this.orderBy.d == 'desc') {
                                            this.orderBy.d = 'asc';
                                        }
                                        else {
                                            this.orderBy.d = 'desc';
                                        }
                                    }
                                }

                                if (this.orderBy.d == 'asc') {
                                    $(this).find('.orderByTag').html('&nbsp;&uarr;');
                                }
                                else {
                                    $(this).find('.orderByTag').html('&nbsp;&darr;');
                                }

                                cfg.onOrderBy(_me, this.orderBy);

                            }
                        });
                    }

                    headerRow.append(headerCell);
                }
                var headerCell = $('<td class="cs_ui_grid_headerItemCellLast" ' + ' style="">&nbsp;</td>');
                headerRow.append(headerCell);
                var headerCell = $('<td class="cs_ui_grid_headerItemCellLast" ' + ' style="min-width:30px;">&nbsp;</td>');
                headerRow.append(headerCell);
                _panel_head.append(headerRow);
            }

            if (_data != null && _data.length > 0) {
                var hasFoot = false;
                var hasFindNeedSelectItemRow = false;
                for (var i = 0; i < _data.length; i++) {
                    var itemRow = $('<tr class="cs_ui_grid_bodyRow' + (i % 2 == 0 ? ' cs_ui_grid_bodyRow2' : '') + '"></tr>');
                    itemRow[0].datacontext = _data[i];
                    if (_selectedItemDC != null && _data[i] == _selectedItemDC) {
                        itemRow.addClass('cs_ui_grid_bodyRowSelected');
                        hasFindNeedSelectItemRow = true;
                    }

                    if (cfg.allowCheckBox && cfg.allowMultiSelected) {
                        var itemCell = $('<td class="cs_ui_grid_bodyItemCell cs_ui_grid_col_check" style="min-width:38px;"><input type="checkbox" /></td>');
                        itemCell.find('input').click(function (e) {
                            //e.preventDefault();
                            e.stopPropagation();
                            _me.selectItemByRow($(this).parent().parent());

                            if ((cfg.allowCancelSelected == null || cfg.allowCancelSelected == false) && this.checked == false) {
                                this.checked = true;
                            }
                        });
                        itemCell.click(function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            _me.selectItemByRow($(this).parent());
                        });
                        itemRow.append(itemCell);
                    }

                    for (var c = 0; c < _columns.length; c++) {
                        if (!hasFoot && _columns[c].tpl_func_foot != null) {
                            hasFoot = true;
                            break;
                        }
                    }

                    for (var c = 0; c < _columns.length; c++) {
                        var tpl = _columns[c].tpl;
                        if (_columns[c].tpl_func != null) {
                            tpl = _columns[c].tpl_func(_data[i], (i + 1));
                        }
                        else {
                            for (var pro in _data[i]) {
                                var value = _data[i][pro];
                                if (value != null) {
                                    if (value.toString().match(/(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})/) != null) {
                                        value = value.toString().replace('T', ' ');
                                    }
                                }
                                while (tpl.match('{' + pro + '}') != null) {
                                    tpl = tpl.replace('{' + pro + '}', value);
                                }
                            }
                        }

                        var itemCell = $('<td class="cs_ui_grid_bodyItemCell cs_ui_grid_col' + c + ' cs_ui_grid_row' + (i + 1) + '" ' + (_columns[c].flex != null ? 'flex=' + _columns[c].flex : '') + ' style="white-space:pre-wrap; word-wrap:break-word; ' + (!hasFoot && i == _data.length - 1 ? 'border-bottom:0px;' : '') + (c == _columns.length - 1 ? '/*border-right:0px;*/' : '') + (_columns[c].style != '' ? _columns[c].style + ';' : '') + '"><div style="padding-left:6px; padding-right:6px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + tpl + '</div></td>');
                        itemCell[0].selfData = _data[i];

                        if (cfg.onBuildBodyCell == null) {
                            itemRow.append(itemCell);
                        }
                        else {
                            itemRow.append(cfg.onBuildBodyCell(_me, _data[i], itemCell));
                        }
                    }
                    var itemCell = $('<td class="cs_ui_grid_bodyItemCellLast" style="' + (!hasFoot && i == _data.length - 1 ? 'border-bottom:0px;' : '') + '">&nbsp;</td>');
                    if (cfg.onBuildBodyCell == null) {
                        itemRow.append(itemCell);
                    }
                    else {
                        itemRow.append(cfg.onBuildBodyCell(_me, _data[i], itemCell));
                    }
                    
                    itemRow.find('td').each(function (i, n) {
                        if ($(n).hasClass('cs_ui_grid_col_check')) {

                        }
                        else if ($(n)[0].className.indexOf('cs_ui_grid_col') != -1) {
                            $(n).mousedown(function (e) {
                                if (e.button == 2) {
                                    if (!$(this).parent().hasClass('cs_ui_grid_bodyRowSelected')) {
                                        if (cfg.allowCheckBox && cfg.allowMultiSelected) {
                                            if (window.event != null && window.event.ctrlKey) {
                                            }
                                            else {
                                                //清空所有选中项
                                                _me.clear();
                                            }
                                        }
                                        _me.selectItemByRow($(this).parent());
                                    }
                                }
                                else {
                                    if (cfg.allowCheckBox && cfg.allowMultiSelected) {
                                        if (window.event != null && window.event.ctrlKey) {
                                        }
                                        else {
                                            //清空所有选中项
                                            _me.clear();
                                        }
                                    }
                                    _me.selectItemByRow($(this).parent());
                                }
                            });
                        }
                    });

                    if (cfg.onBuildBodyRow == null) {
                        _panel_body.append(itemRow);
                    }
                    else {
                        _panel_body.append(cfg.onBuildBodyRow(_me, _data[i], itemRow));
                    }
                }
                if (!hasFindNeedSelectItemRow) { _selectedItemDC = null; }
                
                if (hasFoot) {
                    var itemRow = $('<tr class="cs_ui_grid_bodyRow' + (_data.length % 2 == 0 ? ' cs_ui_grid_bodyRow2' : '') + ' cs_ui_grid_bodyRowFoot"></tr>');

                    if (cfg.allowCheckBox && cfg.allowMultiSelected) {
                        var headerCell = $('<td class="cs_ui_grid_bodyItemCell cs_ui_grid_col_check" ' + ' style="">&nbsp;</td>');
                        itemRow.append(headerCell);
                    }

                    for (var c = 0; c < _columns.length; c++) {
                        var tpl = '';
                        if (_columns[c].tpl_func_foot != null) {
                            tpl = _columns[c].tpl_func_foot(_me, _data, _loadedData);
                        }

                        var itemCell = $('<td class="cs_ui_grid_bodyItemCell cs_ui_grid_col' + c + ' cs_ui_grid_row' + (_data.length + 1) + '" ' + (_columns[c].flex != null ? 'flex=' + _columns[c].flex : '') + ' style="white-space:pre-wrap; word-wrap:break-word; border-bottom:0px;' + (c == _columns.length - 1 ? '/*border-right:0px;*/' : '') + (_columns[c].style != '' ? _columns[c].style + ';' : '') + '"><div style="padding-left:6px; padding-right:6px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + tpl + '</div></td>');

                        itemRow.append(itemCell);
                    }
                    var itemCell = $('<td class="cs_ui_grid_bodyItemCellLast" style="border-bottom:0px;">&nbsp;</td>');
                    itemRow.append(itemCell);
                    _panel_body.append(itemRow);
                }
            }

            if (cfg.allowPager == true) {
                var pagerRow = $('<div class="cs_ui_grid_pagerRow"></div>');
                var pagerCell = $('<div colspan="' + _columns.length + '"></div>');
                pagerCell.append(_pager.getUICore());
                pagerRow.append(pagerCell);
                _panel_foot.append(pagerRow);

                _pager.setTotalRowCount(_totalRowCount);
            }
            else {
                _panel_foot.hide();
            }

            if (cfg.height != null) {
                _me.setHeight(cfg.height, true);
            }
            if (cfg.maxHeight != null) {
                _me.setMaxHeight(cfg.maxHeight, true);
            }

            _me.resizeUI();

            if (cfg.onRebuildFunc != null) {
                cfg.onRebuildFunc(_me);
            }
        }
    };

    this.resizeUI = function () {
        var hasFlexCol = false;
        _panel_head.find('.cs_ui_grid_headerItemCell').each(function (i, n) {
            if ($(n).attr('flex') == '1' || $(n).attr('flex') == 'true') {
                hasFlexCol = true;
                return false;
            }
        });

        if (_data != null && _data.length > 0 && cfg.allowHeader != false) {
            
            if (cfg.allowCheckBox && cfg.allowMultiSelected) {
                var cell = _panel_head.find('.cs_ui_grid_col_check').first();
                var width = cell.width();
                _panel_body.find('.cs_ui_grid_col_check').each(function (i, n) {
                    $(n).width(width + 1);
                });
            }
            for (var c = 0; c < _columns.length; c++) {
                var cell = _panel_head.find('.cs_ui_grid_col' + c).first();
                var width = cell.width();
                
                //_panel_head.find('.cs_ui_grid_col' + c).first().css('width', width + 'px');
                
                _panel_body.find('.cs_ui_grid_col' + c).each(function (i, n) {
                    var div = $(n).find('div').first();
                    if (cfg.allowCheckBox && cfg.allowMultiSelected) {
                        $(n).width(width);
                    }
                    else if (c == 0) {
                        $(n).width(width + 1);
                    }
                    else {
                        $(n).width(width);
                    }
                    if (div[0] != null) {
                        div.width(width - parseFloat(div.css('padding-left')) - parseFloat(div.css('padding-right')));
                        if ($(n).attr('flex') == '1' || $(n).attr('flex') == 'true' || div[0].scrollWidth > div[0].offsetWidth) {
                            if ($.trim(div.text()) != '') {
                                if (window.CSUIMouseHoverPanel != null) {
                                    new CSUIMouseHoverPanel({ renderTo: _panel, trigger: div.parent(), html: div.text(), whenOverflowShow: false, style: 'z-index:3;', triggerPositionType: cfg.overflowTriggerPositionType }).buildUI();
                                }
                                else {
                                    div.attr('title', div.text());
                                }
                            }
                        }
                    }
                });
            }
            
            if (_panel_body.parent()[0].scrollHeight > _panel_body.parent()[0].offsetHeight) {
                if (_panel_body.parent()[0].scrollWidth <= _panel_body.parent()[0].clientWidth) {
                    if (_panel_head.width() < _panel_body.parent()[0].clientWidth) {
                        _panel_body.width(_panel_head.width());
                    }
                    else {
                        _panel_body.width(_panel_body.parent()[0].clientWidth);
                    }
                }
                else {
                    if (_panel_head.parent()[0].clientWidth < _panel_head.parent()[0].scrollWidth) {
                        _panel_body.width(_panel_head.width() - 17);
                    }
                    else {
                        _panel_body.width(_panel_body.parent()[0].clientWidth);
                    }
                }
            }
            else {
                _panel_body.width(_panel_head.width());
            }
        }
        
        if (_panel.find('.cs_ui_grid_bodyRow').length > 0 && _panel_body.width() < _panel_body.parent().width()) {
            var firstRow = _panel.find('.cs_ui_grid_bodyRow').first();
            var cols = firstRow.find('.cs_ui_grid_bodyItemCell,.cs_ui_grid_bodyItemCellLast'); //
            var allWidth = 0;
            var flexCol = null;
            var flexColIndex = 0;
            cols.each(function (i, n) {
                if ($(n).attr('flex') == '1' || $(n).attr('flex') == 'true') {
                    flexCol = $(n);
                    flexColIndex = i;
                }
                else if ($(n).css('display') == 'none') {

                }
                else {
                    allWidth += $(n).width();
                }
            });
            if (flexCol != null) {
                var body = _panel.find('.cs_ui_grid_body_container');
                var w = 0;
                if (body[0].offsetWidth == 0) {
                    var parent = body.parent();
                    var parentWidth = 0;
                    for (var i = 0; i < 300; i++) {
                        if (parent[0].offsetWidth != 0) {
                            parentWidth = parent[0].offsetWidth;
                            break;
                        }
                        else {
                            parent = parent.parent();
                        }
                    }
                    w = parentWidth - allWidth - 30;
                }
                else {
                    w = body.width() - allWidth - 30;
                }
                _panel_body.width('');
                flexCol.width(w);
                _panel.find('.cs_ui_grid_bodyRow').each(function (i, n) {
                    $(n).find('.cs_ui_grid_bodyItemCell').eq(flexColIndex).width(w);
                    $(n).find('.cs_ui_grid_bodyItemCell').eq(flexColIndex).find('div').first().width(w - 12);
                });
                _panel.find('.cs_ui_grid_headerItemCell').eq(flexColIndex).width(w);
            }
        }
        
        if (_panel_body.height() > _panel_body.parent().height()) {
            //出现滚动条
        }
        else {
        }
    };

    this.init = function () {
        if (!_hasInit) {
            _hasInit = true;

            _me.buildUI();

            if (cfg.allowPager == true) {
                _pager = new CSUIPager({
                    limit: cfg.pageSize,
                    onPage: function (page, limit) {
                        _me.loadData();
                    }
                });
                _pager.init();
            }

            
            if (_allowAutoRebuild) {
                _me.rebuildUI();
            }

            $(window).resize(function () {
                clearTimeout(_resizeThread);
                _resizeThread = setTimeout(function () {
                    _me.resizeUI();
                }, 300);
            });
        }
    };

    this.setData = function (v) {
        if (v.success != null) {
            _data = v.data;
            _totalRowCount = v.total;
        }
        else {
            _data = v;
            if (_totalRowCount == 0) {
                _totalRowCount = _data.length;
            }
        }

        if (_allowAutoRebuild) {
            _me.rebuildUI();
        }
    };

    this.setColumns = function (v) {
        _columns = v;
    };

    this.setHeight = function (v, notRebuild) {
        cfg.height = v;
        if (v != null) {
            _panel.find('.cs_ui_grid_body_container').css('height', v - _panel_head.outerHeight(true) - _panel_foot.outerHeight(true));
        }
        if (notRebuild != true) {
            _me.resizeUI();
        }
    };

    this.setWidth = function (v) {
        _panel.width(v);
    };

    this.setMaxHeight = function (v, notRebuild) {
        cfg.maxHeight = v;
        if (v != null) {
            _panel.find('.cs_ui_grid_body_container').css('max-height', v - _panel_head.outerHeight(true) - _panel_foot.outerHeight(true));
        }
        if (notRebuild != true) {
            _me.resizeUI();
        }
    };

    this.getData = function () {
        return _data;
    };

    this.loadData = function (pars, callback) {
        if (cfg.onPreLoadDataFunc != null) {
            cfg.onPreLoadDataFunc();
        }

        if (cfg.dataSource != null) {
            if (pars == null) {
                pars = {};
            }

            if (cfg.allowPager == true) {
                pars.page = _pager.getPageIndex();
                pars.limit = _pager.getPageSize();
            }

            if (cfg.dataSource.getParsFunc != null) {
                var t = cfg.dataSource.getParsFunc();
                for (var pro in t) {
                    pars[pro] = t[pro];
                }
            }

            _totalRowCount = 0;

            $.post(cfg.dataSource.url, pars).done(function (txt) {
                var r = eval('(' + txt + ')');
                if (r.success == false) {
                    csui.alert(r.msg);

                    if (callback != null) {
                        callback(_me, r);
                    }

                    if (cfg.onLoadDataFunc != null) {
                        cfg.onLoadDataFunc(_me, r.data, r);
                    }
                }
                else {
                    if (cfg.allowPager == true && _pager.getPageIndex() != 1 && (r.data == null || r.data.length == 0)) {
                        
                        _pager.setPageIndex(1);
                        _me.loadData(pars, callback);
                    }
                    else {
                        _loadedData = r;
                        _totalRowCount = r.total;

                        if (cfg.onLoadDataAndBeforeRebuildFunc != null) {
                            cfg.onLoadDataAndBeforeRebuildFunc(_me, r.data);
                        }

                        _me.setData(r.data);

                        if (callback != null) {
                            callback(_me, r);
                        }

                        if (cfg.onLoadDataFunc != null) {
                            cfg.onLoadDataFunc(_me, r.data, r);
                        }
                    }
                }
            });
        }
    };

    this.refresh = function () {
        _me.rebuildUI();
    };

    this.getSelectedItem = function () {
        var selected = null;
        _panel.find('.cs_ui_grid_bodyRow').each(function (i, n) {
            if ($(n).hasClass('cs_ui_grid_bodyRowSelected')) {
                selected = _data[i];
                return false;
            }
        });

        return selected;
    };

    this.getSelectedItems = function () {
        var findItems = [];
        _panel.find('.cs_ui_grid_bodyRow').each(function (i, n) {
            if ($(n).hasClass('cs_ui_grid_bodyRowSelected')) {
                findItems.push(n.datacontext);
            }
        });

        return findItems;
    };

    this.getLoadedData = function () {
        return _loadedData;
    };

    this.getPager = function () {
        return _pager;
    };

    this.selectItemByRow = function (row) {
        var isSelectionChanged = false;
        if (row.hasClass('cs_ui_grid_bodyRowSelected')) {
            if (cfg.allowCancelSelected == true) {
                var canDo = true;

                if (cfg.onSelectedChange != null) {
                    var t = cfg.onSelectedChange(_me, this.datacontext, row, false);
                    if (t == false) {
                        canDo = false;
                    }
                }

                if (canDo) {
                    row.removeClass('cs_ui_grid_bodyRowSelected');
                    isSelectionChanged = true;

                    if (cfg.allowCheckBox && cfg.allowMultiSelected) {
                        row.find('.cs_ui_grid_col_check').find('input')[0].checked = false;
                    }
                }
            }
        }
        else {
            var canDo = true;

            if (cfg.onSelectedChange != null) {
                var t = cfg.onSelectedChange(_me, row[0].datacontext, row, true);
                if (t == false) {
                    canDo = false;
                }
            }

            if (canDo) {
                if (cfg.allowMultiSelected != true) {
                    _panel_body.find('.cs_ui_grid_bodyRow').each(function (i, n) {
                        $(n).removeClass('cs_ui_grid_bodyRowSelected');

                        if (cfg.allowCheckBox && cfg.allowMultiSelected) {
                            $(n).find('.cs_ui_grid_col_check').find('input')[0].checked = false;
                        }
                    });
                }
                else {
                    if (cfg.allowRadioMode == true) {
                        _panel_body.find('.cs_ui_grid_bodyRowSelected').each(function (i, n) {
                            if (cfg.isSameRadioGroupFunc(row[0].datacontext, n.datacontext)) {
                                $(n).removeClass('cs_ui_grid_bodyRowSelected');

                                if (cfg.allowCheckBox && cfg.allowMultiSelected) {
                                    $(n).find('.cs_ui_grid_col_check').find('input')[0].checked = false;
                                }
                            }
                        });
                    }
                }
                row.addClass('cs_ui_grid_bodyRowSelected');
                isSelectionChanged = true;

                if (cfg.allowCheckBox && cfg.allowMultiSelected) {
                    row.find('.cs_ui_grid_col_check').find('input')[0].checked = true;
                }
            }
        }
        
        _selectedItemDC = null;
        _panel.find('.cs_ui_grid_bodyRowSelected').each(function (i, n) {
            _selectedItemDC = n.datacontext;
        });

        if (isSelectionChanged) {
            if (cfg.onSelectedChanged != null) {
                cfg.onSelectedChanged(_me, row[0].datacontext, row, true);
            }
        }

        if (cfg.onItemClick != null) {
            cfg.onItemClick(_me, row[0].datacontext, row);
        }
    };

    this.selectItem = function (func) {
        var changed = false;
        _panel_body.find('.cs_ui_grid_bodyRow').each(function (i, n) {
            if (func(n.datacontext)) {
                changed = true;
                _me.selectItemByRow($(n));
            }
        });
    };
    
    this.clear = function () {
        _selectedItemDC = null;
        _panel.find('.cs_ui_grid_bodyRowSelected').each(function (i, n) {
            $(n).removeClass('cs_ui_grid_bodyRowSelected');
            if (cfg.allowCheckBox && cfg.allowMultiSelected) {
                $(n).find('.cs_ui_grid_col_check').find('input')[0].checked = false;
            }
        });
    };
}

function CSUIPager(cfg) {
    var _me = this;
    var _panel;
    var _totalRowCount = 0;
    var _pageCount = 1;

    {
        if (cfg == null)
            cfg = {};

        if (cfg.page == null)
            cfg.page = 1;

        if (cfg.limit == null)
            cfg.limit = 16;
    }

    this.getUICore = function () {
        return _panel;
    };

    this.buildUI = function () {
        if (_panel != null) {
            _panel.remove();
        }

        _panel = $('<div class="cs_ui_pager_panel"></div>');
        var t = $('<table class="cs_ui_pager_table"><tr><td><a class="cs_ui_pager_first" href="javascript:;">首页</a></td><td><a class="cs_ui_pager_prev" href="javascript:;">上一页</a></td><td><span class="cs_ui_pager_pageIndex">' + cfg.page + '</span>&nbsp;/&nbsp;<span class="cs_ui_pager_pageCount">' + cfg.limit + '</span></td><td><a class="cs_ui_pager_next" href="javascript:;">下一页</a></td><td><a class="cs_ui_pager_last" href="javascript:;">尾页</a></td><td>&nbsp;</td><td>[当前<span class="cs_ui_pager_curRowCount"></span>条]</td><td>[总共<span class="cs_ui_pager_totalRowCount"></span>条]</td><td>&nbsp;</td><td>转到第</td><td><input type="text" class="cs_ui_pager_goToPage" style="width:30px;" /></td><td>页</td></tr></table>');

        t.find('.cs_ui_pager_first').click(function () {
            if (cfg.onPage != null) {
                if (cfg.page != 1) {
                    cfg.page = 1;
                    _panel.find('.cs_ui_pager_pageIndex').html(cfg.page)
                    cfg.onPage(cfg.page, cfg.limit);
                }
            }
        });
        t.find('.cs_ui_pager_prev').click(function () {
            if (cfg.onPage != null) {
                if (cfg.page > 1) {
                    cfg.page = cfg.page - 1;
                    _panel.find('.cs_ui_pager_pageIndex').html(cfg.page)
                    cfg.onPage(cfg.page, cfg.limit);
                }
            }
        });
        t.find('.cs_ui_pager_next').click(function () {
            if (cfg.onPage != null) {
                if (cfg.page < _pageCount) {
                    cfg.page = cfg.page + 1;
                    _panel.find('.cs_ui_pager_pageIndex').html(cfg.page)
                    cfg.onPage(cfg.page, cfg.limit);
                }
            }
        });
        t.find('.cs_ui_pager_last').click(function () {
            if (cfg.onPage != null) {
                if (cfg.page < _pageCount) {
                    cfg.page = _pageCount;
                    _panel.find('.cs_ui_pager_pageIndex').html(cfg.page)
                    cfg.onPage(cfg.page, cfg.limit);
                }
            }
        });
        t.find('.cs_ui_pager_goToPage').blur(function () {
            if (cfg.onPage != null) {
                var v = this.value;
                if (v != null && v != '') {
                    var index = parseInt(v);
                    if (1 <= index && index <= _pageCount) {
                        cfg.page = index;
                        _panel.find('.cs_ui_pager_pageIndex').html(cfg.page)
                        cfg.onPage(cfg.page, cfg.limit);
                    }
                    else {
                        this.value = '';
                    }
                }
            }
        });
        _panel.append(t);
    };

    this.rebuildUI = function () {
    };

    this.init = function () {
        _me.buildUI();
    };

    this.getPageIndex = function () {
        return cfg.page;
    };

    this.getPageSize = function () {
        return cfg.limit;
    };

    this.setPageIndex = function (v) {
        cfg.page = v;
        _panel.find('.cs_ui_pager_pageIndex').html(cfg.page);
    };

    this.setTotalRowCount = function (v) {
        _totalRowCount = v;

        if (_totalRowCount <= cfg.limit) {
            _pageCount = 1;
        }
        else {
            var t1 = parseFloat(_totalRowCount.toString()) / parseFloat(cfg.limit.toString());
            var t2 = parseInt(t1.toString());
            if (t1 > t2) {
                _pageCount = t2 + 1;
            }
            else {
                _pageCount = t2;
            }
        }

        _panel.find('.cs_ui_pager_pageCount').html(_pageCount);

        if (cfg.page == _pageCount) {
            _panel.find('.cs_ui_pager_curRowCount').html(_totalRowCount - (_pageCount - 1) * cfg.limit);
        }
        else {
            _panel.find('.cs_ui_pager_curRowCount').html(cfg.limit);
        }

        _panel.find('.cs_ui_pager_totalRowCount').html(_totalRowCount);
    };
}/*res CSUI*/
