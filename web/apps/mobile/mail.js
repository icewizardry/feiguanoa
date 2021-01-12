
/* 请假管理列表页 */
// 
CSJSV3.MUI.MailList = function(cfg) {
	var _me = this;
	var _debug = false;
	var _userMgr;
	var _curTab = 'sjx';

	{
		cfg.autoLoadData = false;
		/* 继承父级 */
		this.super0(this, new CSJSV3.MUI.ListView(cfg));
		
		_me.base.loadDataProc = function(pars, callback) {
			if(_debug) {
				pars.debug = 1;
			}
			pars.state = _curTab;
			_list(pars, callback);
		};
		
		_me.base.buildListRow = function(self, dc) {
			var tousers = '';
			if(dc.tousers != null && dc.tousers != '') {
				var arr = JSON.parse(dc.tousers);
				for(var i=0;i<arr.length;i++) {
					if(i!=0) {
						tousers +='；';
					}
					tousers += arr[i].title;
				}
			}
			
			var ccusers = '';
			if(dc.ccusers != null && dc.ccusers != '') {
				var arr = JSON.parse(dc.ccusers);
				for(var i=0;i<arr.length;i++) {
					if(i!=0) {
						ccusers +='；';
					}
					ccusers += arr[i].title;
				}
			}
			
			
			var item = $('<div class="ListItem">' + 
			'<div style="height:10px;">&nbsp;</div>' +
			'<div style="display:flex;">' + 
			'<div class="ListItemCell" style="width:10px;">&nbsp;</div>' + 
			'<div class="ListItemCell" style="width:130px;text-align:left;flex-grow:1;"><div class="TitleArea"><img src="res/img/user1.png" style="float:left;height:29px;margin-top:3px;margin-right:10px;" />' + (dc.hasread == false ? '<div style="float:left;margin-right:10px;"><div style="height:13px;">&nbsp;</div><i class="RedPoint" style="width:10px;height:10px;border-radius:50%;background-color:red;display:block;"></i></div>' : '') + '<div style="float:left;">' + dc.fromuser + '</div></div></div>' + 
			'<div class="ListItemCell" style="width:120px;text-align:center;font-size:12px;color:silver;">' + _me.com().toDateStr(dc.crttime) + '</div>' + 
			'</div>' + 
			'<div style="display:flex;">' + 
			'<div class="ListItemCell" style="width:10px;">&nbsp;</div>' + 
			'<div class="ListItemCell" style="flex-grow:1;text-align:left;font-size:15px;color:gray;">' + dc.title + '</div>' + 
			'</div>' + 
			(tousers != '' ? ('<div style="display:flex;">' + 
			'<div class="ListItemCell" style="width:10px;">&nbsp;</div>' + 
			'<div class="ListItemCell" style="flex-grow:1;text-align:left;font-size:15px;color:gray;"><div class="CCArea">收信人：' + tousers + '</div></div>' + 
			'</div>') : '') + 
			(ccusers != '' ? ('<div style="display:flex;">' + 
			'<div class="ListItemCell" style="width:10px;">&nbsp;</div>' + 
			'<div class="ListItemCell" style="flex-grow:1;text-align:left;font-size:15px;color:gray;"><div class="CCArea">抄送人：' + ccusers + '</div></div>' + 
			'</div>') : '') + 
			'<div style="height:10px;">&nbsp;</div>' + 
			'<div class="DelBtn" tabindex=\'-1\'>删除</div>' + 
			'</div>');
			
			item[0].datacontext = dc;
			item.click(function() {
				_edit(this.datacontext.id);
			});
			item.find('.DelBtn').click(function(e) {
				e.preventDefault(); //方法阻止元素发生默认的行为（例如，当点击提交按钮时阻止对表单的提交）
    			e.stopPropagation(); //阻止 click 事件冒泡到父元素
				var nodeUI = $(this).parent();
				var dc = nodeUI[0].datacontext;
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
				$(n).width($(window).width() - 10 - 120 - 10);
			});
			_me.getUICore().find('.CCArea').each(function(i, n) {
				$(n).width($(window).width() - 10 - 10);
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
			secret:'VVN7Gc-g7nD4wrL50D_9lFEP0iI3_H-4z2mRBlUdQCE'
		});
		_userMgr.init(world);
		
		if(world.com().isQYWeiXin()) {
			_userMgr.ready1(function(self) {
				_me.loadData(function() {
					//自动跳到内容页
					var id = _me.com().queryString('mailid');
					if(id != '') {
						_edit(id);
					}
				});
			});
		}
		else {
			_debug = true;
			_me.loadData(function() {
				//自动跳到内容页
				var id = _me.com().queryString('mailid');
				if(id != '') {
					_edit(id);
				}
			});
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
	}
	
	function _list(pars, callback) {
		_me.reqByCmd('list', pars, function(r) {
			callback(r);
		}, _me.rootUrl() + 'api/inmail');
	}
	
	function _edit(id) {
		location.href = 'mail_form.htm?id=' + id;
	}
	
	function _remove(id, callback) {
		_me.world().setLoading(true);
		_me.reqByCmd('removeform', {id:id}, function(r) {
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
		}, '~/api/inmail');
	}
};
CSJSV3.MUI.MailList.prototype = new CSJSV3.SuperHelper();

/* 信息列表页 */
CSJSV3.MUI.MailView = function(cfg) {
	var _me = this;
	var _debug = false;
	var _list;
	var _bottomBar;

	{
		cfg.items = [
			new CSJSV3.MUI.TabBar({ 
				items: [
					{ id:'sjx', title: '收件箱' }, { id:'cgx', title: '草稿箱' }, { id:'yfs', title: '已发送' }, { id:'wdyj', title: '已删除' }//, { id:'sy', title: '所有' }
				],
				onChange: function(self, dc) {
					_list.curTab(dc.id);
					_list.clearList();
					_list.loadData();
				}
			 }),
			_list = new CSJSV3.MUI.MailList({ flex:1 }),
			_bottomBar = new CSJSV3.MUI.BottomBar({
				items: [
					{ id:'new', title: '发邮件', icon: 'res/img/newmail.png', onClick: function(self, dc) { _new(); } }
				]
			})
		];
		/* 继承父级 */
		this.super0(this, new CSJSV3.MUI.View(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
	};
	
	function _new() {
		location.href = 'mail_form.htm';
	}
};
CSJSV3.MUI.MailView.prototype = new CSJSV3.SuperHelper();


