
/*
canShow: 用于控制点击时，是否可以显示菜单
*/
function CSUIContextMenu(options) {
    var _me = this;
    var _mouseInPanel;
    
    var _attachedObj;

    function _buildPanel(items, e) {
        var panel = $('<div class="CSUICM_Panel" contenteditable="false" style=""></div>');
        $(panel).contextmenu(function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        $(document).on('click', 'html', function () {
            panel.fadeOut(options.fadeSpeed, function () {
                panel.remove();
            });
        });
        $(document).mousedown(function (e) {
            //如果不注释，则会导致某些情况下对某些元素点击左键会无法取消右键菜单
            //if (e.which == 3) {
            panel.fadeOut(options.fadeSpeed, function () {
                panel.remove();
            });
            //}
        });
        $(document).on('mouseenter', '.CSUICM_Panel', function () {
            _mouseInPanel = true;
        });
        $(document).on('mouseleave', '.CSUICM_Panel', function () {
            _mouseInPanel = false;
        });

        var totalAppendCount = 0;
        panel.append('<div contenteditable="false" style="height:6px;"></div>');
        for (var i = 0; i < items.length; i++) {
            
            if (items[i].canShow == null || items[i].canShow(e, _attachedObj)) {
                if (items[i].type == 'line') {
                    var item = $('<hr/>');
                    panel.append(item);
                }
                else {
                    var item = $('<a class="CSUICM_Panel_a" href="javascript:;"><li contenteditable="false" onmouseenter="$(this).find(\'a\').addClass(\'CSUICM_Panel_a_hover\');" onmouseleave="$(this).find(\'a\').removeClass(\'CSUICM_Panel_a_hover\');">' + items[i].text + '</li></a>');
                    item[0].datacontext = items[i];
                    item[0].datacontext.ui_touch_tgt = e.target;
                    item.click(function (e) {
                        if (this.datacontext.onClick != null) {
                            this.datacontext.onClick(e, _attachedObj);
                        }
                        else if (this.datacontext.onclick != null) {
                            this.datacontext.onclick(e, _attachedObj);
                        }
                    });
                    panel.append(item);
                    totalAppendCount++;
                }
            }
        }
        panel.append('<div contenteditable="false" style="height:6px;"></div>');
        if (totalAppendCount == 0) {
            panel.hide();
        }
        else {
            $(document.body).append(panel);
        }
        return panel;
    }

    this.attach = function (selector, items) {
        if (selector != null) {
            _attachedObj = $(selector);
            $(selector).contextmenu(function (e) {
                e.preventDefault();
                e.stopPropagation();

            });
            $(selector).mousedown(function (e) {
                if (e.which == 3) {
                    if (e != null && e.target != null) {

                    }
                    _me.show(items, e);
                }
            });
        }
    };

    this.show = function (items, e) {
        e.preventDefault();
        e.stopPropagation();

        $('.CSUICM_Panel').remove();
        var panel = null;
        if ($('.CSUICM_Panel').length > 0) {
            panel = $('.CSUICM_Panel');
        }
        else {
            panel = _buildPanel(items, e);
        }

        $dd = panel;

        if ((e.clientY + $dd.height() + 6) > $(window).height()) {
            var left = e.clientX - 6;
            if ((e.clientX + $dd.width()) > $(window).width()) {
                left = $(window).width() - $dd.width() - 6;
            }
            $dd.css({
                top: $(window).height() - $dd.height() - 6,
                left: left
            }).fadeIn(options.fadeSpeed);
        } else {
            var left = e.clientX - 6;
            if ((e.clientX + $dd.width()) > $(window).width()) {
                left = $(window).width() - $dd.width() - 6;
            }
            $dd.css({
                top: e.clientY + 6,
                left: left
            }).fadeIn(options.fadeSpeed);
        }
    };

    {
        if (options.fadeSpeed == null) {
            options.fadeSpeed = 300;
        }
    }
}/*res CSUI*/
