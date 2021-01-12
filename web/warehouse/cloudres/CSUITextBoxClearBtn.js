/*
输入框内容清除按钮
notShowTxt:''
clear:function(){}
onClear:function(){}
*/
function CSUITextBoxClearBtn(cfg) {
    var _me = this;
    var _data;
    var _panel;
    var _trigger;
    var _clearBtn;
    var _clearBtn_hideDelayThread;
    var _height = 16;

    function _autoSize() {

    }

    this.clear = function (self, tgt) {
        tgt.val('');
        if (cfg.onClear != null) {
            cfg.onClear();
        }
    };

    this.getUICore = function () {
        return _panel;
    };

    this.build = function () {
        _clearBtn = $('<img src="?cmd=sys_101svc_getimg&tgt=cs_ui_del1.png" style="position:absolute; cursor:pointer; display:none;" />');
        if (_height == null) {
            _clearBtn.height($(cfg.tgt).height());
        }
        else {
            _clearBtn.height(_height);
        }
        _clearBtn.css('background-color', $(cfg.tgt).css('background-color'));
        _clearBtn.mouseenter(function () {
            clearTimeout(_clearBtn_hideDelayThread);
            _clearBtn.show();
        });
        _clearBtn.mouseleave(function () {
            clearTimeout(_clearBtn_hideDelayThread);
            _clearBtn_hideDelayThread = setTimeout(function () {
                _clearBtn.hide();
            }, 300);
        });
        _clearBtn.click(function () {
            _me.clear(_me, $(cfg.tgt));
        });
        $(cfg.tgt).mouseenter(function () {
            clearTimeout(_clearBtn_hideDelayThread);
            if ($(cfg.tgt).val() == '' || cfg.notShowTxt == $(cfg.tgt).val()) {

            }
            else {
                _clearBtn.show();
                var leftMargin = $(this).css('margin-left').replace('px', '');

                _clearBtn.css('left', $(this).position().left + $(this).outerWidth() + parseFloat(leftMargin) - _clearBtn.width() - 3);
                _clearBtn.css('top', $(this).position().top + ($(this).outerHeight() - _clearBtn.outerHeight(true)) / 2 + parseFloat($(this).css('margin-top').replace('px','')));
            }
        });
        $(cfg.tgt).mouseleave(function () {
            clearTimeout(_clearBtn_hideDelayThread);
            _clearBtn_hideDelayThread = setTimeout(function () {
                _clearBtn.hide();
            }, 300);
        });
        $(cfg.tgt).parent().append(_clearBtn);
    };
    //此处会被定时调用，来刷新变动数据
    this.rebuild = function () {

    };
    //外部会调用此函数来刷新数据
    this.setData = function (v) {
        _data = v;
    };

    this.getData = function () {
        return _data;
    };

    {
        if (cfg.clear != null) {
            _me.clear = cfg.clear;
        }
    }
}/*res CSUI*/
