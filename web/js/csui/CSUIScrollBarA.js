
function CSUIScrollBarA(cfg) {
    var _me = this;
    var _direction = 'left';
    var _scrollView;
    var _scrollItem;
    var _scrollInterval = 5;
    var canRunning = false;
    var isHovering = false;

    function scroll(container, width, height) {
        if (canRunning == true && !isHovering) {
            if (_direction == 'left') {
                if (width == null) width = _scrollItem.outerWidth(true);
                container.scrollLeft(container.scrollLeft() + 1);
                if (container.scrollLeft() >= width * 2) {
                    container.scrollLeft(width);
                }
            }
            else if (_direction == 'right') {
                if (width == null) width = _scrollItem.outerWidth(true);
                container.scrollLeft(container.scrollLeft() - 1);
                if (container.scrollLeft() == 0) {
                    container.scrollLeft(width);
                }
            }
            else if (_direction == 'top') {
                if (height == null) height = _scrollItem.outerHeight(true);
                container.scrollTop(container.scrollTop() + 1);
                if (container.scrollTop() >= height * 2) {
                    container.scrollTop(height);
                }
            }
            else if (_direction == 'bottom') {
                if (height == null) height = _scrollItem.outerHeight(true);
                container.scrollTop(container.scrollTop() - 1);
                if (container.scrollTop() == 0) {
                    container.scrollTop(height);
                }
            }
        }

        setTimeout(function () {
            scroll(container, width, height);
        }, _scrollInterval);
    }

    this.start = function () {
        canRunning = true;
    };

    this.stop = function () {
        canRunning = false;
    };

    this.direction = function (v) {
        _direction = v;
    };

    {
        _scrollView = cfg.scrollView;
        if (cfg.direction != null) {
            _direction = cfg.direction;
        }
        _scrollItem = cfg.scrollItem;
        if (cfg.scrollInterval != null) {
            _scrollInterval = cfg.scrollInterval;
        }

        _scrollView.mouseenter(function () {
            isHovering = true;
        });

        _scrollView.mouseleave(function () {
            isHovering = false;
        });

        scroll(_scrollView, null, null);
    }
}