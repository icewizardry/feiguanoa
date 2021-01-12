function CSUICore() {
    var _me = this;

    this.tmpData = {};

    this.logContainerId = 'cs_ui_log1';

    this.hasPpdKey = function (key) {
        var topObj = _me.getWebTopObj();
        if (topObj.csaui != null) {
            return topObj.csaui.hasPpdKey(key);
        }
        else if (topObj.csapp != null) {
            return topObj.csapp.hasPpdKey(key);
        }
        _me.log('当前环境没有此功能');
        return false;
    };
    
    this.log = function (msg) {
        var topObj = _me.getWebTopObj();
        if (topObj.CSSuperShell != null && topObj.CSSuperShell.Version != null && topObj.CSSuperShell.Version != '') {
            topObj.CSSuperShell.Log(0, msg);
        }

        try {
            if (_me.logContainerId != null) {
                var item = $('<div>[' + _me.toTimeStr(new Date()) + ']&nbsp;' + msg + '</div>');
                $('#' + _me.logContainerId).append(item);
                item[0].scrollIntoView();
            }
        } catch (exc) { }

        try {
            console.log(msg);
        } catch (exc) { }
    };

    this.isIE = function () {
        if (navigator.userAgent.indexOf("compatible") != -1 || navigator.userAgent.toLowerCase().indexOf('msie') != -1) {
            return true;
        }
        return false;
    };

    this.canH5 = function () {
        return window.applicationCache != null;
    };

    this.isWindows = function () {
        if (navigator.userAgent.toLowerCase().indexOf("windows") != -1) {
            return true;
        }
        return false;
    };

    this.isIOS = function () {
        if (navigator.userAgent.toLowerCase().indexOf("iphone os") != -1) {
            return true;
        }
        return false;
    };

    this.isAndroid = function () {
        var t = navigator.userAgent.toLowerCase();
        if (t.indexOf('android') != -1 || t.indexOf('linux') != -1) {
            return true;
        }
        return false;
    };

    this.isQYWeiXin = function () {
        if (navigator.userAgent.toLowerCase().indexOf("micromessenger") != -1 && navigator.userAgent.toLowerCase().indexOf("wxwork") != -1) {
            return true;
        }
        return false;
    };

    this.isWeiXin = function () {
        if (navigator.userAgent.toLowerCase().indexOf("micromessenger") != -1 && navigator.userAgent.toLowerCase().indexOf("wxwork") == -1) {
            return true;
        }
        return false;
    };

    this.isMobile = function () {
        if (navigator.userAgent.toLowerCase().indexOf("mobile") != -1) {
            return true;
        }
        return false;
    };
    
    this.reqByCmd = function (cmd, pars, callback, svrUrl, callPars, timeout, tryCount) {
        if (svrUrl == null) {
            svrUrl = 'handler.ashx';
        }

        if (timeout == null) {
            timeout = 1000 * 30;
        }

        var type = 'POST';
        var async = true;
        if (pars != null && pars.cs_req_type != null) type = pars.cs_req_type;
        if (pars != null && pars.cs_req_async != null) async = pars.cs_req_async;

        var reqUrl = svrUrl;
        if (reqUrl.indexOf('?') != -1) {
            reqUrl = reqUrl + '&cmd=' + cmd;
        }
        else {
            reqUrl = reqUrl + '?cmd=' + cmd;
        }

        $.ajax({
            type: type,
            url: reqUrl,
            data: pars,
            async: async,
            timeout: timeout,
            success: function (txt) {
                var r = eval('(' + txt + ')');

                if (callback != null) {
                    callback(r, callPars);
                }
            },
            error: function (r) {
                if (tryCount == null) {
                    tryCount = 1;
                }
                else {
                    tryCount++;
                }

                if (tryCount >= 3) {
                    if (callback != null) {
                        callback({ success: false, msg: '请求失败，可能网络或服务器当前不可用，已尝试' + tryCount + '次' }, callPars);
                    }
                }
                else {
                    _me.reqByCmd(cmd, pars, callback, svrUrl, callPars, timeout, tryCount);
                }
            }
        });
    };

    this.reqByUrl = function (url, pars, callback, callPars, timeout, tryCount) {
        if (timeout == null) {
            timeout = 1000 * 30;
        }

        var type = 'POST';
        var async = true;
        if (pars != null && pars.cs_req_type != null) type = pars.cs_req_type;
        if (pars != null && pars.cs_req_async != null) async = pars.cs_req_async;

        $.ajax({
            type: type,
            url: url,
            data: pars,
            async: async,
            timeout: timeout,
            success: function (txt) {
                var r = eval('(' + txt + ')');

                if (callback != null) {
                    callback(r, callPars);
                }
            },
            error: function (r) {
                if (tryCount == null) {
                    tryCount = 1;
                }
                else {
                    tryCount++;
                }

                if (tryCount >= 3) {
                    if (callback != null) {
                        callback({ success: false, msg: '请求失败，可能网络或服务器当前不可用，已尝试' + tryCount + '次' }, callPars);
                    }
                }
                else {
                    _me.reqByUrl(url, pars, callback, callPars, timeout, tryCount);
                }
            }
        });
    };
    
    this.getRootUrl = function () {
        var rootUrl = location.protocol + "/" + "/" + location.host;
        return rootUrl;
    };

    this.newId = function () {
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
    };

    this.newGuid = function () {
        function s4() { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };
    
    this.queryString = function (name, _window) {
        var t_window = null;
        if (_window != null) {
            t_window = _window;
        }
        else {
            t_window = window;
        }

        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = t_window.location.search.substr(1).match(reg);
        if (r != null)
            return r[2]; 
        return '';
    };
    
    this.queryStringAll = function () {
        var pars = {};
        var str = location.href;
        if (str.indexOf('?') != -1) {
            str = str.split('?')[1];
            var reg = new RegExp('([^=&?]+)=([^=&]+)', 'gi');
            for (var i = 0; i < 6; i++) {
                var regR = reg.exec(str);
                if (regR == null) {
                    break;
                }
                pars[regR[1]] = regR[2];
            }
        }
        return pars;
    };
    
    this.trim = function (val) {
        if (val != null) {
            var t_val = val;
            while (t_val.indexOf(' ') != -1) {
                t_val = t_val.replace(' ', '');
            }
            return t_val;
        }
        return '';
    };
    
    this.replaceForChar = function (srcVal, oldVal, newVal) {
        for (var i = 0; i < srcVal.length; i++) {
            if (srcVal[i] == oldVal) {
                srcVal[i] = newVal;
            }
        }
        return srcVal;
    };
    
    this.replace = function (srcVal, oldVal, newVal) {
        try {
            return srcVal.replace(eval('/' + oldVal + '/g'), newVal);
        } catch (exc) {
            var str = srcVal;
            if (str != null && oldVal != newVal) {
                var count = 0;
                while (str.indexOf(oldVal) != -1) {
                    if (count > str.length) {
                        throw new Error('替换次数过多');
                    }
                    str = str.replace(oldVal, newVal);
                    count++;
                }
                return str;
            }
            return srcVal;
        }
    };
    
    this.requireJS = function (url) {
        $(document.body).append("<script src=\"" + url + "\" type=\"text/javascript\" />");
    };
    
    this.toFileLengthName = function (byteLength) {
        if (byteLength >= 1024 * 1024 * 1024) {
            //GB
            return (byteLength / 1024 / 1024 / 1024).toFixed(2) + "GB";
        }
        else if (byteLength >= 1024 * 1024) {
            //MB
            return (byteLength / 1024 / 1024).toFixed(2) + "MB";
        }
        else if (byteLength >= 1024) {
            //KB
            return (byteLength / 1024).toFixed(2) + "KB";
        }
        else {
            //B
            return byteLength.toFixed(2) + "B";
        }
    };

    this.ConvertToDate = function (date) {
        if (date instanceof Date) {

        }
        else if (date == null || date == '' || date == 'null') {
            return '';
        }
        else {
            var dateStr = date.replace('T', ' ').replace(/[.][^.]+/g, '');
            /*
            if (_me.isIE() && dateStr.indexOf('-') != -1) {
            date = dateStr.replace(/[-]/g, '/');
            }
            if (_me.isIE() && dateStr.indexOf('.') != -1) {
                date = dateStr.replace(/[.]\d+/g, '');
            }*/
            date = new Date(dateStr);

            if (date.toJSON() == null) {
                if (dateStr.indexOf('-') != -1) {
                    date = new Date(dateStr.replace(/[-]/g, '/'));
                }
                else if (dateStr.indexOf('/') != -1) {
                    date = new Date(dateStr.replace(/[\/]/g, '-'));
                }
            }
        }
        return date;
    };
    
    this.toDateStr = function (date) {
        date = _me.ConvertToDate(date);
        if (date == '') return '';

        var id = '';
        id += date.getFullYear();
        id += '-';
        if ((date.getMonth() + 1) < 10) {
            id += '0' + (date.getMonth() + 1);
        }
        else {
            id += (date.getMonth() + 1);
        }
        id += '-';
        if (date.getDate() < 10) {
            id += '0' + date.getDate();
        }
        else {
            id += date.getDate();
        }

        return id;
    };
    
    this.toTimeStr = function (date, noSecond) {
        /*
        if (date instanceof Date) {

        }
        else if (date == null || date == '' || date == 'null') {
            return '';
        }
        else {
            if (_me.isIE() && date.indexOf('.') != -1) {
                date = date.replace(/[.]\d+/g, '');
            }
            date = new Date(date.replace('T', ' '));
        }*/
        date = _me.ConvertToDate(date);
        if (date == '') return '';

        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();

        if (h < 10) {
            h = '0' + h;
        }
        if (m < 10) {
            m = '0' + m;
        }
        if (s < 10) {
            s = '0' + s;
        }

        return h + ':' + m + (noSecond != true ? (':' + s) : '');
    };

    this.toDateTimeStr = function (date, noSecond) {
    /*
        if (date instanceof Date) {

        }
        else if (date == null || date == '' || date == 'null') {
            return '';
        }
        else {
            if (_me.isIE() && date.indexOf('-') != -1) {
                date = date.replace(/[-]/g, '/');
            }
            if (_me.isIE() && date.indexOf('.') != -1) {
                date = date.replace(/[.]\d+/g, '');
            }
            date = new Date(date.replace('T', ' '));
        }*/
        date = _me.ConvertToDate(date);
        if (date == '') return '';

        var id = '';
        id += date.getFullYear();
        id += '-';
        if ((date.getMonth() + 1) < 10) {
            id += '0' + (date.getMonth() + 1);
        }
        else {
            id += (date.getMonth() + 1);
        }
        id += '-';
        if (date.getDate() < 10) {
            id += '0' + date.getDate();
        }
        else {
            id += date.getDate();
        }

        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();

        if (h < 10) {
            h = '0' + h;
        }
        if (m < 10) {
            m = '0' + m;
        }
        if (s < 10) {
            s = '0' + s;
        }

        return id + ' ' + h + ':' + m + (noSecond != true ? (':' + s) : '');
    };
    
    this.transferFormToObj = function (selectorJq, obj) {
        var elPropName = 'name';
        var cbxData = {};

        selectorJq.each(function (i, n) {
            if ($(n).attr(elPropName) != null && $(n).attr(elPropName) != '') {
                var val = '';
                if (n.cs_ui_textBoxWatermark != null) {
                    val = n.cs_ui_textBoxWatermark.val();
                }
                else {
                    val = $(n).val();
                }

                if ($(n).is('input') && $(n).attr('type') == 'checkbox' && $(n).attr('name') != null && $(n).attr('name') != '' && (val == '1' || val == 'true')) {
                    
                    if (val == '1') {
                        if (n.checked) {
                            obj[$(n).attr(elPropName)] = '1';
                        }
                        else {
                            obj[$(n).attr(elPropName)] = '0';
                        }
                    }
                    else if (val == 'true') {
                        if (n.checked) {
                            obj[$(n).attr(elPropName)] = 'true';
                        }
                        else {
                            obj[$(n).attr(elPropName)] = 'false';
                        }
                    }
                }
                else if ($(n).is('input') && $(n).attr('type') == 'checkbox' && $(n).attr('name') != null && $(n).attr('name') != '') {
                    
                    var data = cbxData[$(n).attr('name')];
                    if (data == null) {
                        data = [];
                        cbxData[$(n).attr('name')] = data;
                    }
                    if (n.checked) {
                        data.push(val);
                    }
                }
                else if ($(n).is('input') && $(n).attr('type') == 'radio' && $(n).attr('name') != null && $(n).attr('name') != '') {
                    if (n.checked) {
                        obj[$(n).attr(elPropName)] = n.value;
                    }
                }
                else {
                    obj[$(n).attr(elPropName)] = val;
                }
            }
        });

        for (var prop in cbxData) {
            var data = cbxData[prop];
            var str = '';
            for (var i = 0; i < data.length; i++) {
                if (i != 0) {
                    str += '|';
                }
                str += data[i];
            }
            obj[prop] = str;
        }
    };

    this.transferObjToForm = function (obj, selectorJq) {
        for (var pro in obj) {
            var ts = selectorJq.find('*[name=' + pro + ']');
            ts.each(function (i, n) {
                var t = $(n);
                if (t.is('input') && t.attr('type') == 'checkbox') {
                    
                    if (obj[pro] != null && (obj[pro] == '1' || obj[pro].toString().toLowerCase() == 'true')) {
                        t.attr('checked', true);
                    }
                    else {
                        
                        if (t.val() != '' && (t.val() == obj[pro].toString() || (obj[pro].toString().indexOf('|') != -1 && obj[pro].toString().indexOf(t.val()) != -1))) {
                            t.attr('checked', true);
                        }
                        else {
                            t.attr('checked', false);
                        }
                    }
                }
                else if (t.is('input') && t.attr('type') == 'radio') {
                    if (obj[pro] == t.val()) {
                        t.attr('checked', true);
                    }
                }
                else {
                    if (t != null && t[0] != null && t[0].cs_ui_textBoxWatermark != null) {
                        t[0].cs_ui_textBoxWatermark.val(obj[pro]);
                        t[0].cs_ui_textBoxWatermark.check();
                    }
                    else if (t != null && t.val != null) {
                        t.val(obj[pro]);
                    }
                }
            });
        }
    };

    this.transferObjToTpl = function (obj, tpl) {
        for (var pro in obj) {
            tpl = _me.replace(tpl, '{' + pro + '}', obj[pro]);
        }
        return tpl;
    };

    this.clearHTML = function (val) {
        if (val != null) {
            var html = val.replace(/(<script>\s*(((?!<\/script>)(?:.|[\r\n]))*)\s*<\/script>)|(<style>\s*(((?!<\/style>)(?:.|[\r\n]))*)\s*<\/style>)|(<[^>]*>)|(&[^;]+;)/ig, '');
            return html;
        }
        return val;
    };
    
    this.isSameDomainPage = function (w1, w2) {
        if (w1.location.href.match(/http[s]*:\/\/[^\/]+/)[0].toLowerCase() == w2.location.href.match(/http[s]*:\/\/[^\/]+/)[0].toLowerCase()) {
            return true;
        }
        return false;
    };
    
    this.getWebTopObj = function () {
        var topObj;

        try {
            
            var t = top.CSSuperShell;
            
            if (!_me.isSameDomainPage(top, window)) {
                throw new Error('不是本域内页面');
            }
            topObj = top;
        } catch (exc) {
            
            
            var t_top;
            for (var i = 0; i < 99; i++) {
                if (i == 0) {
                    try {
                        var t = parent.CSSuperShell;
                        
                        if (!_me.isSameDomainPage(parent, window)) {
                            throw new Error('不是本域内页面');
                        }
                        t_top = parent;
                    } catch (exc) {
                        
                        topObj = window;
                        break;
                    }
                }
                else {
                    try {
                        var t = t_top.parent.CSSuperShell;
                        
                        if (!_me.isSameDomainPage(t_top.parent, window)) {
                            throw new Error('不是本域内页面');
                        }
                        t_top = t_top.parent;
                    } catch (exc) {
                        
                        topObj = t_top;
                        break;
                    }
                }
            }
        }

        return topObj;
    };
    
    this.autoInvokeFunc = function (cfg) {
        if (cfg.interval == null) {
            cfg.interval = 500;
        }

        if (cfg.invokeObj[cfg.funcName] != null) {
            cfg.invokeObj[cfg.funcName]();
        }
        else {
            var canTry = true;
            if (cfg.maxTryCount != null) {
                if (cfg.hasTryCount == null) {
                    cfg.hasTryCount = 0;
                }

                if (cfg.hasTryCount >= cfg.maxTryCount) {
                    canTry = false;
                    csui.log('已达最大尝试次数');
                }
                else {
                    cfg.hasTryCount++;
                }
            }

            if (canTry) {
                csui.log('尝试再次调用函数“' + cfg.funcName + '”...');
                setTimeout(function () { _me.autoInvokeFunc(cfg); }, cfg.interval);
            }
        }
    };
}

window.csui = new CSUICore();/*res CSUI*/
