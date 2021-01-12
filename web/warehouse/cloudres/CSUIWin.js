
if (window.csui == null) {
    window.csui = {};
}
window.csui.prevWinInitZIndex = 999999;
window.csui.topBarFontSize = '15px';
window.csui.contentFontSize = '16px';

window.csui.allowMaoBoLiEffect = false;
/*
cfg:
winStyle
topBarStyle
titleLabelStyle
bgStyle
contentContainerStyle
closeBtnStyle
showCloseBtn:true
allowFold:false
allowMove:true
closeType:默认为空，可设为'hide',html,url,onLoadAction}
left:120（如果设了则不自动居中）
top:111
hideBg:false
onBgClick:function(self,bgUI){}
onHide:function(self){}
*/
function CSUIWin(cfg) {
    var _me = this;
    var _id;
    var _bg;
    var _win;

    var _initZIndex = 0;
    var _bgEffect1Key = '';
    var _onCloseAction;
    
    var _state = 'none';
    var _showLoadingLabelId;
    var _hasBuild = false;
    var _hasFirstShow = false;

    this.getUICore = function () {
        return _win;
    };

    this.build = function () {
        if (!_hasBuild) {
            $(window).resize(function () {
                _me.rebuild();
            });
            _hasBuild = true;
        }
    };

    this.rebuild = function () {
        if (cfg.width != null) {
            _win.find('.winCon').css('width', cfg.width);
        }
        else if (cfg.width == 'auto') {

        }
        else {
            _win.find('.winCon').css('width', $(window).width() - 66);
        }

        if (cfg.height != null) {
            _win.find('.winCon').css('height', cfg.height);
        }
        else if (cfg.height == 'auto') {

        }
        else {
            _win.find('.winCon').css('height', $(window).height() - 80);
        }

        _bg.width($(window).width());
        _bg.height($(window).height());

        if (cfg.left != null) {
            _win.css('left', cfg.left);
        }
        else {
            _win.css('left', ($(window).width() - _win.width()) / 2);
        }
        if (cfg.top != null) {
            _win.css('top', cfg.top);
        }
        else {
            _win.css('top', ($(window).height() - _win.height()) / 2);
        }
    };

    this.getState = function () {
        return _state;
    };

    this.show = function (t_cfg) {
        _me.build();

        var t_func1 = function () {
            if (t_cfg != null) {
                for (var pro in t_cfg) {
                    eval('cfg.' + pro + '=t_cfg.' + pro);
                }
            }

            var bDocBody = $(document.body);
            var bWin = $(window);

            if (_state == 'none' || _state == 'destory') {
                _state = 'show';

                if (cfg.title == null) {
                    cfg.title = '';
                }

                _initZIndex = window.csui.prevWinInitZIndex + 6;
                window.csui.prevWinInitZIndex = _initZIndex;

                _bg = $('<div class="cs_ui_win_bg" oncontextmenu="return false;" style="position:fixed; left:0px; top:0px; display:none; background-color: #EAEAEA; z-index:' + _initZIndex + ';' + cfg.bgStyle + '"><style>.' + _bgEffect1Key + '{ -moz-filter: blur(5px); -webkit-filter: blur(5px); -o-filter: blur(5px); -ms-filter: blur(5px); filter: blur(5px); }</style></div>');
                _win = $('<div class="cs_ui_win_panel" oncontextmenu="return false;" style="position:fixed; display:none; background-color:white; border:1px solid silver; box-shadow:6px 6px 8px black; z-index:' + (_initZIndex + 1) + '; font-size:' + (csui.contentFontSize) + ';' + cfg.winStyle + '"><div class="topBar" style="height:30px; line-height:30px; font-size:' + csui.topBarFontSize + '; ' + cfg.topBarStyle + '"><span style="margin-left:12px; font-weight:bold; ' + cfg.titleLabelStyle + '">' + cfg.title + '</span></div><div class="winCon" style="margin-left:16px; margin-right:16px; margin-bottom:16px; ' + cfg.contentContainerStyle + '"></div><div class="closeBtn" style="position:absolute; top:4px; right:6px; font-weight:bold; cursor:pointer; font-size:20px;' + cfg.closeBtnStyle + '">&times;</div></div>');

                if (cfg.onBgClick != null) {
                    _bg.click(function () {
                        cfg.onBgClick(_me, this);
                    });
                }

                _win.find('.closeBtn').first().click(function () {
                    if (cfg.closeType == 'hide') {
                        _me.hide();
                    }
                    else {
                        _me.close();
                    }
                });

                if (cfg.showCloseBtn == false) {
                    _win.find('.closeBtn').remove();
                }

                _win.find('.winCon').children().remove();
                if (cfg.url != null) {
                    var ifr = $('<iframe src="' + cfg.url + '" frameborder="0" scrolling="auto" style="width:100%;height:100%;border:0;"></iframe>');
                    if (cfg.onUrlLoad) {
                        ifr.load(function () {
                            cfg.onUrlLoad(_me, this);
                        });
                    }
                    ifr.load(function () {
                        if (cfg.onLoadAction != null) {
                            cfg.onLoadAction(ifr[0]);
                        }
                    });
                    _win.find('.winCon').append(ifr);
                }
                else if (cfg.html != null) {
                    if (cfg.html.getUICore != null) {
                        _win.find('.winCon').append(cfg.html.getUICore());
                    }
                    else {
                        _win.find('.winCon').append(cfg.html);
                    }
                    if (cfg.contentContainerStyle == null) {
                        _win.find('.winCon').css('overflow', 'auto');
                    }
                }


                if (window.csui.allowMaoBoLiEffect == true) {
                    
                    $(document.body).children().each(function () {
                        $(this).addClass(_bgEffect1Key);
                    });
                }
                bDocBody.append(_bg);
                bDocBody.append(_win);

                _buildMoveFunc();
                _buildFoldFunc();

                if (cfg.hideBg != true) {
                    _bg.show();
                }
                _win.show();
            }
            else if (_state == 'hide') {
                _state = 'show';
                if (window.csui.allowMaoBoLiEffect == true) {
                    
                    $(document.body).children().each(function () {
                        $(this).addClass(_bgEffect1Key);
                    });
                }

                if (cfg.hideBg != true) {
                    _bg.show();
                }
                _win.show();

                _bg.removeClass(_bgEffect1Key);
                _win.removeClass(_bgEffect1Key);
            }
            else if (_state == 'show') {
                
                /*
                _win.find('.winCon').first().children().remove();
                if (cfg.html != null) {
                _win.find('.winCon').first().append(cfg.html);
                }
                */
            }

            _me.rebuild();
        };

        if (document.body == null) {
            $(document).ready(function () { t_func1(); });
        }
        else {
            t_func1();
        }

        _hasFirstShow = true;
    };

    this.showLoading = function (t_cfg) {
        if (t_cfg != null) {
            for (var pro in t_cfg) {
                eval('cfg.' + pro + '=t_cfg.' + pro);
            }
        }

        var msg = '处理中';
        if (t_cfg != null) {
            if (t_cfg.msg != null) {
                msg = t_cfg.msg;
            }
            else if (t_cfg.html != null) {
                msg = t_cfg.html;
            }
        }

        if (cfg.width == null) {
            cfg.width = 200;
        }
        if (cfg.height == null) {
            cfg.height = 'auto';
        }

        if (_state == 'show') {
            $('#' + _showLoadingLabelId).html(msg);
        }
        else {
            _showLoadingLabelId = _newId();
            _me.show({ html: '<div><div id="' + _showLoadingLabelId + '" style="text-align:center; font-size:12px; color:gray;">' + msg + '</div><div style="text-align:center;"><img style="width:100px;height:20px;" src="data:image/gif;base64,R0lGODlhZAAUAPUkAJCapZCbpZGbppOdp5agqpahqZqjrZ2nr6GqsqOstaSttaiwuKqzuq62vrC4vrK6wLa9w7zDycDGzMbM0crP08rP1M3S1s7T19HV2dLW2tTY3Njb39/i5ODj5eLl5+Ll6Obo6unr7ers7uzv8P///////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAkNAD8AIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAZAAUAAAG4cCfcEgsGo/IpHLJbDqf0Kh0Sq1ar9isdsvter9MkMcDLns9h4DaoDG7rxy1XG05jj4i5T2f3C/9fXh6gk4Gc3IDRhdyEUiLao1HjwGRkoyOl5aQTXGHcnVDI4cdRqJzpEWmcqipo6WuradMGJ5yE0QZh7dFuXO7uLpHvbZGw2q/Q8YByEgbtWoURB+HF0bTc9VF13LZ2tTW397YTQPPIUUNcgpI6WrrR+0B7/Dq7PX07k4TtRDCExVKMvwLOJAgwCQCDyJJCEXCoQdvIlYZMaEiCIkYM2rcyLGjx48gQz4JAgAh+QQJDQA/ACwAAAAAZAAUAAAG+sCfcEgsGo/IpHLJbDqf0Kh0Sq1ar9isdsvter9ZkMcDLk9HnhDScwi4DRqznAlxBxajIsfOtxxHHyJKgIKDgYaFSIRQD3wBCEUGjm4DRhd2EUiXbpmamJ6coAGdTCCTAXFCe6cBfkMjjh1GsHyys7G3tbl2tksYpxNDv6zBQxmOxUTHfMnKyEbLds1C0W7TSKuOFEMbrAHbQx+OF0bifOTl4+nn63boTG18A3lDA6xqRA12Ckj6bvz99gX8NzAAwCYeCNgZkGrIhFMQjmSYUEHJxIoWKWbEiOSilAkg6RWR4OjBnJNVRoCcAAKly5cwY8qcSbOmzZtCggAAIfkECQ0APwAsAAAAAGQAFAAABv7An3BILBqPyKRyyWw6n9CodEqtWq/YrHbL7Xq/YCPI4wmboyNPCOk5BN4Gzdk8+oiSkHdgMSpy9IAWR3V3SoSGdoiFTxd6EUcPgAEIRQaSbwNGjW+PSJsBnZqOnqNOI5IdRSCXAXJCf6wBgkOngKlGtXq3RLlvu7SoThmSE0UYrMVCx7HJQsOAzUTP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" /></div></div>' });
        }
    };

    this.hide = function () {
        _state = 'hide';
        if (window.csui.allowMaoBoLiEffect == true) {
            
            $(document.body).children().each(function () {
                $(this).removeClass(_bgEffect1Key);
            });
        }
        _bg.hide();
        _win.hide();

        if (cfg.onHide != null) {
            cfg.onHide(_me);
        }
    };

    this.close = function () {
        _state = 'destory';
        if (window.csui.allowMaoBoLiEffect == true) {
            
            $(document.body).children().each(function () {
                $(this).removeClass(_bgEffect1Key);
            });
        }

        if (_bg != null) {
            _bg.remove();
        }
        if (_win != null) {
            _win.remove();
        }

        if (_onCloseAction != null) {
            _onCloseAction();
        }
    };
    
    this.getUIContent = function () {
        return _win.find('.winCon');
    };

    this.getInitZIndex = function () {
        return _initZIndex;
    };

    this.setInitZIndex = function (v) {
        _initZIndex = v;
    };

    this.onCloseAction = function (v) {
        _onCloseAction = v;
    };

    function _newId() {
        var now = new Date();
        var id = '';
        
        id += now.getFullYear();
        id += Math.random().toString().replace('0.', '').substr(0, 4);
        
        if ((now.getMonth() + 1) < 10) {
            id += '0' + (now.getMonth() + 1);
        }
        else {
            id += (now.getMonth() + 1);
        }
        if (now.getDate() < 10) {
            id += '0' + now.getDate();
        }
        else {
            id += now.getDate();
        }
        id += Math.random().toString().replace('0.', '').substr(0, 4);
        
        if (now.getHours() < 10) {
            id += '0' + now.getHours();
        }
        else {
            id += now.getHours();
        }
        if (now.getMinutes() < 10) {
            id += '0' + now.getMinutes();
        }
        else {
            id += now.getMinutes();
        }
        id += Math.random().toString().replace('0.', '').substr(0, 4);
        
        if (now.getSeconds() < 10) {
            id += '0' + now.getSeconds();
        }
        else {
            id += now.getSeconds();
        }
        if (now.getMilliseconds() < 10) {
            id += '0' + now.getMilliseconds();
        }
        else {
            id += now.getMilliseconds().toString().substr(0, 2);
        }
        id += Math.random().toString().replace('0.', '').substr(0, 4);

        return id;
    }
    
    var _moveFuncCfg = { startMove: false };
    var _moveStartDelay;
    var _onMoveFunc = function (e) {
        if (_moveFuncCfg.startMove == true) {
            _bg.show();
            _win.css('left', e.clientX - _moveFuncCfg.offsetWinX);
            _win.css('top', e.clientY - _moveFuncCfg.offsetWinY);
        }
    };
    var _onMoveEnd = function (e) {
        _moveFuncCfg.startMove = false;
        clearTimeout(_moveStartDelay);
        if (_foldFuncCfg.isFold != true) {
            _win.find('.winCon').css('visibility', 'visible');
        }
        if (cfg.hideBg == true) {
            _bg.hide();
        }
    };

    function _buildMoveFunc() {
        if (cfg.allowMove != false) {
            _win.find('.topBar').css('cursor', 'move');
            _win.find('.topBar')[0].onselectstart = function () { return false; }
            _win.find('.topBar')[0].ondragstart = function () { return false; }
            _win.find('.topBar').mousedown(function (e) {
                _moveStartDelay = setTimeout(function () {
                    _moveFuncCfg.startMove = true;
                }, 60);
                _moveFuncCfg.offsetWinX = e.clientX - _win[0].offsetLeft;
                _moveFuncCfg.offsetWinY = e.clientY - _win[0].offsetTop;
                _win.find('.winCon').css('visibility', 'collapse');
            });

            _win.find('.topBar').mousemove(_onMoveFunc);
            _bg.mousemove(_onMoveFunc);
            _win.mousemove(_onMoveFunc);

            _win.find('.topBar').mouseup(_onMoveEnd);
            _bg.mouseup(_onMoveEnd);
            _win.mouseup(_onMoveEnd);
        }
    }
    
    var foldBtn;
    var _foldFuncCfg = { initWinHeight: 0, isFold: false };

    var _fold = function (noFold) {
        var topBar = _win.find('.topBar');
        if (_win.height() == topBar.height()) {
            _foldFuncCfg.isFold = true;
        }

        if (noFold == true) {
            if (_foldFuncCfg.isFold) {
                foldBtn.html('+');
            }
            else {
                foldBtn.html('-');
            }
        }
        else {
            if (_foldFuncCfg.isFold == false) {
                
                _foldFuncCfg.isFold = true;
                _foldFuncCfg.initWinHeight = _win.height();
                _win.find('.winCon').css('visibility', 'collapse');
                _win.height(topBar.height());
            }
            else {
                
                _foldFuncCfg.isFold = false;
                _win.height(_foldFuncCfg.initWinHeight);
                _win.find('.winCon').css('visibility', 'visible');
            }
            _fold(true);
        }
    };

    function _buildFoldFunc() {
        if (cfg.showCloseBtn == false && cfg.allowFold == true) {
            var topBar = _win.find('.topBar');
            foldBtn = $('<div class="foldBtn" style="position:absolute; top:0px; right:6px; width:30px; text-align:center; font-weight:bold; cursor:pointer; font-size:25px;' + cfg.foldBtnStyle + '"></div>');
            foldBtn.click(function () {
                _fold();
            });
            topBar.append(foldBtn);

            _fold(true);

            if (cfg.isFold == true) {
                _fold();
            }
        }
    }

    {
        if (cfg == null) {
            cfg = {};
        }

        if (cfg.initZIndex != null) {
            _initZIndex = cfg.initZIndex;
        }

        _id = _newId();
        _bgEffect1Key = 'cs_ui_win_bg_effect1_' + _id;

        if (cfg.winStyle == null) {
            cfg.winStyle = '';
        }
        if (cfg.topBarStyle == null) {
            cfg.topBarStyle = '';
        }
        if (cfg.titleLabelStyle == null) {
            cfg.titleLabelStyle = '';
        }
        if (cfg.bgStyle == null) {
            cfg.bgStyle = 'opacity:0.60;-moz-opacity:0.60;filter:alpha(opacity=60);'
        }
        if (cfg.closeBtnStyle == null) {
            cfg.closeBtnStyle = '';
        }
        if (cfg.foldBtnStyle == null) {
            cfg.foldBtnStyle = '';
        }
    }
}

window.csui.defWinBox = { items: [] };
window.csui.showWin = function (t_cfg) {
    var t_win = new CSUIWin({});
    t_win.onCloseAction(function () {
        window.csui.defWinBox.items.pop();
    });
    window.csui.defWinBox.items.push(t_win);
    t_win.show(t_cfg);
    return t_win;
};

window.csui.closeWin = function () {
    if (window.csui.defWinBox.items != null && window.csui.defWinBox.items.length > 0) {
        window.csui.defWinBox.items[window.csui.defWinBox.items.length - 1].close();
    }
};

window.csui.hideWin = function () {
    window.csui.closeWin();
};

window.csui.showLoading = function (t_cfg) {
    if (window.csui.defLoading == null) {
        window.csui.defLoading = new CSUIWin({});
    }
    window.csui.defLoading.showLoading(t_cfg);
};

window.csui.closeLoading = function () {
    if (window.csui.defLoading != null) {
        window.csui.defLoading.close();
    }
};

window.csui.hideLoading = function () {
    window.csui.closeLoading();
};

window.csui.setLoading = function (v) {
    if (v == true || v == null) {
        csui.showLoading();
    }
    else if (v == false) {
        csui.hideLoading();
    }
    else {
        csui.showLoading({ html: v });
    }
};
//{ msg: '项目1的分值超过了要求范围', state: 'warning' }
window.csui.showTips = function (cfg) {
    if (cfg.state == 'warning') {
        alert(cfg.msg);
    }
};

window.csui.showTip = function (msg, callback) {
    var content = $('<div style="min-width:160px; font: 12px/150% Arial,Verdana, \"\5b8b\4f53\";"><div style="height:12px;">&nbsp;</div><div class="message" style="text-align:center;"></div><div style="height:36px;">&nbsp;</div><div style="text-align:center; margin-bottom:6px;"><input type="button" value="确定" style="padding-left:12px;padding-right:12px; outline:none; display:inline;" /></div></div>');
    $(content).find('.message').html(msg);
    $(content).find('input').click(function () {
        if (callback != null) {
            callback();
        }
        csui.closeWin();
    });
    window.csui.showWin({ title: '提示', html: content, width: 'auto', height: 'auto' });

    $(content).find('input').focus();
};

window.csui.info = window.csui.showTip;

window.csui.alert = function (msg, callback) {
    var content = $('<div style="min-width:160px; font: 12px/150% Arial,Verdana, \"\5b8b\4f53\";"><div style="height:12px;">&nbsp;</div><div class="message" style="text-align:center;"></div><div style="height:36px;">&nbsp;</div><div style="text-align:center; margin-bottom:6px;"><input type="button" value="确定" style="padding-left:12px;padding-right:12px; outline:none; display:inline;" /></div></div>');
    $(content).find('.message').html(msg);

    var win = new CSUIWin({ title: '警告', html: content, width: 'auto', height: 'auto' });
    win.show();
    $(content).find('input').click(function () {
        if (callback != null) {
            callback();
        }
        win.close();
    });

    $(content).find('input').focus();
};

window.csui.error = function (msg, callback) {
    var content = $('<div style="min-width:160px; font: 12px/150% Arial,Verdana, \"\5b8b\4f53\";"><div style="height:12px;">&nbsp;</div><div class="message" style="text-align:center;"></div><div style="height:36px;">&nbsp;</div><div style="text-align:center; margin-bottom:6px;"><input type="button" value="确定" style="padding-left:12px;padding-right:12px; outline:none; display:inline;" /></div></div>');
    $(content).find('.message').html(msg);

    var win = new CSUIWin({ title: '错误', html: content, width: 'auto', height: 'auto' });
    win.show();
    $(content).find('input').click(function () {
        if (callback != null) {
            callback();
        }
        win.close();
    });

    $(content).find('input').focus();
};

window.csui.confirm = function (msg, callback) {
    var content = $('<div style="min-width:160px; font: 12px/150% Arial,Verdana, \"\5b8b\4f53\";"><div style="height:12px;">&nbsp;</div><div class="message" style="text-align:center;"></div><div style="height:36px;">&nbsp;</div><div style="text-align:center; margin-bottom:6px;"><input class="yesBtn" type="button" value="是" style="padding-left:12px;padding-right:12px; outline:none; display:inline;" /><input class="noBtn" type="button" value="否" style="padding-left:12px;padding-right:12px; outline:none; margin-left:16px; display:inline;" /></div></div>');
    $(content).find('.message').html(msg);

    var win = new CSUIWin({ title: '确认', html: content, width: 'auto', height: 'auto' });
    win.show();
    $(content).find('input[class=yesBtn]').click(function () {
        if (callback != null) {
            callback('yes');
        }
        win.close();
    });
    $(content).find('input[class=noBtn]').click(function () {
        if (callback != null) {
            callback('no');
        }
        win.close();
    });

    $(content).find('input[class=noBtn]').focus();
};/*res CSUI*/
