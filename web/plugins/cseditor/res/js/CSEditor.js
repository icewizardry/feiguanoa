/// <reference path="../../../CSFlexUpload/res/js/CSFlexUpload.js" />
/*
https://developer.mozilla.org/en-US/docs/Web/API/Selection
*/

function CSCOM() {
    /*一般ie10和它之后就是新版*/
    this.isOldIE = function () {
        if (navigator.appVersion.toLowerCase().search('msie 6') != -1 || navigator.appVersion.toLowerCase().search('msie 7') != -1 || navigator.appVersion.toLowerCase().search('msie 8') != -1) {
            return true;
        }
        else if (navigator.appVersion.toLowerCase().search('msie 9') != -1 && navigator.appVersion.toLowerCase().search('trident/5') != -1) {
            return true;
        }
        return false;
    };

    this.isIE = function () {
        return navigator.userAgent.toLowerCase().indexOf("compatible") != -1 || navigator.userAgent.toLowerCase().indexOf('msie') != -1 || navigator.userAgent.toLowerCase().indexOf("trident") != -1 || navigator.appVersion.toLowerCase().search('msie ') != -1;
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

    /*调试消息面板*/
    var _logContainerId = 'debug';
    var _logContainer;
    this.log = function (msg) {
        if (_logContainer == null) {
            _logContainer = document.getElementById(_logContainerId);
        }

        if (_logContainer != null) {
            var item = $('<div>' + msg + '</div>');
            $(_logContainer).append(item);
            $(_logContainer)[0].scrollIntoView(item[0]);
        }
        else {
            try { console.log(msg); } catch (exc) { }
        }
    };
}

var cscom = new CSCOM();

window.csEditorCfg = {
    renderTo: 'if1',
    enableEdit: true,
    //border: '1px solid silver',
    openWindow: function (url) {
        try {
            var topObj = csui.getWebTopObj();
            if (topObj.CSSuperShell != null && topObj.CSSuperShell.Version != null && topObj.CSSuperShell.Version != '') {
                csui.log('调用CSSS打开地址...');
                topObj.CSSuperShell.ReqByCmd('callClient_OpenUrl', { url: url })
            }
            else if (window.CSClient != null && window.CSClient.OpenUrl != null) {
                csui.log('调用CSC打开地址...');
                window.CSClient.OpenUrl(url);
            }
            else {
                csui.log('调用def打开地址...');
                window.open(url, '_blank');
            }
        } catch (exc) {
            csui.log('调用路径发生异常 -> ' + exc.message);
        }
    },
    hasEditorBodyLoad: false,
    onEditorBodyLoadFuncs: new Array()
};

function CSEditor(cfg) {
    var _me = this;
    var _editorConMargin = 0;
    var _editorConCss = 'editorCon.css';
    var _editor = null;
    var _editorDoc = null;
    var _menuBarTop = null;


    var _colorSelector1;
    var _colorSelector2;

    function _buildUI() {

    }

    function _autoSize() {
    	if(cscom.isIOS()) {
    		$(_editor).parent().height((document.documentElement.clientHeight - _menuBarTop.offsetHeight - 0 - _editorConMargin * 2) + 'px');
    	}
    	else {
        	_editor.style.height = (document.documentElement.clientHeight - _menuBarTop.offsetHeight - 0 - _editorConMargin * 2) + 'px';
    	}
    }

    //支持ie7,8,9,10
    function _insertHtmlForIE(win, html) {
        //cscom.log('使用IE插入');
        var doc = win.document;
        if (doc.selection != null) {
            _me.focus(doc);
            //doc.body.focus();
            var range = null;
            if (cscom.isOldIE()) {
                range = _selectionRange;
            }
            else {
                range = doc.selection.createRange();
            }

            if (range == null) {
                alert('未能获得选中位置');
            }
            else {
                //range.select(); 
                //range.moveStart("character", -1);  
                range.pasteHTML(html);
            }
        }
    }
    //支持谷歌，火狐，edge（这必需用相同的docment对象来创建元素，否则会报错，下面已解决这问题）
    function _insertHtmlForC(win, html) {
        //cscom.log('使用非IE插入');
        //cscom.log(win.getSelection())
        if (win.getSelection().rangeCount == 0) {

        }
        else {
            var s = win.getSelection();
            var range = s.getRangeAt(0);

            _me.focus(win.document);
            //win.document.body.focus();
            /*这段代码会导致插入多项时，始终就插入最后一项（如果用了collapseToEnd就没这问题了）*/
            range.deleteContents();
            range.insertNode($(html, win.document)[0]);
            s.collapseToEnd(); //光标移动插入内容末尾
            //s.select(); //将当前选中区置为当前对象，执行  
            _me.focus(win.document);
            //win.document.body.focus();
        }
    }

    this.openUrl = function (url, el) {
        if (url == null || url == '') {
            if (el != null) {
                url = $(el).attr('data-url')
            }
        }
        cfg.openWindow(url);
    };

    this.init = function () {
        _editor = document.getElementById(cfg.renderTo);
        _editor.style.margin = _editorConMargin + 'px';
        _editorDoc = _editor.contentWindow.document;
        if (cfg.enableEdit == false) {
            _editorDoc.designMode = 'off';
        }
        else {
            _editorDoc.designMode = 'on';
        }
        _editorDoc.open();
        var script1 = '';
        //初始化右键菜单
        script1 = '\
        function initRightMenu() {\
        	\
            if(window.csuicm == null) {\
                window.csuicm = new CSUIContextMenu({canShowDefContextMenu:true});\
                window.csuicm.attach(".CSEditor_body",parent.getRightMenus(this));\
            }\
        	\
        }\
        ';
        
        //        $(_editorDoc).ready(function () {
        //            console.log(_editorDoc.body)
        //            $(_editorDoc.body).focus(function () {
        //                //当聚焦后触发
        //                
        //            });
        //        });
        //<!DOCTYPE html>
        _editorDoc.write("<html xmlns='http://www.w3.org/1999/xhtml'><head><link href='" + _editorConCss + "' rel='stylesheet' type='text/css' /><link href='?cmd=sys_101svc_getjs&tgt=CSUIContextMenu.css' rel='stylesheet' type='text/css' /><script src=\"js/jquery-1.11.2.min.js\" type=\"text/javascript\"></script><script src='?cmd=sys_101svc_getjs&tgt=CSUIContextMenu.js' type='text/javascript'></script><script>" + script1 + "</script></head><body class='CSEditor_body' contenteditable='" + cfg.enableEdit + "' spellcheck='false' style='cursor:text;' onload='initRightMenu(); parent.window.csEditorCfg.hasEditorBodyLoad=true; parent.window.onEditorContentLoaded(document);'></body></html>"); //document.body.focus();
        _editorDoc.close(); // contenteditable='true'
        //_me.setHtml('&nbsp;');
        /*兼容ie：无法在内部处罚onload事件*/
        if (cscom.isIE()) {
            $(_editor.contentWindow).load(function () {
                window.csEditorCfg.hasEditorBodyLoad = true;
                window.onEditorContentLoaded(document);
            });
            /*兼容ie：解决某些ie版本不会触发加载完毕时间的问题*/
            setTimeout(function () {
                if (!window.csEditorCfg.hasEditorBodyLoad) {
                    window.csEditorCfg.hasEditorBodyLoad = true;
                    window.onEditorContentLoaded(document);
                }
            }, 1600);
        }

        _menuBarTop = document.getElementById('menuBarTop');
        $('.editorBorder').css('border', cfg.border);

        $(window).resize(function () {
            _autoSize();
        });

        _autoSize();

        //_editorDoc.body.focus();
        try {
            if (_editorDoc.selection != null) { //通常是IE有这个问题 所有这里判断IE才执行该代码  
                var a = _editorDoc.selection.createRange(); //创建文本范围对象a  
                a.moveStart('character', 0); //更改范围起始位置/*如果count改为0就把光标放在text中的字符的最前面*/  
                a.collapse(true); //将插入点移动到当前范围的开始或结尾。  
                a.select(); //将当前选中区置为当前对象，执行     
            }
        } catch (e) {
            alert(e.message);
        }


        _colorSelector1 = new CSUIColorSelector({
            showType: 'cursor',
            onItemSelected: function (self, itemData, itemUI) {
                if (cscom.isOldIE()) {
                    _me.restoreSelectionRange();
                }
                _me.doCmd2('ForeColor', false, '#' + itemData.color);
                _me.saveToDrafts();
                window.onEditorContentChanged();
            }
        });
        _colorSelector1.init();

        _colorSelector2 = new CSUIColorSelector({
            showType: 'cursor',
            onItemSelected: function (self, itemData, itemUI) {
                if (cscom.isOldIE()) {
                    _me.restoreSelectionRange();
                }
                _me.doCmd2('BackColor', false, '#' + itemData.color);
                _me.saveToDrafts();
                window.onEditorContentChanged();
            }
        });
        _colorSelector2.init();
    };

    this.doCmd = function (a, b, c) {
        var hasFind = false;
        for (var i = 0; i < cfg.menuBarItemActs.length; i++) {
            if (cfg.menuBarItemActs[i].key == a) {
                if (cfg.menuBarItemActs[i].key == 'Drafts') {
                    cfg.menuBarItemActs[i].act(_me, null, function () {
                    });
                }
                else {
                    cfg.menuBarItemActs[i].act(_me, null, function () {
                        _me.saveToDrafts();
                    });
                }
                hasFind = true;
                break;
            }
        }

        if (!hasFind) {
            _editorDoc.execCommand(a, b, c);
            _me.saveToDrafts();
            window.onEditorContentChanged();
        }
    };

    this.doCmd2 = function (a, b, c) {
        _editorDoc.execCommand(a, b, c);
        _me.saveToDrafts();
    }

    this.focus = function (document) {
        if (document == null) {
            _editorDoc.body.focus();
        }
        else {
            document.body.focus();
        }
    };
    
    this.enableEdit = function(value) {
    	if (value == false) {
            _editorDoc.designMode = 'off';
    		$(_editorDoc.body).removeAttr('contenteditable')
        }
        else {
            _editorDoc.designMode = 'on';
            $(_editorDoc.body).attr('contenteditable', 'true');
        }
    };

    this.getHtml = function () {
        //$(_editorDoc.body).find('.CSUICM_Panel').remove();
        var html = _editorDoc.body.innerHTML;
        //_editor.contentWindow.initRightMenu();

        var t = $('<div></div>');
        t.html(html);
        /*删除所有样式*/
        t.find('style').remove();
        /*清理搜索高亮标示*/
        //t.find('.cs_ui_ps_highlight').each(function (i, n) {
        //    $(this).replaceWith($(this).html());
        //});
        html = t.html();

        return html;
    };

    this.setHtml = function (html) {
        var item = $('<div></div>');
        if(html == null || html == '') {
        	item.append('&#8203;');
        }
        else {
        	item.append(html);
        }
        $(_editorDoc.body).html(item);
        //if(html != null && html.indexOf('<div><br/></div>') == -1 && html.indexOf('<div><br></div>') == -1) {
	        /* 默认多几个换行，让插入表格后不会很难回车 */
	    //    $(_editorDoc.body).append('<div><br/></div>');
	    //    $(_editorDoc.body).append('<div><br/></div>');
        //}

        new CSHtmlRebuilderForDisplay({ tgtArea: $(_editorDoc.body), maxWidthAreaTagName: 'body' }).run();
    };

    this.insertHtml = function (html) {
        var doc = _editorDoc;
        if (doc.selection != null) {
            _insertHtmlForIE(_editor.contentWindow, html);
        }
        else {
            _insertHtmlForC(_editor.contentWindow, html);
        }
    };

    this.appendHtml = function (html) {
        $(_editorDoc.body).append(html);
    };

    this.appendObj = function (obj) {
        $(_editorDoc.body).append(obj);
    };

    this.insertImg = function (item) {
        try {
            var html = '';
            html += '<img src="' + item.src + '" title="' + item.title + '" alt="' + item.alt + '" onclick="window.open(this.src)" style="width:160px;cursor:pointer;" />';
            _me.focus();
            _me.insertHtml(html);
        } catch (exc) {
            alert(exc.message);
        }
    };

    this.insertImgs = function (items) {
        //alert(JSON.stringify(items));
        try {
            //var html = '';
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                _me.insertImg(item);
                /*
                html = '<img src="' + item.src + '" title="' + item.title + '" alt="' + item.alt + '"/>';
                _me.focus();
                _me.insertHtml(html);*/
            }
        } catch (exc) {
            alert(exc.message);
        }
    };

    this.insertLink = function (displayName, title, url) {
        try {
            _me.focus();
            var html = '<a href="' + url + '" title="' + title + '" target="_blank" style="margin-left:3px;margin-right:3px;">' + displayName + '</a>';
            cscom.log('开始插入html');
            _me.insertHtml(html);
            cscom.log('插入html完毕');

            /*var obj = _editorDoc.execCommand("CreateLink", false, url);*/

            $(_editorDoc.body).find('a').each(function (i, item) {
                var jqItem = $(item);
                if (jqItem.attr('href') == url) {
                    jqItem.attr('target', '_blank');
                    jqItem.attr('title', title);
                    jqItem.html(displayName);
                    jqItem.css('cursor', 'pointer');
                    jqItem.click(function () {
                        cfg.openWindow(this.href);
                    });
                }
            });
        } catch (exc) {
            alert(exc.message);
        }
    };

    this.getSelectionRange = function () {
        try {
            _me.focus();
            if (_editorDoc.selection != null) {
                return _editorDoc.selection.createRange();
                cscom.log('获取选中文本成功1');
            }
            else if (_editorDoc.getSelection) {
                return _editorDoc.getSelection().getRangeAt(0);
                cscom.log('获取选中文本成功2');
            }
            else {
                throw new Error('无法获得选中区域');
            }
            cscom.log('获取选中文本成功');
        } catch (exc) {
            cscom.log('获取选中文本异常 -> ' + exc.message);
        }
    };
    /*用于解决focus导致选中项目丢失的问题，注意：edge需要把按钮做成button或input，否则无法解决失焦问题*/
    var _selectionRange;
    this.recordSelectionRange = function () {
        try {
            _me.focus();
            if (_editorDoc.selection != null) {
                _selectionRange = _editorDoc.selection.createRange();
            }
            else if (_editorDoc.getSelection) {
                //_selectionRange = _editorDoc.getSelection().getRangeAt(0);
            }
            else {
                throw new Error('无法获得选中区域');
            }
            cscom.log('记录选中文本成功');
        } catch (exc) {
            cscom.log('记录选中文本异常 -> ' + exc.message);
        }
    };
    this.restoreSelectionRange = function () {
        try {
            _me.focus();
            if (_editorDoc.selection != null) {
                _selectionRange.select();
            }
            else if (_editorDoc.getSelection) {
            }
            else {
                throw new Error('无法恢复选中区域');
            }
            cscom.log('还原选中文本成功');
        } catch (exc) {
            cscom.log('还原选中文本异常 -> ' + exc.message);
        }
    };

    this.getColorSelector1 = function () {
        return _colorSelector1;
    };

    this.getColorSelector2 = function () {
        return _colorSelector2;
    };

    this.getDocument = function () {
        return _editorDoc;
    };
    //不要存储到草稿箱一次，防止从草稿箱加载后又存储
    var notSaveToDraftsOnce = false;
    this.NotSaveToDraftsOnce = function () {
        notSaveToDraftsOnce = true;
    };
    /*备份文本*/
    this.saveToDrafts = function () {
        if (notSaveToDraftsOnce == true) {
            notSaveToDraftsOnce = false;
        }
        else {
            var html = _me.getHtml();
            if (html != null && html != '') {
                var topObj = csui.getWebTopObj();
                if (topObj.isOpenByCSSuperShell != null && topObj.isOpenByCSSuperShell()) {
                    window.loadingLineBar.setLoading(true);
                    //topObj.reqByCmdForSys('callClient_SetDataToUserStorage', { key: 'cs_editor_drafts', value: html, listMode: '1', fmt: 'html' }, function () {
                    //    window.loadingLineBar.setLoading(false);
                    //});
                    topObj.csaui.reqShellByCmd('callClient_SetDataToUserStorage', { key: 'cs_editor_drafts', value: html, listMode: '1', fmt: 'html' }, function (r) {
                        window.loadingLineBar.setLoading(false);
                    });
                }
                //else if (topObj.CSSuperShell != null && topObj.CSSuperShell.Version != null && topObj.CSSuperShell.Version != '') {
                //    window.loadingLineBar.setLoading(true);
                //    topObj.CSSuperShell.ReqByCmd('callClient_SetDataToUserStorage', { key: 'cs_editor_drafts', value: html, listMode: '1', fmt: 'html' });
                //    window.loadingLineBar.setLoading(false);
                //}
                else if (window.sessionStorage != null) {
                    window.loadingLineBar.setLoading(true);
                    sessionStorage.setItem('cs_editor_drafts', html);
                    window.loadingLineBar.setLoading(false);
                }
                else {
                    csui.log('暂无可用的存储器来存储草稿');
                }
            }
        }
    };
}

window.csEditorCfg.menuBarInitItems = [
    { key: 'Bold', title: '粗体' },
    { key: 'Italic', title: '斜体' },
    { key: 'Underline', title: '下划线' },
    { key: 'StrikeThrough', title: '删除线' },
    { key: 'InsertImage', title: '插入图片' },
    { key: 'Attachment', title: '插入附件' },
    { key: 'ForeColor', title: '文字变色' },
    { key: 'BackColor', title: '背景变色' },
    { key: 'Drafts', title: '从草稿箱加载' },
    //{ key: 'SoundAudio', title: '语音消息' },
    { key: '', title: '', type: 'empty', style: 'width:6px;' },
    { key: 'FontSize', title: '字号', type: 'select', items: ['10px', '12px', '16px', '18px', '20px', '23px', '24px'] }
];
window.csEditorCfg.menuBarItems = [];

window.csEditorCfg.menuBarItemActs = [
    {
        key: 'InsertImage',
        act: function (me, pars, callback) {
        	_upload2.select();
        	/*
            var upload = new CSFlexUpload({
                title: '插入图片',
                fileFilterText: '图片格式',
                fileFilterValue: '*.jpg;*.jpeg;*.gif;*.png;*.bmp',
                pluginDirUrl: '../../CSFlexUpload',
                beforeToSelectFileAction: function () {
                    if (cscom.isOldIE()) {
                        csEditor1Js.recordSelectionRange();
                    }
                },
                onUploadEnd: function (rs) {
                    if (cscom.isOldIE()) {
                        csEditor1Js.restoreSelectionRange();
                    }

                    var toInsertImgs = [];
                    for (var i = 0; i < rs.length; i++) {
                        var r = rs[i];
                        if (r.success == false) {
                            cscom.log(r.msg);
                        }
                        else {
                            toInsertImgs.push({ title: r.oldFileName, alt: r.oldFileName, src: '/warehouse/upload/' + r.newFileName });
                        }
                    }

                    csEditor1Js.insertImgs(toInsertImgs);

                    upload.hideWin();

                    window.onEditorContentChanged();

                    if (callback != null) {
                        callback();
                    }
                }
            });
            upload.init();
            upload.toSelectFile();*/
        }
    },
    {
        key: 'Attachment',
        act: function (me, pars, callback) {
        	_upload1.select();
        	/*
            var upload = new CSFlexUpload({
                title: '插入附件',
                pluginDirUrl: '../../CSFlexUpload',
                beforeToSelectFileAction: function () {
                    if (cscom.isOldIE()) {
                        csEditor1Js.recordSelectionRange();
                    }
                },
                onUploadEnd: function (rs) {
                    //alert('上传完毕 -> ' + JSON.stringify(rs));
                    if (cscom.isOldIE()) {
                        csEditor1Js.restoreSelectionRange();
                    }

                    upload.hideWin();

                    for (var i = 0; i < rs.length; i++) {
                        var r = rs[i];
                        if (r.success == false) {
                            cscom.log(r.msg);
                        }
                        else {
                            //csEditor1Js.insertLink(r.oldFileName, '/warehouse/upload/' + r.newFileName, '/warehouse/upload/' + r.newFileName);
                            csEditor1Js.insertLink(r.oldFileName, r.oldFileName, '/?cmd=downloadFile&fileName=' + r.oldFileName + '&fileName1=' + r.newFileName);
                        }
                    }

                    window.onEditorContentChanged();

                    if (callback != null) {
                        callback();
                    }
                }
            });
            upload.init();
            upload.toSelectFile();
            */
        }
    },
    {
        key: 'ForeColor',
        act: function (me, pars, callback) {
            if (cscom.isOldIE()) {
                me.recordSelectionRange();
            }
            me.getColorSelector1().show();
        }
    },
    {
        key: 'BackColor',
        act: function (me, pars, callback) {
            if (cscom.isOldIE()) {
                me.recordSelectionRange();
            }
            me.getColorSelector2().show();
        }
    },
    {
        key: 'Drafts',
        act: function (me, pars, callback) {
            var topObj = csui.getWebTopObj();
            if (topObj.CSSuperShell != null && topObj.CSSuperShell.Version != null && topObj.CSSuperShell.Version != '') {
                //var r = eval('(' + topObj.CSSuperShell.ReqByCmd('callClient_GetDataFromUserStorage', { key: 'cs_editor_drafts', listMode: '1' }) + ')');
                //csEditor1Js.NotSaveToDraftsOnce();
                //csEditor1Js.setHtml(r.data);
                var win = new topObj.CSUIWin({ title: '请点击预览并确认要还原的内容', url: '../../Plugins/CSEditor/res/DraftsDataSelector.html' });
                win.show();
                win.getUICore().find('iframe').first()[0].contentWindow.callback = function (item) {
                    csEditor1Js.NotSaveToDraftsOnce();
                    csEditor1Js.setHtml(item.content);
                    win.close();
                };
            }
            else if (window.sessionStorage != null) {
                csEditor1Js.NotSaveToDraftsOnce();
                csEditor1Js.setHtml(sessionStorage.getItem('cs_editor_drafts'));
            }

            if (callback != null) {
                callback();
            }
        }
    },
    {
        key: 'FontSize',
        act: function (me, pars, callback) {
            var range = me.getSelectionRange();

            if (range != null && range.toString() != '') {
                try {
                    var t = $('<span style="font-size:' + pars["value"] + ';"></span>');
                    t.html(range.toString());
                    range.surroundContents(t[0])
                    range.deleteContents();
                    range.insertNode(t[0]);
                    window.onEditorContentChanged();
                } catch (exc) {
                    csui.log(exc.message);
                }
            }

            if (callback != null) {
                callback();
            }
        }
    },
    {
        key: 'SoundAudio',
        act: function (me, pars, callback) {
            top.csaui.reqShellByCmd('callClient_SoundRecordAndAutoUpload', pars, function (r) {
                if (r.success) {
                    csEditor1Js.insertHtml('<span>&nbsp;</span>');
                    csEditor1Js.insertHtml('<div><audio class="cs_ui_edt_soundAudio" src="/Warehouse/Upload/' + r.data + '" controls="controls" /></div>');
                    window.onEditorContentChanged();
                }
                else {
                    csui.error(r.msg);
                }

                if (callback != null) {
                    callback();
                }
            }, 0);

        }
    }
];

var csEditor1Js = new CSEditor(window.csEditorCfg);
