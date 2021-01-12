
/* 信息审核列表页 */
// 
CSJSV3.MUI.XXSHList = function(cfg) {
	var _me = this;
	var _debug = false;
	var _userMgr;
	var _curTab = 'dws';

	{
		cfg.autoLoadData = false;
		/* 继承父级 */
		this.super0(this, new CSJSV3.MUI.ListView(cfg));
		
		_me.base.loadDataProc = function(pars, callback) {
			if(_debug) {
				pars.debug = 1;
			}
			pars.shenpi = '1';
			pars.flow = _curTab;
			_list(pars, callback);
		};
		
		_me.base.buildListRow = function(self, dc) {
			/*
			var item = $('<div class="ListItem">' + 
			'<div style="height:10px;">&nbsp;</div>' +
			'<div style="display:flex;">' + 
			'<div class="ListItemCell" style="width:10px;">&nbsp;</div>' + 
			'<div class="ListItemCell" style="width:90px;text-align:center;">' + dc.reason + '</div>' + 
			'<div class="ListItemCell TitleArea" style="flex-grow:1;">' + dc.bmtitle + '</div>' + 
			'<div class="ListItemCell" style="width:90px;text-align:center;">' + (_curTab == 'wdsq' ? getState(dc) : dc.crtusername) + '</div>' + 
			'</div>' + 
			'<div style="display:flex;">' + 
			'<div class="ListItemCell" style="width:70px;text-align:right;font-size:15px;color:gray;">' + dc.days + '天</div>' + 
			'<div class="ListItemCell" style="flex-grow:1;text-align:center;font-size:15px;color:gray;">' + dc.starttime.replace('00:00:00', '上午').replace('12:00:00', '下午') + ' 到 ' + dc.endtime.replace('00:00:00', '上午').replace('12:00:00', '下午') + '</div>' + 
			'</div>' + 
			'<div style="height:10px;">&nbsp;</div>' + 
			'<div class="DelBtn" tabindex=\'-1\'>删除</div>' + 
			'</div>');*/
			
			var item = $('<div class="ListItem">' + 
			'<div style="height:10px;">&nbsp;</div>' +
			'<div style="display:flex;">' + 
			'<div class="ListItemCell" style="width:10px;">&nbsp;</div>' + 
			'<div class="ListItemCell" style="width:130px;text-align:left;flex-grow:1;"><div class="TitleArea">' + dc.title + '</div></div>' + 
			'<div class="ListItemCell" style="width:80px;text-align:center;">' + getState(dc) + '</div>' + 
			'</div>' + 
			'<div style="display:flex;flex-direction:row;">' + 
			'<div class="ListItemCell" style="width:10px;">&nbsp;</div>' + 
			'<div class="ListItemCell" style="text-align:left;font-size:15px;color:gray;">发布人：' + dc.cusername + '</div>' + 
			'<div class="ListItemCell" style="width:10px;">&nbsp;</div>' + 
			'</div>' + 
			'<div style="display:flex;">' + 
			'<div class="ListItemCell" style="width:10px;">&nbsp;</div>' + 
			'<div class="ListItemCell" style="text-align:left;font-size:15px;color:gray;">类目：' + dc.ctgtitles + '</div>' + 
			'<div class="ListItemCell" style="flex-grow:1;text-align:right;font-size:15px;color:gray;">' + dc.crttime + '</div>' + 
			'<div class="ListItemCell" style="width:10px;">&nbsp;</div>' + 
			'</div>' + 
			'<div style="height:10px;">&nbsp;</div>' + 
			'<div class="DelBtn" tabindex=\'-1\'>删除</div>' + 
			'</div>');
			
			item[0].datacontext = dc;
			item.click(function() {
				if(_curTab == 'dws') {
					location.href = 'xxsh_form.htm?adt=1&id=' + this.datacontext.id;
				}
				else {
					location.href = 'xxsh_form.htm?id=' + this.datacontext.id;
				}
			});
			item.find('.DelBtn').click(function(e) {
				e.preventDefault(); //方法阻止元素发生默认的行为（例如，当点击提交按钮时阻止对表单的提交）
    			e.stopPropagation(); //阻止 click 事件冒泡到父元素
				var nodeUI = $(this).parent();
				var dc = nodeUI[0].datacontext;
				_me.world().setLoading(true);
				_remove(dc.id, function() {
					nodeUI[0].hideDelBtn(nodeUI);
					_me.clearList();
					_me.loadData();
				});
			});
			item[0].showDelBtn = function(nodeUI) {
				nodeUI.find('.DelBtn').css('line-height', nodeUI.height() + 'px');
				nodeUI.find('.DelBtn').show();
				nodeUI.find('.DelBtn').animate({
				    width:'90px'
				  }, 300);
			};
			item[0].hideDelBtn = function(nodeUI) {
				nodeUI.find('.DelBtn').animate({
				    width:'0px'
				  }, 300, function(){nodeUI.find('.DelBtn').hide()});
			};
			item.find('.DelBtn').blur(function(){
				var nodeUI = $(this).parent();
				nodeUI[0].hideDelBtn(nodeUI);
			});
			new CSJSV3.MUI.Touch({
				tgt:item,
				onLeftSlide:function(self,tgt,v) {
					tgt[0].showDelBtn(tgt);
					tgt.find('.DelBtn').focus();
				},
				onRightSlide:function(self,tgt,v) {
					tgt[0].hideDelBtn(tgt);
				}
			});
			return item;
		};
		
		_me.base.resize = function() {
			_me.getUICore().find('.TitleArea').each(function(i, n) {
				$(n).width($(window).width() - 10 - 80 - 10);
			});
			_me.getUICore().find('.SplitLine').each(function(i, n) {
				$(n).width($(window).width() - 40);
			});
		};
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		
		_userMgr = new CSJSV3.MUI.QYWXUserMgr({
			appid:'ww12230cf33c3d8ed1', 
			secret:'pnJcCpJAecK8_JQ5sCHa6-5BUD9N7SaIaBbWmsJsc20'
		});
		_userMgr.init(world);
		
		if(world.com().isQYWeiXin()) {
			_userMgr.ready1(function(self) {
				_me.loadData();
			});
		}
		else {
			_debug = true;
			_me.loadData();
		}
	};
	
	this.resize = function() {
		_me.base.resize();
	};
	
	this.curTab = function(v) {
		if(v != null) {
			_curTab = v;
		}
		return _curTab;
	};
	
	function _list(pars, callback) {
		_me.reqByCmd('list', pars, function(r) {
			callback(r);
		}, _me.rootUrl() + 'api/info');
	}
	
	function _remove(id, callback) {
		_me.reqByCmd('remove', {id:id}, function(r) {
			_me.world().setLoading(false);
			if(r.success == false) {
				_me.world().showErrorMsg(r.msg);
			}
			else {
				_me.world().showInfoMsg('删除完毕');
				if(callback != null) {
					callback();
				}
			}
		}, '~/api/info');
	}
};
CSJSV3.MUI.XXSHList.prototype = new CSJSV3.SuperHelper();

/* 信息审核页 */
CSJSV3.MUI.XXSHView = function(cfg) {
	var _me = this;
	var _debug = false;
	var _list;
	var _bottomBar;

	{
		cfg.items = [
			new CSJSV3.MUI.TabBar({ 
				items: [
					{ id:'dws', title: '待我审的' }, { id:'wys', title: '我已审的' }//, { id:'', title: '所有' }
				],
				onChange: function(self, dc) {
					_list.curTab(dc.id);
					_list.clearList();
					_list.loadData();
				}
			 }),
			_list = new CSJSV3.MUI.XXSHList({ flex:1 })/*,
			_bottomBar = new CSJSV3.MUI.BottomBar({
				items: [
					{ id:'new', title: '申请', icon: 'res/img/new.png', onClick: function(self, dc) { location.href = 'xxsh_form.htm'; } }
				]
			})*/
		];
		/* 继承父级 */
		this.super0(this, new CSJSV3.MUI.View(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
	};
};
CSJSV3.MUI.XXSHView.prototype = new CSJSV3.SuperHelper();


