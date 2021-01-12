

function CSUILoadingLineBar(cfg) {
    var _me = this;
    var _speed = 100;
    var _container;
    var _panel;
    var _allowRunning = false;
    var _colorArr = ['#5E21EF', '#71A700', '#DA247F', '#000092'];
    var _curColorIndex = 0;
    var moveBar;
    var _startMoveBarTimeoutThread;
    var _stopDely = 600;
    var _stopDelyThread;

    function _startMoveBar() {
        var color = '';

        color = _colorArr[_curColorIndex++];
        if (_curColorIndex > _colorArr.length - 1) {
            _curColorIndex = 0;
        }

        moveBar = $('<div style="position:absolute; background-color:' + color + '; height:3px;"></div>');
        _panel.append(moveBar);
        moveBar.width(_panel.width() * 0.9);
        moveBar.css('left', -1 * moveBar.width());

        moveBar.stop().animate({ left: _panel.width() }, 3600, function () {
            $(this).remove();
        });

        if (_allowRunning) {
            _startMoveBarTimeoutThread = setTimeout(_startMoveBar, 2300);
        }
    }

    function _start() {
        _allowRunning = true;
        //_panel.css('width', _container.css('width'));
        _panel.stop().animate({ opacity: '0.9' }, 300);
        _startMoveBar();
    }

    function _stop() {
        _allowRunning = false;
        _panel.stop().animate({ opacity: '0.0' }, 600, function () {
            if (_startMoveBarTimeoutThread != null) {
                clearTimeout(_startMoveBarTimeoutThread);
            }
            if (moveBar != null) {
                moveBar.remove();
            }
            _panel.children().remove();
        });
    }

    this.build = function () {
        _container = $(cfg.renderTo);
        if (_container.css('position') == '' || _container.css('position') == 'static') {
            _container.css('position', 'relative');
        }
        _panel = $('<div style="width:100%; height:3px; background-color:#FFC6A9; opacity:0; position:absolute; top:0px; left:0px; overflow:hidden;"></div>');
        //        $(window).resize(function () {
        //            _panel.css('width', _container.css('width'));
        //        });
        _container.append(_panel);
    };

    this.init = function () {
        _me.build();
    };

    this.setLoading = function (v) {
        clearTimeout(_stopDelyThread);

        if (v) {
            _start();
        }
        else {
            if (_stopDely <= 0) {
                _stop();
            }
            else {
                _stopDelyThread = setTimeout(function () {
                    _stop();
                }, _stopDely);
            }
        }
    };
}/*res CSUI*/
