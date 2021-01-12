/*
triggerPositionType:'offset/position'
extraLeft:0
extraTop:0
*/
function CSUIMouseHoverPanel(cfg) {
    var _me = this;
    var _panel;
    var _trigger;
    var _isInTrigger = false;
    var _isInPanel = false;
    var _timeoutThread;
    var renderTo;
    var whenOverflowShow = false;
    //允许鼠标悬浮在悬浮框上时，使悬浮框一直显示
    var keepWhenInFloatPanel = false;
    var style = '';
    var left;
    var top;

    {
        if (cfg.whenOverflowShow != null) {
            whenOverflowShow = cfg.whenOverflowShow;
        }
        if (cfg.keepWhenInFloatPanel != null) {
            keepWhenInFloatPanel = cfg.keepWhenInFloatPanel;
        }
        if (cfg.style != null) {
            style = cfg.style;
        }
        if (cfg.extraLeft == null) cfg.extraLeft = 0;
        if (cfg.extraTop == null) cfg.extraTop = 0;
    }

    function _onLeave() {
        _timeoutThread = setTimeout(function () {
            if (_isInTrigger == false && _isInPanel == false && _panel != null) {
                _panel.hide();
                //_panel = null;
            }
        }, 300);
    }

    function _createPanel() {
        _panel = $('<div class="cs_ui_mouseHoverPanel" style="display:none;' + style + '"></div>');

        _panel.mouseenter(function () {
            if (keepWhenInFloatPanel == true) {
                _isInPanel = true;
            }
        });

        _panel.mouseleave(function () {
            _isInPanel = false;
            _onLeave();
        });

        renderTo.append(_panel);
    }

    this.getCfg = function () {
        return cfg;
    };

    this.locate = function () {
        var func = _trigger.offset();
        //        if (cfg.triggerPositionType == 'position') {
        //            func = _trigger.position();
        //        }
        cfg.triggerPositionType = '';
        if (cfg.triggerPositionType == 'position') {
//            left = func.left + 6;
//            top = func.top + renderTo[0].scrollTop + _trigger.height() + 6;
//            //如果贴底则上移到触发器上方
//            if (top + _panel.outerHeight(true) - renderTo[0].scrollTop > renderTo.height()) {
//                top = func.top + renderTo[0].scrollTop - _panel.height() * 1 - 6;
//            }
//            //如果贴右则右居
//            if (left + _panel.outerWidth(true) - renderTo[0].scrollLeft > renderTo.width()) {
//                left = renderTo.width() - _panel.outerWidth(true);
//            }
        }
        else {
            left = func.left - $(window).scrollLeft();
            top = func.top - $(window).scrollTop();
            //如果贴底则上移到触发器上方
            if (top + _trigger.outerHeight(true) + _panel.outerHeight(true) > $(window).height() && _panel.outerHeight(true) < top) {
                top = top - _panel.outerHeight(true) - 3;
            }
            else {
                top = top + _trigger.outerHeight(true) + 3;
            }
            //如果贴右则右居
            if (left + _panel.outerWidth(true) > $(window).width()) {
                left = $(window).width() - _panel.outerWidth(true);
            }
        }
    };

    this.buildUI = function () {

        if (cfg.renderTo != null) {
            renderTo = $(cfg.renderTo);
        }
        else {
            renderTo = $(document.body);
        }

        _trigger = $(cfg.trigger);
        if (_panel == null) {
            _createPanel();
        }

        _trigger.mouseenter(function (e) {
            _me.show();
        });

        _trigger.mouseleave(function () {
            clearTimeout(_timeoutThread);
            _isInTrigger = false;
            _onLeave();
        });

        _me.rebuild();
    };

    this.rebuild = function () {
        _panel.children().remove();
        if (cfg.html != null && cfg.html != '') {
            _panel.html(cfg.html);
        }
        else if (cfg.text != null && cfg.text != '') {
            _panel.html('<pre style="margin:0px;">' + cfg.text + '</pre>');
        }
        else {
            _panel.html(_trigger.html());
        }
    };

    this.show = function () {
        clearTimeout(_timeoutThread);
        _isInTrigger = true;

        if (whenOverflowShow == true) {
            
            if (_trigger[0].offsetWidth >= _trigger[0].scrollWidth) {
                return false;
            }
        }
        _timeoutThread = setTimeout(function () {
            _panel.show();
            //if (cfg.autoLocate != false) {
                _me.locate();
            //}
            _panel.css('left', left + cfg.extraLeft);
            _panel.css('top', top + cfg.extraTop);

            if (_trigger[0].value != null && _trigger[0].cs_ui_textBoxWatermark != null) {
                _me.html(_trigger.val());
                if (_trigger.val() == '') {
                    _panel.hide();
                }
                else {
                    _panel.show();
                }
            }
            else {
                _panel.show();
            }
        }, 300);
    };

    this.hide = function () {
        _panel.hide();
    };

    this.dispose = function () {
        if (_panel != null) {
            _panel.remove();
        }
    };

    this.text = function (v) {
        _panel.children().remove();
        if (v == null) {
            _panel.html('<pre style="margin:0px;">' + _trigger.val() + '</pre>');
        }
        else {
            _panel.html('<pre style="margin:0px;">' + v + '</pre>');
        }
    };

    this.html = function (v) {
        _panel.children().remove();
        if (v == null) {
            _panel.html(_trigger.html());
        }
        else {
            _panel.html(v);
        }
    };
}/*res CSUI*/
