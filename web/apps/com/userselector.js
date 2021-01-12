//树形用户单项选择器
CSJSV3.AUI.UserSelectorS1 = function (cfg) {
    var _me = this;
    var _uiCore;
    var _inputChangeDelayThread;

    {
    	if(cfg.winCfg==null) cfg.winCfg = {};
    	cfg.winCfg.title = '请选择要添加的用户';
    	if(cfg.treeCfg==null) cfg.treeCfg = {};
    	cfg.treeCfg.showCheckbox = false;
    	cfg.treeCfg.onLoadChild = function (node, nodeUI, callback) {
            if (node.level == 0) {
            	_me.com().reqByCmd('listforselector', { realname: _me.text(), role: '员工', page: 1, limit: 60 }, function(r) {
		    		if (r.success == false) {
		    			_me.world().showErrorMsg(r.msg);
		    			callback(node, nodeUI, []);
		    		}
		    		else {
		    			var arr1 = [];
		    			for(var i=0; i < r.data.length; i++) {
		    				arr1.push({ id: r.data[i].id, title: r.data[i].realname, pid: '' });
		    			}
		    			callback(node, nodeUI, arr1);
		    		}
		    	}, '../../api/user');
            }
            else {
		    	callback(node, nodeUI, []);
            }
        };
        /* 继承父级 */
        this.super0(this, new CSJSV3.AUI.WinTreeSelectorB(cfg));
    }

    this.init = function (world) {
        /* 继承父级 */
        _me.base.init(world);
    };
};
CSJSV3.AUI.UserSelectorS1.prototype = new CSJSV3.SuperHelper();

//树形用户多项选择器（不推荐，因为没分组，罗列有会有限制，搜索会清楚之前的选择）
CSJSV3.AUI.UserSelectorM1 = function (cfg) {
    var _me = this;
    var _uiCore;
    var _dataAgent;
    var _inputChangeDelayThread;

    {
    	if(cfg.winCfg==null) cfg.winCfg = {};
    	cfg.winCfg.title = '请选择要添加的用户';
    	if(cfg.treeCfg==null) cfg.treeCfg = {};
    	cfg.treeCfg.onLoadChild = function (node, nodeUI, callback) {
            if (node.level == 0) {
            	_me.com().reqByCmd('listforselector', { realname: _me.text(), role: '员工' }, function(r) {
		    		if (r.success == false) {
		    			_me.world().showErrorMsg(r.msg);
		    			callback(node, nodeUI, []);
		    		}
		    		else {
		    			var arr1 = [];
		    			for(var i=0; i < r.data.length; i++) {
		    				arr1.push({ id: r.data[i].id, title: r.data[i].realname, pid: '' });
		    			}
		    			callback(node, nodeUI, arr1);
		    		}
		    	}, '../../api/user');
            }
            else {
		    	callback(node, nodeUI, []);
            }
        };
        /* 继承父级 */
        this.super0(this, new CSJSV3.AUI.WinTreeSelectorB(cfg));
    }

    this.init = function (world) {
        /* 继承父级 */
        _me.base.init(world);
    };
};
CSJSV3.AUI.UserSelectorM1.prototype = new CSJSV3.SuperHelper();
