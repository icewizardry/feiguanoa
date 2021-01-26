
CSJSV3.UI.MailUserDisplayBar = function(cfg) {
    const _me = this;
    var _uiCore;

    {
        _uiCore = $('<div></div>');
        cfg.uiCore = _uiCore;
        /* 继承父级 */
        const parent = new CSJSV3.UI.BaseObject(cfg);
        /* 重写父级函数 parent.xxxx = function() {};*/
        parent.value = function (v) {
        };

        parent.val = parent.value;

        parent.reset = function () {
        };

        parent.readonly = function (v) {
        };

        parent.disabled = function (v) {
        };

        parent.showInputErrorTip = function () {
        };

        parent.hideInputErrorTip = function () {
        };

        this.super0(this, parent);
    }

    this.init = function(world) {
        /* 继承父级 */
        _me.base.init(world);
    };

    this.setUsers = function(users, hasReadUserIdsStr) {
        _uiCore.children().remove();
        _uiCore.append('<style>.userItemDef{ float:left; font-size: 12px; color: silver; line-height: 26px;' +
            'border: 1px solid silver; margin-top: 10px; margin-right: 6px; padding: 0; padding-left: 12px; padding-right: 12px; ' +
            '-webkit-border-radius: 6px;-moz-border-radius: 6px;-ms-border-radius: 6px;-o-border-radius: 6px; }</style>');
        for (var i in users) {
            var user = users[i];
            var uiItem = $('<div class="userItemDef"></div>');
            uiItem.html(user.title);
            uiItem[0].dc = user;
            if (hasReadUserIdsStr.indexOf(user.id) != -1) {
                uiItem.css('color', 'black');
            }
            _uiCore.append(uiItem);
        }
        _uiCore.append('<div style="clear: both;"></div>');
    };

    this.clear = function() {
        _uiCore.children().remove();
    };

    // this.setHasReadByUserIdsStr = function (userIdsStr) {
    //     _uiCore.children().each(function (i, n) {
    //         console.log(n);
    //         if (userIdsStr.indexOf(n.dc.id) !== -1) {
    //             $(n).css('color', 'black');
    //         }
    //     });
    // };
};
CSJSV3.UI.MailUserDisplayBar.prototype = new CSJSV3.SuperHelper();