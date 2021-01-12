if (this.CSUI == null) {
    this.CSUI = { mainAreaId: CSJS.newId() };
}

if (CSUI.style == null) {
    CSUI.style = {};
}

CSUI.getMainAreaEl = function () {
    var divEl = document.getElementById(CSUI.mainAreaId);
    if (divEl == null) {
        divEl = document.createElement('div');
        divEl.id = CSUI.mainAreaId;
        document.body.appendChild(divEl);
    }

    return divEl;
};

CSUI.style.winBorder = '1px solid #E3E3E3';

CSUI.style.winBorderColor = '#E3E3E3';

CSUI.style.winBackgroundColor = 'white';

CSUI.style.winContentFontColor = 'black';

CSUI.style.winContentFontSize = '16px';

CSUI.style.winBorderShadow = '6px 6px 8px black';

CSUI.style.btnBackgroundColor = '#006DBA';

CSUI.style.btnFontColor = '#B7CDDC';

CSUI.style.baseZIndex = 2000010;

CSUI.createBtnToHTML = function (id, text, style) {
    return '<table id="' + id + '" style="background-color:' + CSUI.style.btnBackgroundColor + '; width:80px; border-radius: 6px; cursor: pointer; ' + style + '"><tr><td style=" white-space:nowrap; text-align:center; font-size:12px; font-weight:bold; color:' + CSUI.style.btnFontColor + ';">' + text + '</td></tr></table>';
};

CSUI.addEventListener = function (elId, eventName, handler) {
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var elEvent = eval('document.getElementById("' + elId + '").on' + eventName + ' = handler;');
    }
    else {
        document.getElementById(elId).addEventListener(eventName, handler);
    }
};

CSUI.removeEventListener = function (elId, eventName, handler) {
    if (navigator.appName == 'Microsoft Internet Explorer') {
        eval('document.getElementById("' + elId + '").on' + eventName + ' = null;');
    }
    else {
        document.getElementById(elId).removeEventListener(eventName, handler);
    }
};

CSUI.setTapEventListener = function (elId, handler) {
    CSUI.removeEventListener(elId, 'click', handler);
    CSUI.addEventListener(elId, 'click', handler);
}

CSUI.decorateBtn = function (elId, handler) {
    CSJS.tryAction('装饰按钮' + elId, function () {
        document.getElementById(elId).className = 'cs_up_btn1';
        CSUI.setTapEventListener(elId, handler);
    });
};

CSUI.setEventListenerForMsgBtnOk = function () {
    var handler = function (event) {
        CSJS.log('触发点击事件');
        CSUI.hideMsg();
    };
    CSUI.setTapEventListener('msg_btn_ok', handler);
};

CSUI.setEventListenerForConfirmBtnYes = function () {
    var handler = function (event) {
        CSJS.log('触发点击事件');
        CSUI.hideConfirm();
        CSUI.confirmCallback('yes');
    };
    CSUI.setTapEventListener('confirm_btn_yes', handler);
};

CSUI.setEventListenerForConfirmBtnNo = function () {
    var handler = function (event) {
        CSJS.log('触发点击事件');
        CSUI.hideConfirm();
        CSUI.confirmCallback('no');
    };
    CSUI.setTapEventListener('confirm_btn_no', handler);
};

CSUI.showShadowBg = function (pKey, cfg) {
    var key = 'csShadowBgArea';

    if (pKey != null) {
        key = pKey;
    }

    if (document.getElementById(key) != null) {
        CSUI.getMainAreaEl().removeChild(document.getElementById(key));
    }

    var zIndex = ++CSUI.style.baseZIndex;

    if (cfg != null) {
        if (cfg.zIndex != null) {
            zIndex = cfg.zIndex;
        }
    }
    var _html = '';
    _html += '<div id="' + key + '" style="position: fixed;left: 0px;top: 0px;right: 0px;bottom: 0px;background-color: #C7C7C7; opacity: 0.80;-moz-opacity: 0.80;filter: alpha(opacity=80);z-index: ' + zIndex + ';"></div>';
    CSUI.getMainAreaEl().innerHTML += _html;
};

CSUI.hideShadowBg = function (pKey) {
    var key = 'csShadowBgArea';

    if (pKey != null) {
        key = pKey;
    }

    var obj = document.getElementById(key);
    if (obj != null) {
        if (obj != null) {
            CSUI.getMainAreaEl().removeChild(obj);
        }
    }
};

CSUI.showLoadingShadowBgArea = function () {
    CSUI.showShadowBg('csLoadingShadowBgArea');
};

CSUI.hideLoadingShadowBgArea = function () {
    CSUI.hideShadowBg('csLoadingShadowBgArea');
};

CSUI.showWin = function (key, cfg) {
    if (cfg.noShadowBg == true) {
    }
    else {
        CSUI.showShadowBg('shadowBg_' + key);
    }

    var jr_str1 = '';
    var zIndex = ++CSUI.style.baseZIndex;

    if (cfg != null) {
        if (cfg.zIndex != null) {
            zIndex = cfg.zIndex;
        }
    }

    
    if (navigator.appName == 'Microsoft Internet Explorer' && navigator.appVersion.indexOf('4.0') == 0) {
        jr_str1 = 'position:fixed; width:100%;';
    }

    var tpl = '<div id="' + key + '" style="position:fixed; left:0px; top:0px; right:0px; bottom:0px; z-index:' + zIndex + '; ' + (cfg.style != null ? cfg.style : '') + '"><table style="' + jr_str1 + 'height: 100%; line-height: 100%; margin:auto;"><tr><td style="text-align: center; vertical-align: middle;">{csrc:content}</td></tr></table></div>';

    if (document.getElementById(key) != null) {
        CSUI.getMainAreaEl().removeChild(document.getElementById(key));
    }

    var _html = '';
    _html += tpl.replace('{csrc:content}', cfg.html);
    CSUI.getMainAreaEl().innerHTML += _html;
};

CSUI.showWin1 = function (key, cfg) {
    var html = '<table style="margin:auto; border-collapse:collapse; border-spacing:0; border:' + CSUI.style.winBorder + '; background-color:' + CSUI.style.winBackgroundColor + '; box-shadow:' + CSUI.style.winBorderShadow + '; ' + (cfg.style != null ? cfg.style : '') + '">' +
        '<tr>' +
        '<td style="text-align:center; font-family: \'Microsoft YaHei\', \'微软雅黑\'; color:' + CSUI.style.winContentFontColor + ';">' +
        cfg.html +
        '</td>' +
        '</tr>' +
        '</table>';
    cfg.html = html;
    cfg.style = null;
    CSUI.showWin(key, cfg);
};

CSUI.hideWin = function (key) {
    var obj = document.getElementById(key);
    if (obj != null) {
        if (obj != null) {
            CSUI.getMainAreaEl().removeChild(obj);
        }
        CSUI.hideShadowBg('shadowBg_' + key);
    }
};

CSUI.setLoading = function (v) {
    if (v == true) {
        CSUI.showWin1('cs_loadingWin', { html: '<table style="margin: 8px 36px 8px 36px;"><tr><td style="font-size;12px; font-family: \'Microsoft YaHei\', \'微软雅黑\';">处理中...</td></tr></table>' });
    }
    else if (v == false) {
        CSUI.hideWin('cs_loadingWin');
    }
    else {
        CSUI.showWin1('cs_loadingWin', { html: '<table style="margin: 8px 36px 8px 36px;"><tr><td>' + v + '</td></tr></table>' });
    }
};

CSUI.showDefWin = function (cfg) {
    var key = 'csDefWinArea';
    CSUI.showWin(key, cfg);
};

CSUI.hideDefWin = function () {
    var key = 'csDefWinArea';
    CSUI.hideWin(key);
};

CSUI.showMsg = function (title, msg) {
    
    if (msg == null) {
        msg = title;
    }

    var html = '<table style="margin:auto; border-collapse:collapse; border-spacing:0;"><tr><td style="text-align:center; padding:12px; color:' + CSUI.style.winContentFontColor + '; font-size:' + CSUI.style.winContentFontSize + ';">' + msg + '</td></tr>' +
    '<tr><td><div style="background-color:#E3E3E3; width:100%; height:1px;"></div></td></tr>' +
    '<tr><td id="msg_btn_ok" style="text-align:center; line-height:30px; width:50%; padding:0px 46px 0px 46px; cursor:pointer; font-size:12px;">确定</td></tr>' +
    '</table>';

    CSUI.showWin1('csMsgArea', { html: html });

    CSUI.setEventListenerForMsgBtnOk();
};

CSUI.hideMsg = function () {
    CSUI.hideWin('csMsgArea');
};

CSUI.confirmCallback = function (btnKey) {

};

CSUI.showConfirm = function (title, msg, callback) {
    
    if (callback == null) {
        callback = msg;
        msg = title;
    }

    CSUI.confirmCallback = callback;

    var t_id = 'csConfirmArea'; // +CSJS.newId();

    var html = '<table style="margin:auto; border-collapse:collapse; border-spacing:0;">' +
    '<tr><td style="text-align:center; padding:12px; color:' + CSUI.style.winContentFontColor + '; font-size:' + CSUI.style.winContentFontSize + ';">' + msg + '</td></tr>' +
    '<tr><td><div style="background-color:#E3E3E3; width:100%; height:1px;"></div></td></tr>' +
    '<tr><td>' +
                    '<table style="width: 100%;border-collapse:collapse; border-spacing:0;"><tr>' +
                    '<td id="confirm_btn_no" style="text-align:center; line-height:30px; width:50%; padding:0px 46px 0px 46px; cursor:pointer; font-size:12px;">取消</td>' +
                    '<td style="width:1px;"><div style="background-color:#E3E3E3; height:30px; width:1px;"></div></td>' +
                    '<td id="confirm_btn_yes" style="text-align:center; line-height:30px; width:50%; padding:0px 46px 0px 46px; cursor:pointer; font-size:12px;">确定</td>' +
                    '</tr></table>'
    + '</td></tr></table>';

    CSUI.showWin1(t_id, { html: html });
    CSUI.setEventListenerForConfirmBtnYes();
    CSUI.setEventListenerForConfirmBtnNo();
};

CSUI.hideConfirm = function () {
    CSUI.hideWin('csConfirmArea');
};

CSUI.showTips = function (cfg) {
    var key = 'csui_tips';
    var jr_str1 = '';
    var zIndex = ++CSUI.style.baseZIndex;

    if (cfg != null) {
        if (cfg.zIndex != null) {
            zIndex = cfg.zIndex;
        }
        if (cfg.timeout == null) {
            cfg.timeout = 4000;
        }
    }

    
    if (navigator.appName == 'Microsoft Internet Explorer' && navigator.appVersion.indexOf('4.0') == 0) {
        jr_str1 = 'position:fixed; width:100%;';
    }

    var tpl = '{csrc:content}';
    if (document.getElementById(key) != null) {
        CSUI.getMainAreaEl().removeChild(document.getElementById(key));
    }

    var t_el = document.createElement('div');
    t_el.id = key;
    t_el.style.display = 'block';
    t_el.style.position = 'fixed';
    t_el.style.left = '50%';
    t_el.style.top = '50%';
    t_el.style.backgroundColor = '#F5F5F5';
    t_el.style.fontFamily = 'Verdana';
    t_el.style.fontSize = '20px';
    t_el.style.paddingLeft = '16px';
    t_el.style.paddingRight = '16px';
    t_el.style.paddingTop = '6px';
    t_el.style.paddingBottom = '6px';
    t_el.style.border = '1px solid transparent';
    t_el.style.borderRadius = '6px';
    t_el.innerHTML = cfg.msg;
    CSUI.getMainAreaEl().appendChild(t_el);

    t_el.style.marginLeft = '-' + t_el.offsetWidth / 2 + 'px';
    t_el.style.marginTop = '-' + t_el.offsetHeight / 2 + 'px';

    setTimeout(function () {
        if (document.getElementById(key) != null) {
            CSUI.getMainAreaEl().removeChild(document.getElementById(key));
        }
    }, cfg.timeout);
};/*res view*/
