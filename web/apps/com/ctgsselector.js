/*onChange(self)*/
CSJSV3.AUI.CtgsSelector = function (cfg) {
    var _me = this;
    var _win;
    var _sitectg;
    
    var _onChange;

    {
        if (cfg.name == null) {
            cfg.name = 'ctgs';
        }
        if (cfg.textFieldName == null) {
            cfg.textFieldName = 'title';
        }
        if (cfg.canInputAdd == null) {
            cfg.canInputAdd = false;
        }
        if (cfg.useFloatPanel == null) {
            cfg.useFloatPanel = false;
        }
        if (cfg.showFloatTableHead == null) {
            cfg.showFloatTableHead = false;
        }
        if (cfg.procItemsToValueStr == null) {
            cfg.procItemsToValueStr = function (items) {
                if (items == null || items.length == 0) {
                    return '';
                }
                return JSON.stringify(items);
            };
        }
        if (cfg.procValueStrToItems == null) {
            cfg.procValueStrToItems = function (valueStr) {
                if (valueStr == null || valueStr == '') {
                    return [];
                }
                else {
                    return JSON.parse(valueStr);
                }
            };
        }
        if (cfg.isSameItem == null) {
            cfg.isSameItem = function (item1, item2) {
                return item1.id.toLowerCase() == item2.id.toLowerCase();
            };
        }
        if(cfg.onFocus == null) {
        	cfg.onFocus = function(self) {
        		_sitectg.clearSelectedItem();
        		_win.show();
        	};
        }
        if (cfg.onInputChange == null) {
            cfg.onInputChange = function (self, txt) {
            };
        }
        if(cfg.onChange != null) {
        	_onChange = cfg.onChange;
        	cfg.onChange = function(self) {
        		_onChange(_me, _sitectg);
        	};
        }
        /*继承父级*/
        this.super0(this, new CSJSV3.UI.TagInput(cfg));
    }

    this.init = function (world) {
        /*继承父级*/
        _me.base.init(world);
        
        _sitectg = new CSJSV3.AUI.SiteCtgMgr({ 
			root: {
				id : '',
				pid : '',
				title : '根',
				leaf : false,
				hide: true
			},
			onRenderNodeBefore: cfg.onRenderNodeBefore,
			/*onRenderNodeBefore: function (node) {
	            if (node.level == 0) {
	                node.state = 'expand';
	            }
	        },*/
        	canSelectProc: function(self, node) {
        		if(node.level > 0 && node.childcount == 0) {
        			return true;
        		}
        		return false;
        	},
        	onSelected: function(self, node) {
        		_win.hide();
        		var dc = { id:node.id, title:node.title, pid:node.pid, ptype:node.ptype, level:node.level, childcount: node.childcount };
                _me.addItem(dc);
                
                if(_onChange != null) {
                	_onChange(_me, self);
                }
        	},
        	needLoadCount: cfg.needLoadCount,
        	onReady: cfg.onReady
        });
        _sitectg.init(world);
        
        _win = new CSJSV3.UI.Win({ title: '请选择', body: _sitectg.getUICore(), closeBtnType: 'hide', width: 300, height: 'auto' });
        _win.init(world);
    };
    
    this.render = function() {
    	_win.render();
    	_sitectg.render();
    };
};
CSJSV3.AUI.CtgsSelector.prototype = new CSJSV3.SuperHelper();
