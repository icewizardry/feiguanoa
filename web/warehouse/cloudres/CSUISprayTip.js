
if (window.csui == null) {
    window.csui = { prevWinInitZIndex: 6000 };
}


function CSUISprayTip(cfg) {
    var _debug = false;
    var _uiId;
    var _txtId;
    var _showQueue = [];
    var _hideQueue = [];
    var _isShowing = false;
    var _isAnimating = false;
    var _toAction = ''; 

    var _allowAutoHide = true;
    var _allowShowQueue = true;
    var _showMask = false;
    var _allowAnimation = true;
    var _allowShowCover = false;

    var _curPanel = null;
    var _maskDiv;

    var _showAnimatingTime = 300;
    var _keepAnimatingTime = 2000;
    var _hideAnimatingTime = 600;

    var _showAction = function () {
        _isAnimating = false;
        $(_curPanel).css({ 'opacity': '1', 'display': '' });
        if (_allowAutoHide) {
            setTimeout(function () {
                _hide();
            }, _keepAnimatingTime);
        }
    };
    var _hideAction = function () {
        _isAnimating = false;
        _isShowing = false;
        _destoryUI();
        _showProc();
    };

    function _newId() {
        var now = new Date();
        return 'CS' + now.getSeconds() + now.getMilliseconds() + Math.random().toString().replace('.', '');
    }

    function _buildUI() {
        if (_showMask) {
            _maskDiv = document.createElement('div');
            _maskDiv.style.position = 'fixed';
            _maskDiv.style.left = '0px';
            _maskDiv.style.top = '0px';
            _maskDiv.style.width = document.documentElement.clientWidth + 'px';
            _maskDiv.style.height = document.documentElement.clientHeight + 'px';
            _maskDiv.style.backgroundColor = 'silver';
            $(_maskDiv).css({ 'opacity': '0.8' });

            document.body.appendChild(_maskDiv);
        }

        _curPanel = document.createElement('div');
        _curPanel.id = _uiId;
        _curPanel.style.float = 'left';
        _curPanel.style.position = 'fixed';
        _curPanel.style.backgroundColor = '#D9EDF7';
        _curPanel.style.display = '';
        $(_curPanel).css({ 'opacity': '0.0' });

        var div_txt = document.createElement('div');
        div_txt.id = _txtId;
        div_txt.style.margin = '26px';
        div_txt.style.marginLeft = '66px';
        div_txt.style.marginRight = '66px';
        div_txt.style.padding = '0px';
        div_txt.style.fontFamily = 'font-family:微软雅黑';
        div_txt.style.fontWeight = 'bold';
        div_txt.style.fontSize = '20px';
        div_txt.style.color = '#3A87AD';
        _curPanel.appendChild(div_txt);

        var div_btn = document.createElement('a');
        div_btn.style.position = 'absolute';
        div_btn.style.top = '3px';
        div_btn.style.right = '6px';
        div_btn.style.fontSize = '13px';
        div_btn.style.fontFamily = 'font-family:微软雅黑';
        div_btn.style.color = '#3A87AD';
        div_btn.innerHTML = 'X';
        div_btn.href = 'javascript:;';
        div_btn.onclick = function () {
            _hide();
        };
        $(div_btn).css('text-decoration', 'none');

        _curPanel.appendChild(div_btn);

        document.body.appendChild(_curPanel);
    }

    function _destoryUI() {
        $(_curPanel).remove();
        if (_showMask) {
            $(_maskDiv).remove();
        }
    }

    function _hide() {
        if (!_isAnimating && _isShowing) {
            _isAnimating = true;
            _toAction = 'hide';

            if (_allowAnimation) {
                $(_curPanel).animate({ opacity: 0 }, _hideAnimatingTime, _hideAction);
            }
            else {
                _hideAction();
            }
        }
    }

    function _showProc() {
        if (_showQueue.length > 0 && !_isShowing && !_isAnimating) {
            _isAnimating = true;
            _isShowing = true;
            _toAction = 'show';
            _buildUI();

            var item = _showQueue[0];
            _showQueue.splice(0, 1);

            var txtPanel = document.getElementById(_txtId);
            txtPanel.innerHTML = item.msg;

            if (item.html != null && item.html != '') {
                $(_curPanel).html(item.html);
            }
            $(_curPanel).css({ 'opacity': '0.0', 'display': '' });

            $(_curPanel).css('z-index', window.csui.prevWinInitZIndex + 6);
            window.csui.prevWinInitZIndex = window.csui.prevWinInitZIndex + 6;

            
            _curPanel.style.left = (document.documentElement.clientWidth / 2 - _curPanel.offsetWidth / 2) + 'px';
            _curPanel.style.top = (document.documentElement.clientHeight / 2 - _curPanel.offsetHeight / 2) + 'px';

            if (_allowAnimation) {
                $(_curPanel).animate({ opacity: 1 }, _showAnimatingTime, _showAction);
            }
            else {
                _showAction();
            }
        }
    }

    this.show = function (msg, html) {
        if (_allowShowQueue || _allowShowCover || (!_isShowing && !_isAnimating)) {
            _showQueue.push({ msg: msg, html: html });
        }

        if (_allowShowCover) {
            _hide();
        }

        _showProc();
    };

    this.hide = function () {
        _hide();
    };

    {
        _uiId = _newId();
        _txtId = _newId();

        if (cfg != null) {
            if (cfg.allowAutoHide != null) {
                _allowAutoHide = cfg.allowAutoHide;
            }
            if (cfg.showMask != null) {
                _showMask = cfg.showMask;
            }
            if (cfg.allowShowQueue != null) {
                _allowShowQueue = cfg.allowShowQueue;
            }
            if (cfg.allowAnimation != null) {
                _allowAnimation = cfg.allowAnimation;
            }
            if (cfg.allowShowCover != null) {
                _allowShowCover = cfg.allowShowCover;
            }
        }

        $(window).resize(function () {
            if (_showMask && _maskDiv != null) {
                _maskDiv.style.left = '0px';
                _maskDiv.style.top = '0px';
                _maskDiv.style.width = document.documentElement.clientWidth + 'px';
                _maskDiv.style.height = document.documentElement.clientHeight + 'px';
            }

            _curPanel.style.left = (document.documentElement.clientWidth / 2 - _curPanel.offsetWidth / 2) + 'px';
            _curPanel.style.top = (document.documentElement.clientHeight / 2 - _curPanel.offsetHeight / 2) + 'px';
        });
    }
}

window.csui.showSprayTip = function (msg) {
    if (window.sprayTip == null) {
        window.sprayTip = new CSUISprayTip();
    }
    window.sprayTip.show(msg);
};/*res CSUI*/
