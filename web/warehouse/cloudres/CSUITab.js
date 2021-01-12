/// <reference path="../../JS/jq/jquery-1.11.2.min.js" />
/*
cs_ui_parent_onSelectYourTab
cs_ui_parent_yourTabId
*/
function CSUITab(cfg) {
    var _me = this;
    var _ownerId = csui.newId();
    var _renderTo = cfg.renderTo;
    var _hasBuild = false;
    var _panel;

    var _selectedFootprintStr = '';
    //var _preSelectedTabId = '';
    var _selectedTabId = '';
    var _selectedTabIndex;

    function _selectItem(tabId) {
        if (_selectedTabId != null && _selectedTabId != '') {
            _selectedFootprintStr += _selectedTabId + ';';
        }
        _selectedTabId = tabId;
        var hasFind = false;

        _panel.find('.cs_ui_tab_panel_bar').find('.cs_ui_tab_bar_item').each(function (i, n) {
            var item = $(n);
            if (item.attr('ownerId') == _ownerId) {
                if (item.attr('tabId') == _selectedTabId) {
                    item.addClass('cs_ui_tab_bar_item_selected');
                    item.css('z-index', 10);
                    hasFind = true;
                    _selectedTabIndex = i;
                }
                else {
                    item.removeClass('cs_ui_tab_bar_item_selected');
                    item.css('z-index', 8);
                }
            }
        });

        _panel.find('.cs_ui_tab_panel_body').find('.cs_ui_tab_body_item').each(function (i, n) {
            var item = $(n);
            if (item.attr('ownerId') == _ownerId) {
                if (item.attr('tabId') == _selectedTabId) {
                    item.css('display', '');

                    var iframes = item.find('iframe');
                    if (iframes != null && iframes.length > 0) {
                        try {
                            if (iframes.first()[0].contentWindow.cs_ui_parent_onSelectYourTab != null) {
                                iframes.first()[0].contentWindow.cs_ui_parent_onSelectYourTab();
                            }
                        } catch (exc) {

                        }
                        //try {
                            //$(iframes.first()[0].contentWindow).resize();
                            //$(iframes.first()[0].contentWindow).trigger("resize");
                        //} catch (exc) { csui.log(exc.message); }
                    }
                }
                else {
                    item.css('display', 'none');
                }
            }
        });

        _me.rebuildChildUI();
        //_me.onChildRebuildUI(_me);
        _me.onTabSelected(_me, _selectedTabId);
    }

    function _closeTab(tabId) {
        _panel.find('.cs_ui_tab_panel_bar').find('.cs_ui_tab_bar_item').each(function (i, n) {
            var item = $(n);
            if (item.attr('tabId') == tabId) {
                item.remove();
            }
        });

        _panel.find('.cs_ui_tab_panel_body').find('.cs_ui_tab_body_item').each(function (i, n) {
            var item = $(n);
            if (item.attr('tabId') == tabId) {
                item.remove();
            }
        });
        //删除关闭的足迹
        _selectedFootprintStr = csui.replace(_selectedFootprintStr, tabId + ';', '');

        if (_selectedTabId == tabId) {
            _selectedTabId = '';
            //关闭的是当前选中的，则选择前一个
            if (_selectedFootprintStr != null && _selectedFootprintStr != '') {
                var ids = _selectedFootprintStr.substr(0, _selectedFootprintStr.length - 1).split(';');
                var _preSelectedTabId = ids[ids.length - 1];
                _panel.find('.cs_ui_tab_panel_bar').find('.cs_ui_tab_bar_item').each(function (i, n) {
                    var item = $(n);
                    if (item.attr('ownerId') == _ownerId && item.attr('tabId') == _preSelectedTabId) {
                        _selectItem(item.attr('tabId'));
                        return false;
                    }
                });
            }
            else {
                //关闭的是当前选中的，则重新选择
                _panel.find('.cs_ui_tab_panel_bar').find('.cs_ui_tab_bar_item').each(function (i, n) {
                    var item = $(n);
                    if (item.attr('ownerId') == _ownerId) {
                        _selectItem(item.attr('tabId'));
                        return false;
                    }
                });
            }
        }
    }

    function _createTab(item) {
        var tabId = 'tab_' + csui.newId();
        //添加标签
        {
            var tpl = '<div tabId="' + tabId + '" ownerId="' + _ownerId + '" class="cs_ui_tab_bar_item">{title}' + (item.allowClose == false ? '' : '<span class="cs_ui_tab_btn_close">&nbsp;</span>') + '</div>';
            var barItem = $(convertTplToHtml(tpl, item));
            barItem[0].datacontext = item;
            barItem.click(function () {
                _selectItem($(this).attr('tabId'));
            });
            barItem.css('z-index', 8);
            barItem.css('margin-left', '-3px');

            if (item.allowClose != false) {
                barItem.css('padding-right', 28);
                barItem.find('.cs_ui_tab_btn_close').click(function (e) {
                    _closeTab($(this).parent().attr('tabId'));
                    e.stopPropagation();
                });
            }
            _panel.find('.cs_ui_tab_panel_bar').each(function (i, n) {
                if ($(n).attr('ownerId') == _ownerId) {
                    barItem.insertBefore($(n).find('.cs_ui_tab_panel_bar_clearBoth'));
                    //$(n).append(barItem);
                    return false;
                }
            });
        }
        //添加内容
        {
            var html = item.html;
            if (html == null) {
                html = item.renderFrom;
                item.html = html;
            }
            else {
                item.renderFrom = html;
            }

            var tpl = '<div tabId="' + tabId + '" ownerId="' + _ownerId + '" class="cs_ui_tab_body_item" style=""></div>';
            var bodyItem = $(tpl);
            if (html != null && html.getUICore != null && html.init != null) {
                html.init();
                bodyItem.append(html.getUICore());
            }
            else if (html != null && html.getUICore != null && html.build != null) {
                html.build();
                bodyItem.append(html.getUICore());
            }
            else if (html != null && html.getUICore != null && html.buildUI != null) {
                html.buildUI();
                bodyItem.append(html.getUICore());
            }
            else {
                bodyItem.append(html);
            }
            try {
                bodyItem.find('iframe').first().attr('tabId', tabId);
                bodyItem.find('iframe').first().load(function () {
                    try {
                        this.contentWindow.cs_ui_parent_yourTabId = $(this).attr('tabId');
                    } catch (exc) {

                    }
                });
            } catch (exc) {

            }
            _panel.find('.cs_ui_tab_panel_body').each(function (i, n) {
                if ($(n).attr('ownerId') == _ownerId) {
                    $(n).append(bodyItem);
                    return false;
                }
            });
        }

        return tabId;
    }

    this.getUICore = function () {
        return _panel;
    };

    this.addTab = function (item, autoSelected) {
        var tabId = _createTab(item);
        if (autoSelected != false) {
            _selectItem(tabId);
        }
        return tabId;
    };

    this.buildUI = function () {
        if (!_hasBuild) {
            _panel = $('<div class="cs_ui_tab_panel"><div ownerId="' + _ownerId + '" class="cs_ui_tab_panel_bar"><div class="cs_ui_tab_panel_bar_first" style="float:left;width:5px;">&nbsp;</div><div class="cs_ui_tab_panel_bar_clearBoth" style="clear:both;"></div></div><div ownerId="' + _ownerId + '" class="cs_ui_tab_panel_body"></div></div>');
            if (cfg.items != null) {
                var firstTabId;

                for (var i = 0; i < cfg.items.length; i++) {
                    var tabId = _createTab(cfg.items[i]);

                    if (i == 0) {
                        firstTabId = tabId;
                    }
                }

                if (_panel.find('#' + firstTabId) != null) {
                    _selectItem(firstTabId);
                }
            }

            if (_panel != null) {
                $(_renderTo).append(_panel);
            }
        }
    };

    this.rebuildUI = function () {
        //        _panel.find('.cs_ui_tab_body_item').each(function (i, n) {
        //            if ($(n).attr('ownerId') == _ownerId) {
        //                
        //            }
        //        });
    };

    this.getTabIdByTitle = function (title) {
        var tabId;
        _panel.find('.cs_ui_tab_bar_item').each(function (i, n) {
            if ($(n).attr('ownerId') == _ownerId) {
                if (n.datacontext.title == title) {
                    tabId = $(n).attr('tabId');
                    return false;
                }
            }
        });
        return tabId;
    };

    this.getTabHeadItem = function (tabId) {
        var r = null;
        _panel.find('.cs_ui_tab_bar_item').each(function (i, n) {
            if ($(n).attr('ownerId') == _ownerId && $(n).attr('tabId') == tabId) {
                r = $(n);
                return false;
            }
        });
        return r;
    };

    this.getTabBodyItem = function (tabId) {
        var r = null;
        _panel.find('.cs_ui_tab_body_item').each(function (i, n) {
            if ($(n).attr('ownerId') == _ownerId && $(n).attr('tabId') == tabId) {
                r = $(n);
                return false;
            }
        });
        return r;
    };

    this.getTabHeadItemByTitle = function (title) {
        var r = null;
        var tabId = _me.getTabIdByTitle(title);
        _panel.find('.cs_ui_tab_bar_item').each(function (i, n) {
            if ($(n).attr('ownerId') == _ownerId && $(n).attr('tabId') == tabId) {
                r = $(n);
                return false;
            }
        });
        return r;
    };

    this.getTabBodyItemByTitle = function (title) {
        var r = null;
        var tabId = _me.getTabIdByTitle(title);
        _panel.find('.cs_ui_tab_body_item').each(function (i, n) {
            if ($(n).attr('ownerId') == _ownerId && $(n).attr('tabId') == tabId) {
                r = $(n);
                return false;
            }
        });
        return r;
    };

    this.hasTabByTitle = function (title) {
        return _me.getTabIdByTitle(title) != null;
    };

    this.getSelectedTabData = function () {
        var findItem;
        if (_selectedTabId != null && _selectedTabId != '') {
            _panel.find('.cs_ui_tab_panel_bar').find('.cs_ui_tab_bar_item').each(function (i, n) {
                if ($(n).attr('ownerId') == _ownerId) {
                    if ($(n).hasClass('cs_ui_tab_bar_item_selected')) {
                        findItem = n.datacontext;
                        return false;
                    }
                }
            });
        }
        return findItem;
    };

    this.getSelectedTabIndex = function () {
        return _selectedTabIndex;
    };

    this.selectTab = function (tabId) {
        _selectItem(tabId);
    };

    this.setTabTitleByIndex = function (index, value) {
        _panel.find('.cs_ui_tab_panel_bar').find('[ownerId="' + _ownerId + '"]').eq(index).html(value);
    };

    this.closeTab = function (tabId) {
        _closeTab(tabId);
    };

    function convertTplToHtml(tpl, obj) {
        var t = tpl;
        for (var pro in obj) {
            while (t.match('{' + pro + '}') != null) {
                t = t.replace('{' + pro + '}', obj[pro]);
            }
        }
        return t;
    }

    this.rebuildChildUI = function () {
        var selectedTabData = _me.getSelectedTabData();
        if (selectedTabData != null) {
            var t1 = selectedTabData.html;
            if (t1 == null) t1 = selectedTabData.renderFrom;

            if (t1 != null && t1.rebuild != null) {
                t1.rebuild();
            }
            else if (t1 != null && t1.rebuildUI != null) {
                t1.rebuildUI();
            }
        }
    };

    this.onChildRebuildUI = function (me) {
        //        var selectedTabData = me.getSelectedTabData();
        //        if (selectedTabData != null) {
        //            var t1 = selectedTabData.html;
        //            if (t1 == null) t1 = selectedTabData.renderFrom;

        //            if (t1 != null && t1.rebuildUI != null) {
        //                t1.rebuildUI();
        //            }
        //        }
    };

    this.onTabSelected = function (self) {

    };
    
    this.init = function () {
        _me.buildUI();
    };
}/*res CSUI*/
