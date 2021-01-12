/// <reference path="jquery-1.11.2.min.js" />

/*输入框水印
txt
allowClearBtn:false
onEnter:function(v){}
onClear:function(){}

赋予目标身上的内置变量：cs_ui_textBoxWatermark
*/
function CSUITextBoxWatermark(cfg) {
    var _me = this;
    var _tgt = null;
    var _tgtJq = null;
    var _txt = cfg.txt;
    var _wmClassName = 'csui_tbx_watermark';
    var _wmCss = cfg.wmStyle;
    var _mhp = null;

    {
        if (cfg.renderTo != null) {
            if (cfg.renderTo instanceof jQuery) {
                _tgt = cfg.renderTo;
            }
            else {
                _tgt = $(cfg.renderTo);
            }
        }
        else {
            if (cfg.tgt instanceof jQuery) {
                _tgt = cfg.tgt;
            }
            else {
                _tgt = $(cfg.tgt);
            }
        }

        if (_tgt != null) {
            if (_txt != null && _txt != '') {
                if (window.CSUIMouseHoverPanel != null) {
                    _mhp = new CSUIMouseHoverPanel({ trigger: _tgt, html: _txt, whenOverflowShow: false, style: 'z-index:3;' }).buildUI();
                }
                else {
                    //默认悬浮在内核中不支持
                    _tgt.attr('title', _txt);
                }
            }
        }

        $(document).ready(function () {
            $(document.body).append('<style>.' + _wmClassName + '{color:silver;' + (_wmCss != null ? _wmCss : '') + '} .' + _wmClassName + ':hover{color:black;}</style>');
        });
    }

    function setTitle(v) {
        if (_mhp != null) {
            _mhp.html(v);
        }
        else {
            _tgt.attr('title', v);
        }
    }

    this.getUICore = function () {
        return _tgtJq;
    };

    this.init = function () {
        _tgtJq = $(_tgt);
        _tgtJq[0].cs_ui_textBoxWatermark = _me;

        if (_tgtJq.val().length == 0) {
            _tgtJq.val(_txt);
            _tgtJq.addClass(_wmClassName);
        }

        _tgtJq.focus(function () {
            if (_tgtJq.val() == _txt) {
                _tgtJq.val('');
            }
            _tgtJq.removeClass(_wmClassName);
        });

        _tgtJq.change(function () {
            if (this.value != _txt) {
                _tgtJq.removeClass(_wmClassName);
            }
        });

        _tgtJq.blur(function () {
            if (_tgtJq.val().length == 0) {
                _tgtJq.val(_txt);
                _tgtJq.addClass(_wmClassName);
            }
        });

        if (cfg.onEnter != null) {
            _tgtJq.keydown(function (e) {
                if (e.keyCode == 13) {
                    cfg.onEnter();
                }
            });
        }

        if (cfg.allowClearBtn == true) {
            _tgtJq[0].cs_ui_clearBtn = new CSUITextBoxClearBtn({
                tgt: _tgtJq,
                clear: function () {
                    _tgtJq.val('');
                    _me.check();
                    if (cfg.onClear != null) {
                        cfg.onClear();
                    }
                },
                notShowTxt: _txt
            });
            _tgtJq[0].cs_ui_clearBtn.build();
        }
    };
    
    this.val = function (v) {
        if (v != null) {
            _tgtJq.val(v);
        }

        if (_tgtJq.val() == _txt) {
            return '';
        }
        else {
            return _tgtJq.val();
        }
    };
    
    this.clearWM = function () {
        if (_tgtJq.val() == _txt) {
            _tgtJq.val('');
        }
    };
    
    this.check = function () {
        if (_tgtJq.val() == '') {
            _tgtJq.val(_txt);
            _tgtJq.addClass(_wmClassName);
        }
        else if (_tgtJq.val() == _txt) {
            _tgtJq.addClass(_wmClassName);
        }
        else {
            _tgtJq.removeClass(_wmClassName);
        }
    };
}/*res CSUI*/
