/*
onAddTag
onDelTag
onlyOneTag:false //永远里面最多只能有一个标签
noInputTagCreate:false     //不允许通过输入来生成标签，必须要通过悬浮框选择才行
delStrPattern: /[\;\^]/    //要删除的正则表达式
canDel:true
*/
function CSUITagInput(cfg) {
    var _me = this;
    var _panel;
    var _renderTo = cfg.renderTo;
    var _items = cfg.items;
    var _emptyText = '请输入...';
    var _displayFieldName = 'text';
    var cstwm = null;
    var _onAddTag = cfg.onAddTag;
    var _onDelTag = cfg.onDelTag;
    
    var _onInputClick = cfg.onInputClick;
    var _onInputFocus = cfg.onInputFocus;

    {
        if (cfg.emptyText != null) {
            _emptyText = cfg.emptyText;
        }
        if (cfg.displayFieldName != null) {
            _displayFieldName = cfg.displayFieldName;
        }
    }
    
    function _newTagItem(words, dc) {
        var tagItem = $('<div class="cs_ui_tagInput_lable"><div class="cs_ui_tagInput_lable_t1">' + words + '</div><div class="cs_ui_tagInput_lable_t2">×</div><div style="clear:both;"></div></div>');
        tagItem[0].datacontext = dc;
        tagItem.find('.cs_ui_tagInput_lable_t1').click(function (e) {
            e.stopPropagation();
        });
        tagItem.find('.cs_ui_tagInput_lable_t2').click(function (e) {
            e.stopPropagation();
            if (cfg.canDel == false) {
                alert('不允许删除');
            }
            else {
                $(this).parent().remove();
                if (_panel.find('.cs_ui_tagInput_lable').length == 0) {
                    _panel.find('input[type=text]').show();
                }
                if (_onDelTag != null) {
                    _onDelTag(_me);
                }
            }
        });
        if (cfg.onlyOneTag == true) {
            _panel.find('input[type=text]').hide();
        }
        return tagItem;
    }

    function _touchForEmptyText(val) {
        if (cstwm != null) {
            cstwm.check();
        }
    }

    this.getUICore = function () {
        return _panel;
    };

    this.buildUI = function () {
        
        _panel = $('<div><input type="text" class="cs_ui_tagInput_input" size="1" maxlength="28" style="min-width:60px;" /><div style=" clear:both"></div></div>');
        _touchForEmptyText(true);
        if (_onInputClick != null) {
            _panel.find('input').click(function () {
                _onInputClick();
            });
        }
        _panel.find('input').focus(function () {
            _touchForEmptyText(false);
            if (_onInputFocus != null) {
                _onInputFocus();
            }
        });

        if (_panel != null) {
            $(_renderTo).addClass('cs_ui_tagInput_panel');
            $(_renderTo).children().remove();
            $(_renderTo).append(_panel);
        }

        if (_items != null && _items.length > 0) {
            for (var i = 0; i < _items.length; i++) {
                var words3 = _items[i][_displayFieldName];
                $(_renderTo).find("input").before(_newTagItem(words3, _items[i]));
            }
            $(_renderTo).find("input").val('');
            _touchForEmptyText(true);
        }
        
        $(_renderTo).find("input").blur(function () {
            if (cfg.noInputTagCreate != true) {
                create_lable();
            }
            _touchForEmptyText(true);
        });
        
        $(_renderTo).click(function () {
            $(_renderTo).find("input").focus();
        });
        
        function create_lable() {
            var words = $(_renderTo).find("input").val();
            if (words.length > 0) {
                var dc = {}; dc[_displayFieldName] = words;
                var tagItem = _newTagItem(words, dc);
                $(_renderTo).find("input").before(tagItem);
                $(_renderTo).find("input").val('');

                if (_onAddTag != null) {
                    _onAddTag(_me, words);
                }
            }
        }
        $(_renderTo).find("input").keydown(function (event) {
            var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;

            
            if (keyCode == 13 || keyCode == 32) {
                if (cfg.noInputTagCreate != true) {
                    create_lable();
                }
                event.preventDefault();
                event.stopPropagation();
            }
            
            if (keyCode == 8) {
                var words1 = $(_renderTo).find(".cs_ui_tagInput_lable").length;
                if ($(_renderTo).find("input").val().length == 0) {
                    if (words1 > 0) {
                        if (confirm('去定删除此标签？')) {
                            $(_renderTo).find(".cs_ui_tagInput_lable").eq(words1 - 1).remove();
                            if (_onDelTag) {
                                _onDelTag(_me);
                            }
                        }
                    }
                }
            }
        });
        
        $(_renderTo).find("input").keydown(function () {
            var maxchar = 100;
            var which = this;
            var iCount = which.value.length;
            if (iCount <= maxchar) {
                which.size = iCount + 3;
            }
            if (iCount == 0) {
                which.size = iCount + 1;
            }
        });
        $(_renderTo).find("input").keyup(function () {
            
            this.value = this.value.replace(/[\;]/g, '');
            if (cfg.delStrPattern != null) {
                this.value = this.value.replace(cfg.delStrPattern, '');
            }
        });


        cstwm = new CSUITextBoxWatermark({
            renderTo: _panel.find('input'),
            txt: _emptyText,
            wmCss: '/*自定义水印样式*/',
            onEnter: function (v) {
                //按回车触发
            }
        })
        cstwm.init();
    };

    this.setCfgAttr = function (name, value) {
        cfg[name] = value;
    };

    this.init = function () {
        _me.buildUI();
    };

    this.addItem = function (item) {
        
        $(_renderTo).find("input").before(_newTagItem(item[_displayFieldName], item));
        $(_renderTo).find("input").val('');
        _touchForEmptyText(true);

        if (_onAddTag != null) {
            _onAddTag(_me, item[_displayFieldName]);
        }
    };

    this.getItems = function () {
        var items = [];
        _panel.find(".cs_ui_tagInput_lable").each(function (i, n) {
            items.push(n.datacontext);
        });

        if (items.length > 0) {
            return items;
        }
        return null;
    }

    this.clearItems = function () {
        _panel.find(".cs_ui_tagInput_lable").remove();
        _panel.find('input[type=text]').show();
    };

    this.getValue = function () {
        var _alert = '';
        var _value = $(_renderTo).find(".cs_ui_tagInput_lable");
        for (var i = 0; i < _value.length; i++) {
            _alert = _alert + _value.eq(i).find(".cs_ui_tagInput_lable_t1").text() + ";";
        }

        return _alert;
    };
}/*res CSUI*/
