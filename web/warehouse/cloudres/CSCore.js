/*键值配对集合*/
function CSKeyValBox() {
    var _kvItems = [];

    this.setItemVal = function (key, val) {
        if (key != null && val == null) {
            /*删除指定项*/
            for (var i = 0; i < _kvItems.length; i++) {
                if (_kvItems[i].key.toLowerCase() == key.toLowerCase()) {
                    _kvItems.splice(i, 1);
                    break;
                }
            }
        }
        else {
            var hasFind = false;
            for (var i = 0; i < _kvItems.length; i++) {
                if (_kvItems[i].key.toLowerCase() == key.toLowerCase()) {
                    _kvItems[i].val = val;
                    hasFind = true;
                    break;
                }
            }
            if (!hasFind) {
                _kvItems.push({ key: key, val: val });
            }
        }
    };

    this.getItemVal = function (key) {
        for (var i = 0; i < _kvItems.length; i++) {
            if (_kvItems[i].key.toLowerCase() == key.toLowerCase()) {
                return _kvItems[i].val;
            }
        }
        return null;
    };

    this.getAllItemVals = function () {
        var t_arr = [];
        for (var i = 0; i < _kvItems.length; i++) {
            t_arr.push(_kvItems[i].val);
        }
        return t_arr;
    };
}
/*工具箱*/
function CSWorkbox() {
    function _log(msg) {
        try {
            console.log(msg);
        } catch (exc) {

        }
    }

    function _includeJsFile(src, callback) {
        var script = document.createElement("SCRIPT"), done = false;
        script.type = "text/javascript";
        script.src = src;
        script.charset = "UTF-8";
        script.onload = script.onreadystatechange = function () {
            if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                done = true;
                if (callback != null) {
                    callback();
                }
            }
        };
        document.body.appendChild(script);
    }

    function _includeJsFiles(srcArr, callback) {
        if (srcArr == null || srcArr.length == 0) {
            if (callback != null) {
                callback();
            }
        }
        else {
            var t_obj = { arr: srcArr };
            t_obj.needLoadCount = srcArr.length;
            t_obj.curLoadIndex = 0;
            t_obj.onLoadFunc = function () {
                if (t_obj.curLoadIndex <= t_obj.needLoadCount - 1) {
                    var t_index = t_obj.curLoadIndex++;
                    _log('动态加载js -> (' + t_obj.arr[t_index] + ')');
                    _includeJsFile(srcArr[t_index], function () {
                        t_obj.onLoadFunc();
                    });
                }
                else {
                    if (callback != null) {
                        callback();
                    }
                }
            };
            t_obj.onLoadFunc();
        }
    }
    /*用纯js动态引用js文件*/
    this.includeJsFile = function (src, callback) {
        _includeJsFile(src, callback);
    };
    /*用纯js动态引用多个js文件*/
    this.includeJsFiles = function (srcArr, callback) {
        _includeJsFiles(srcArr, callback);
    };
    /*用纯js动态引用css文件*/
    this.includeCssFile = function (src, callback) {
        var el = document.createElement("link"), done = false;
        el.type = "text/css";
        el.rel = 'stylesheet';
        el.href = src;
        el.charset = "UTF-8";
        el.onload = el.onreadystatechange = function () {
            if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                done = true;
                if (callback != null) {
                    callback();
                }
            }
        };
        document.body.appendChild(el);
    };
    /*加载资源文件*/
    this.includeResFiles = function (srcArr, completeCallback, progressCallback) {
        if (srcArr == null || srcArr.length == 0) {
            if (progressCallback != null) {
                /*每个加载后触发（当前加载的数，总共要加载的数）*/
                progressCallback(0, 0);
            }
            if (completeCallback != null) {
                completeCallback();
            }
        }
        else {
            var me = this;

            var t_obj = { arr: srcArr };
            t_obj.needLoadCount = srcArr.length;
            t_obj.curLoadIndex = 0;
            t_obj.onLoadResComplete = function () {
                t_obj.curLoadIndex++;
                if (progressCallback != null) {
                    /*每个加载后触发（当前加载的数，总共要加载的数）*/
                    progressCallback(t_obj.curLoadIndex, srcArr.length);
                }

                if (t_obj.curLoadIndex == t_obj.needLoadCount) {
                    /*所有都加载完毕*/
                    if (completeCallback != null) {
                        completeCallback();
                    }
                }
                else {
                    /*继续加载下一个*/
                    t_obj.onLoadFunc();
                }
            };
            t_obj.onLoadFunc = function () {
                var t_index = t_obj.curLoadIndex;
                var t_url = srcArr[t_index];
                if (t_url.toLowerCase().lastIndexOf('.js') != -1) {
                    me.includeJsFile(t_url, function () {
                        t_obj.onLoadResComplete();
                    });
                }
                else if (t_url.toLowerCase().lastIndexOf('.css') != -1) {
                    me.includeCssFile(t_url, function () {
                        t_obj.onLoadResComplete();
                    });
                }
                else {
                    CSJS.log('无法加载未能识别的资源 -> ' + t_url);
                    t_obj.onLoadResComplete();
                }
            };
            t_obj.onLoadFunc();
        }
    };
    /*获得url参数*/
    this.queryString = function (name, _window) {
        var t_window = null;
        if (_window != null) {
            t_window = _window;
        }
        else {
            t_window = window;
        }

        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = t_window.location.search.substr(1).match(reg);
        if (r != null)
            return r[2]; /*unescape(r[2]);*/
        return '';
    };
    /*获得文件的类型组*/
    this.getFileTypeGroupName = function (fileName) {
        if (fileName != null) {
            var imgTypeArr = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];
            var videoTypeArr = [".flv", ".mpeg", ".mpeg-1", ".mpeg-2", ".mpeg-3", ".mpeg-4", ".wmv", ".rmvb", ".avi", ".mov", ".asf", ".navi", ".3gp", ".mkv"];
            var docTypeArr = [".doc", ".docx", ".xls", ".xlsx", ".pdf", ".pdfx", ".rtf", ".txt", ".odt"];
            var t_fileName = fileName.toLowerCase();

            for (var i = 0; i < imgTypeArr.length; i++) {
                if (t_fileName.lastIndexOf(imgTypeArr[i]) != -1) {
                    return 'image';
                }
            }

            for (var i = 0; i < videoTypeArr.length; i++) {
                if (t_fileName.lastIndexOf(videoTypeArr[i]) != -1) {
                    return 'video';
                }
            }

            for (var i = 0; i < docTypeArr.length; i++) {
                if (t_fileName.lastIndexOf(docTypeArr[i]) != -1) {
                    return 'document';
                }
            }
        }
        return null;
    };
}
/*指令处理器*/
function CSCmdProc() {
    var _cmdProcCell_keyValBox = new CSKeyValBox();
    /*执行指令 cmd:例 { key: 'do1', params: { p: '1' }, callback: function(){} }*/
    this.execCmd = function (cmd) {
        var procCell = _cmdProcCell_keyValBox.getItemVal(cmd.key);
        if (procCell != null) {
            if (procCell.func != null) {
                procCell.func(cmd);
            }
        }
    };
    /*cmdProcCell:例 { key: 'do1', func: function(params){} }*/
    this.setCmdProcCell = function (cmdProcCell) {
        _cmdProcCell_keyValBox.setItemVal(cmdProcCell.key, cmdProcCell);
    };
}
/*功能尝试执行单元（name:名称，func:执行函数，cfg:详细配置）*/
function CSTryActionCell(name, func, cfg) {
    var _delay = 0;
    var _tryDelay = 600;
    var _onSuccessCallback = function () { };

    function _log(msg) {
        try {
            console.log(msg);
        } catch (exc) {

        }
    }

    function _touchSuccessCallback() {
        _onSuccessCallback(name);
    }

    function _start() {
        try {
            func(_touchSuccessCallback);
            _log('尝试性执行' + name + '成功');
        } catch (exc) {
            setTimeout(_start, _tryDelay);
            _log('尝试性执行' + name + '失败 -> ' + exc.message);
        }
    }

    this.name = function () {
        return name;
    };

    this.setOnSuccessCallback = function (func) {
        if (func != null) {
            _onSuccessCallback = func;
        }
        return _onSuccessCallback;
    };

    this.start = function () {
        setTimeout(function () {
            _start();
        }, _delay);
    };

    this.touchSuccessCallback = function () {
        _touchSuccessCallback();
    };

    {
        if (cfg != null) {
            if (cfg.delay != null) {
                _delay = cfg.delay;
            }
            if (cfg.tryDelay != null) {
                _tryDelay = cfg.tryDelay;
            }
            if (cfg.onSuccessCallback != null) {
                _onSuccessCallback = cfg.onSuccessCallback;
            }
        }
    }
}

CSJS = { version: 'v1.2' };
csc = CSJS;
/**/
CSJS.log = function (msg, elId) {
    if (elId == null) {
        try { console.log(msg); } catch (exc) { }
    }
    else {
        var el = document.getElementById(elId);
        el.innerHTML = '<div style="border-bottom:1px solid silver; padding-top:3px; padding-bottom:3px;">' + msg + '</div>' + el.innerHTML;
    }
};
/*生成唯一id(32位)*/
CSJS.newId = function () {
    var now = new Date();
    var id = '';
    /*1*/
    id += now.getFullYear();
    id += Math.random().toString().replace('0.', '').substr(0, 4);
    /*2*/
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
    /*3*/
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
    /*4*/
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
CSJS.newGuid = function () {
    function s4() { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};
/*去除空白字符*/
CSJS.trim = function (val) {
    if (val != null) {
        var t_val = val;
        while (t_val.indexOf(' ') != -1) {
            t_val = t_val.replace(' ', '');
        }
        return t_val;
    }
    return '';
};
/**/
CSJS.replace = function (srcVal, oldVal, newVal) {
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
/**/
CSJS.toDateStr = function (date) {
    if (date instanceof Date) {

    }
    else if (date == null || date == '' || date == 'null') {
        return '';
    }
    else {
        date = new Date(date.replace('T', ' '));
    }

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
/**/
CSJS.toTimeStr = function (date, noSecond) {
    if (date instanceof Date) {

    }
    else if (date == null || date == '' || date == 'null') {
        return '';
    }
    else {
        date = new Date(date.replace('T', ' '));
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

    return h + ':' + m + (noSecond != true ? (':' + s) : '');
};

CSJS.toDateTimeStr = function (date, noSecond) {
    if (date instanceof Date) {

    }
    else if (date == null || date == '' || date == 'null') {
        return '';
    }
    else {
        date = new Date(date.replace('T', ' '));
    }

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
/*
时间戳转时间；
时间转时间戳10位，例：Math.round(new Date().getTime()/1000)
时间转时间戳13位，例：Math.round(new Date().getTime())
*/
CSJS.timestampToTime = function (timestamp) {
    if (typeof timestamp == 'string') {
        timestamp = parseInt(timestamp);
    }
    /*时间戳为10位需*1000，时间戳为13位的话不需乘1000*/
    var date = null;
    if (timestamp.toString().length == 10) {
        date = new Date(timestamp * 1000);
    }
    else {
        date = new Date(timestamp);
    }
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return Y + M + D + h + m + s;
};
/**/
CSJS.workbox = new CSWorkbox();
/*查询url参数值*/
CSJS.queryString = function (name, _window) {
    return CSJS.workbox.queryString(name, _window);
};
CSJS.requireJS = function (url) {
    $(document.body).append("<script src=\"" + url + "\" type=\"text/javascript\" />");
};
CSJS.requireCSS = function (url) {
    $(document.body).append("<link href=\"" + url + "\" rel=\"stylesheet\" type=\"text/css\" />");
};
/*动态引用js文件*/
CSJS.includeJsFile = function (src, callback) {
    return CSJS.workbox.includeJsFile(src, callback);
};
/*动态引用多个js文件*/
CSJS.includeJsFiles = function (srcArr, callback) {
    return CSJS.workbox.includeJsFiles(srcArr, callback);
};
/*动态引用css文件*/
CSJS.includeCssFile = function (src, callback) {
    return CSJS.workbox.includeCssFile(src, callback);
};
/*动态引用多个资源文件*/
CSJS.includeResFiles = function (srcArr, completeCallback, progressCallback) {
    CSJS.workbox.includeResFiles(srcArr, completeCallback, progressCallback);
};
/*尝试执行*/
CSJS.tryAction = function (name, func, cfg) {
    var tryActionCell = new CSTryActionCell(name, func, cfg);
    tryActionCell.start();
};
/*运行加载队列（name:本次加载队列的名称）*/
CSJS.runLoadQueue = function (name, tryActionCellArr, afterLoadOneFunc, afterLoadAllFunc) {
    var curIndex = 0;

    var onSuccessNotifyFunc = function () {
        if (afterLoadOneFunc != null) {
            afterLoadOneFunc(curIndex, tryActionCellArr[curIndex]);
        }
        /*执行下一个单元*/
        if (curIndex < tryActionCellArr.length - 1) {
            tryActionCellArr[++curIndex].start();
        }
        else {
            if (afterLoadAllFunc != null) {
                afterLoadAllFunc();
            }
        }
    };

    if (tryActionCellArr != null && tryActionCellArr.length > 0) {
        /*初始化*/
        for (var i = 0; i < tryActionCellArr.length; i++) {
            tryActionCellArr[i].setOnSuccessCallback(function (name) {
                onSuccessNotifyFunc();
            });
        }
        /*执行第一个单元*/
        tryActionCellArr[curIndex].start();
    }
    else {
        if (afterLoadAllFunc != null) {
            afterLoadAllFunc();
        }
    }
};
/*判断是否运行在手机上*/
CSJS.isRunInMobile = function () {
    if (navigator.appVersion.toLocaleLowerCase().indexOf('iPhone OS'.toLocaleLowerCase()) != -1) {
        return true;
    }

    if (navigator.appVersion.toLocaleLowerCase().indexOf('Android'.toLocaleLowerCase()) != -1) {
        return true;
    }

    return false;
};
/*是否支持html5技术*/
CSJS.canH5 = function () {
    return window.applicationCache != null;
};

CSJS.stringToAscii = function (str) {
    return str.charCodeAt(0).toString(16);
};

CSJS.asciiToString = function (asccode) {
    return String.fromCharCode(asccode);
};

CSJS.encodeURI = function (unzipStr, isCusEncode) {
    if (isCusEncode) {
        var zipArray = new Array();
        var zipstr = "";
        var lens = new Array();
        for (var i = 0; i < unzipStr.length; i++) {
            var ac = unzipStr.charCodeAt(i);
            zipstr += ac;
            lens = lens.concat(ac.toString().length);
        }
        zipArray = zipArray.concat(zipstr);
        zipArray = zipArray.concat(lens.join("O"));
        return zipArray.join("N");
    } else {
        var zipstr = "";
        var strSpecial = "!\"#$%&'()*+,/:;<=>?[]^`{|}~%";
        var tt = "";

        for (var i = 0; i < unzipStr.length; i++) {
            var chr = unzipStr.charAt(i);
            var c = CSJS.stringToAscii(chr);
            tt += chr + ":" + c + "n";
            if (parseInt("0x" + c) > 0x7f) {
                zipstr += encodeURI(unzipStr.substr(i, 1));
            } else {
                if (chr == " ")
                    zipstr += "+";
                else if (strSpecial.indexOf(chr) != -1)
                    zipstr += "%" + c.toString(16);
                else
                    zipstr += chr;
            }
        }
        return zipstr;
    }
};

CSJS.decodeURI = function (zipStr, isCusEncode) {
    if (isCusEncode) {
        var zipArray = zipStr.split("N");
        var zipSrcStr = zipArray[0];
        var zipLens;
        if (zipArray[1]) {
            zipLens = zipArray[1].split("O");
        } else {
            zipLens.length = 0;
        }

        var uzipStr = "";

        for (var j = 0; j < zipLens.length; j++) {
            var charLen = parseInt(zipLens[j]);
            uzipStr += String.fromCharCode(zipSrcStr.substr(0, charLen));
            zipSrcStr = zipSrcStr.slice(charLen, zipSrcStr.length);
        }
        return uzipStr;
    } else {
        var uzipStr = "";

        for (var i = 0; i < zipStr.length; i++) {
            var chr = zipStr.charAt(i);
            if (chr == "+") {
                uzipStr += " ";
            } else if (chr == "%") {
                var asc = zipStr.substring(i + 1, i + 3);
                if (parseInt("0x" + asc) > 0x7f) {
                    uzipStr += decodeURI("%" + asc.toString() + zipStr.substring(i + 3, i + 9).toString()); ;
                    i += 8;
                } else {
                    uzipStr += CSJS.asciiToString(parseInt("0x" + asc));
                    i += 2;
                }
            } else {
                uzipStr += chr;
            }
        }
        return uzipStr;
    }
};

CSJS.clearHTML = function (val) {
    if (val != null) {
        var html = val.replace(/(<script>\s*(((?!<\/script>)(?:.|[\r\n]))*)\s*<\/script>)|(<style>\s*(((?!<\/style>)(?:.|[\r\n]))*)\s*<\/style>)|(<[^>]*>)|(&[^;]+;)/ig, '');
        return html;
    }
    return val;
};
/*已废弃*/
function CSConsole(cfg) {
    var _containerId = null;

    this.log = function (msg) {
        document.getElementById(_containerId).innerHTML = msg + '<br/>' + document.getElementById(_containerId).innerHTML;
    };

    {
        _containerId = cfg.containerId;
    }
}/*res view*/
