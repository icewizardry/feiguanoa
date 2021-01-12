//用于赋予html内的特殊部分功能，如：给超链接赋予点击功能，图片能点击功能
/*
maxWidthAreaTagName
maxWidthAreaClassName
*/
function CSHtmlRebuilderForDisplay(cfg) {
    function openUrl(url) {
        var topObj = csui.getWebTopObj();
        if (topObj.csaui != null) {
            topObj.csaui.openUrl(url);
        }
        else {
            window.open(url);
        }
    }

    function buildSoundAudioMsgPanel(tgt) {
        var container = tgt.parent();
        container.css('background-color', '#3AB9FF');
        container.css('-webkit-border-radius', 6);
        container.css('-moz-border-radius', 6);
        container.css('-ms-border-radius', 6);
        container.css('-o-border-radius', 6);
        container.css('height', 30);
        container.css('width', 160);
        container.css('cursor', 'pointer');
        container.append('<div class="cs_ui_edt_soundAudio_iconArea" style="float:left;"><img class="cs_ui_edt_soundAudio_icon1" src="/img/samsg.png" style="width:30px;" /></div>');
        var timeLabel1 = $('<div class="cs_ui_edt_soundAudio_timeLabel1" style="float:left;line-height:30px;font-size:12px;color:black;">加载中...</div>');
        container.append(timeLabel1);
        {
            var t = $('<div class="cs_ui_edt_soundAudio_btn0" style="float:right;margin-right:12px;margin-top:10px;width:10px;height:10px;-webkit-border-radius:10px;-moz-border-radius:10px;-ms-border-radius:10px;-o-border-radius:10px;background-color:white;"></div>');
            t.click(function (e) {
                e.preventDefault(); //方法阻止元素发生默认的行为（例如，当点击提交按钮时阻止对表单的提交）
                e.stopPropagation(); //阻止 click 事件冒泡到父元素
                tgt.attr('controls', 'controls');
                container.find('.cs_ui_edt_soundAudio_iconArea').hide();
                container.find('.cs_ui_edt_soundAudio_timeLabel1').hide();
                container.css('background-color', '');
                container.css('cursor', '');
                container.css('height', '');
                container.css('width', '');
                container.unbind('click');
            });
            container.append(t);
        }
        container.append('<div style="clear:both;"></div>');
        container.click(function () {
            if (tgt[0].paused) {
                tgt[0].play();
            }
            else {
                tgt[0].pause();
            }
        });
        tgt.removeAttr('controls');

        tgt[0].oncanplay = function () {
            var v = this.duration.toFixed(0);
            var m = 0, s = 0;
            m = parseInt(v / 60);
            s = v - m * 60;
            var time = '';
            if (m > 0) {
                time += m + ' 分 ';
            }
            if (s > 0) {
                time += s + ' 秒';
            }
            container.find('.cs_ui_edt_soundAudio_timeLabel1').html(time);
        }
        tgt[0].onplay = function () {
            container.find('.cs_ui_edt_soundAudio_icon1').attr('src', '/img/samsg.gif');
        };
        tgt[0].onpause = function () {
            container.find('.cs_ui_edt_soundAudio_icon1').attr('src', '/img/samsg.png');
        };
    }

    this.run = function () {
        var topObj = csui.getWebTopObj();
        var html = cfg.tgtArea.html();
        /*由于360和壳web内核不支持负向零宽断言(?<!)*/
        var pattern = '(http[s]*://[^\\s\\r\\n\'"<>]+)(?!</a>)(?![\':])([\\s\\r\\n<]+|$)'; //(?:[\\s\\r\\n<]+|$)(?!</a>)(?<![=][\'"]*)(?<!<a[^>]+>)
        var reg = new RegExp(pattern, 'g');
        var finds = [];
        for (var i = 0; i < 100; i++) {
            var result = reg.exec(html);
            if (result == null) {
                break;
            }
            else {
                finds.push(result);
            }
        }
        for (var i = 0; i < finds.length; i++) {
            //html = html.replace(finds[i][1], '<a href="' + finds[i][1] + '" target="_blank">' + finds[i][1] + '</a>');
            //html = html.replace(/(?<![=][\'"]*)(http[s]*:\/\/[^\s\r\n'"<>]+)(?!<\/a>)/g, '<a data-url="' + finds[i][1] + '">' + finds[i][1] + '</a>'); //(?:[\s\r\n<]+|$)
            html = csui.replace(html, finds[i][1], '{cs' + i + 'cs}');
        }
        for (var i = 0; i < finds.length; i++) {
            html = csui.replace(html, '{cs' + i + 'cs}', '<a data-url="' + finds[i][1] + '">' + finds[i][1] + '</a>');
        }
        cfg.tgtArea.html(html);

        //赋予超链接点击功能
        /*
        cfg.tgtArea.find('a').each(function (i, n) {
            if ($(n).hasClass('CSUIOAInnerOpen')) {
                var url = '';
                if (n.href != 'javascript:;') {
                    url = $(n)[0].href;
                    if (url == null || url == '') {
                        url = $(n).attr('data-url');
                    }
                    $(n).attr('data-url', url);
                }
                n.href = 'javascript:;';
                $(n).attr('target', null);
                $(n).click(function () {
                    var url = $(n).attr('data-url');
                    if (navigator.userAgent.indexOf("compatible") != -1 || navigator.userAgent.toLowerCase().indexOf('msie') != -1) {
                        topObj.csaui.openApp({ Name: $(n).html(), PageUrl: encodeURI(url) });
                    }
                    else {
                        topObj.csaui.openApp({ Name: $(n).html(), PageUrl: url });
                    }
                });
            }
            else {
                if (n.href.toLowerCase().indexOf('javascript') == -1) {
                    if (n.href != null && n.href != '') {
                        $(n).attr('data-url', n.href);
                    }
                    n.href = 'javascript:;';
                    $(n).attr('target', null);
                    $(n).click(function () {
                        var url = $(n).attr('data-url');
                        //var url = n.href;
                        if (navigator.userAgent.indexOf("compatible") != -1 || navigator.userAgent.toLowerCase().indexOf('msie') != -1) {
                            openUrl(encodeURI(url));
                        }
                        else {
                            openUrl(url);
                        }
                    });
                }
                else if (n.href == 'javascript:;' && $(n).attr('data-url') != null && $(n).attr('data-url') != '') {
                    $(n).attr('target', null);
                    $(n).click(function () {
                        var url = $(n).attr('data-url');
                        if (navigator.userAgent.indexOf("compatible") != -1 || navigator.userAgent.toLowerCase().indexOf('msie') != -1) {
                            openUrl(encodeURI(url));
                        }
                        else {
                            openUrl(url);
                        }
                    });
                }
            }
        });*/
        //赋予图片点击打开功能
        cfg.tgtArea.find('img').each(function (i, n) {
            $(n).css('cursor', 'pointer');
            var maxWidth = 0;
            var p = $(n).parent();
            for (var i = 0; i < 180; i++) {
                if (cfg.maxWidthAreaTagName != null) {
                    if (p[0].tagName.toUpperCase() == cfg.maxWidthAreaTagName.toUpperCase()) {
                        maxWidth = p.width() - 18;
                        break;
                    }
                    else {
                        p = p.parent();
                    }
                }
                else if (cfg.maxWidthAreaClassName != null) {
                    if (p.hasClass(cfg.maxWidthAreaClassName)) {
                        maxWidth = p.width() - 18;
                        break;
                    }
                    else {
                        p = p.parent();
                    }
                }
                else {
                    maxWidth = p.width() - 18;
                    break;
                }
            }
            $(n).css('max-width', maxWidth);
            
            if($(n).attr('onclick') == null || $(n).attr('onclick') == '') {
	            $(n).click(function () {
	                var url = this.src;
	                openUrl(url);
	            });
            }
        });
        //赋予视频点击打开功能
        cfg.tgtArea.find('video').each(function (i, n) {
            $(n).css('cursor', 'pointer');
            $(n).css('max-width', $(n).parent().width() - 18);
            $(n).click(function () {
                var url = this.src;
                var t = csui.getWebTopObj();
                var panel = $('<video controls="controls" style="border: 1px solid silver; width:99%; height:99%;" preload="true">您的浏览器不支持HTML5</video>');
                panel.attr('src', url);
                t.csui.showWin({ html: panel });
            });
        });
        //改造语音播放器
        cfg.tgtArea.find('.cs_ui_edt_soundAudio').each(function (i, n) {
            buildSoundAudioMsgPanel($(n));
        });
        //删除因为误操作而留在内容里的右键菜单
        cfg.tgtArea.find('.CSUICM_Panel').remove();
    };
}