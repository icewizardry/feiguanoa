CSJSV3.MUI = {};
	
window.onerror = function(errorMessage, scriptURI, lineNumber, columnNumber, errorObj) { 
	alert("错误信息：" + errorMessage); 
};

/*顶层类*/
CSJSV3.MUI.BaseObject = function(cfg) {
	var _me = this;

	{
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
	};

	this.render = function() {
		_me.base.render();
	};
	
	this.reqByCmd = function(cmd, pars, callback, svrUrl) {
		if(svrUrl.indexOf('~') != -1) {
			svrUrl = svrUrl.replace('~', '../..');
		}
		_me.com().reqByCmd(cmd, pars, callback, svrUrl);
	};
	
	this.rootUrl = function() {
		return '../../';
	};
};
CSJSV3.MUI.BaseObject.prototype = new CSJSV3.SuperHelper();

/* 标签栏 */
//onChange(self,dc)
CSJSV3.MUI.TabBar = function(cfg) {
	var _me = this;
	var _uiCore;

	{
		_uiCore = $('<div class="CSJSV3MUITabBar" style="display:flex;flex-direction:row;"></div>');
		cfg.uiCore = _uiCore;
		/* 继承父级 */
		this.super0(this, new CSJSV3.MUI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		
		if(cfg.items != null) {
			_uiCore.children().remove();
			for(var i=0;i<cfg.items.length;i++) {
				var item = $('<div class="TabHeadCell" style="width:33.3%;"></div>');
				item[0].datacontext = cfg.items[i];
				item.click(function() {
					_selectTab($(this));
				});
				item.html(cfg.items[i].title);
				if(i==0)item.addClass('TabHeadCellSelected');
				_uiCore.append(item);
			}
		}
	};
	
	function _selectTab(uiNode) {
		_uiCore.find('.TabHeadCell').removeClass('TabHeadCellSelected');
		uiNode.addClass('TabHeadCellSelected');
		
		if(cfg.onChange != null) {
			cfg.onChange(_me, uiNode[0].datacontext);
		}
	}
};
CSJSV3.MUI.TabBar.prototype = new CSJSV3.SuperHelper();

/* 底栏 */
// onClick(self,dc)
CSJSV3.MUI.BottomBar = function(cfg) {
	var _me = this;
	var _uiCore;

	{
		_uiCore = $('<div class="CSJSV3MUIBottomBar" style="display:flex;flex-direction:row;"></div>');
		cfg.uiCore = _uiCore;
		/* 继承父级 */
		this.super0(this, new CSJSV3.MUI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		
		if(cfg.items != null) {
			_uiCore.children().remove();
			for(var i=0;i<cfg.items.length;i++) {
				var item = $('<div class="Cell" style="width:33.3%;"></div>');
				item[0].datacontext = cfg.items[i];
				item.click(function() {
					if(cfg.onClick != null) {
						cfg.onClick($(this));
					}
				});
				var btn = $('<div style="display:flex;flex-direction:column;"><div style="height:8px;">&nbsp;</div><div style="height:30px;"><img src="' + cfg.items[i].icon + '" style="width:30px;height:30px;" /></div><div style="height:3px;">&nbsp;</div><div><span>' + cfg.items[i].title + '</span></div></div>');
				btn[0].datacontext = cfg.items[i];
				btn.find('img').click(function() { var dc = $(this).parent().parent()[0].datacontext; if(dc.onClick != null) dc.onClick(_me, dc); });
				btn.find('span').click(function() { var dc = $(this).parent().parent()[0].datacontext; if(dc.onClick != null) dc.onClick(_me, dc); });
				item.append(btn);
				_uiCore.append(item);
			}
		}
	};
};
CSJSV3.MUI.BottomBar.prototype = new CSJSV3.SuperHelper();

/*手机版滚动页（页面级滚动）*/
CSJSV3.MUI.ScrollView = function(cfg) {
	var _me = this;
	var _uiCore;
	var _scrollEndDelay;
	var _canTouchScrollEnd = true;

	{
		_uiCore = $('<div class="CSJSV3MUIScrollView"></div>');
		cfg.uiCore = _uiCore;
		/* 继承父级 */
		this.super0(this, new CSJSV3.MUI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		_uiCore.scroll(function() {
			//_me.world().setLoading(_uiCore.scrollTop() + ' ' +  _uiCore.height() + ' ' + _uiCore[0].scrollHeight);
			if((_uiCore.scrollTop() + _uiCore.height()) >= _uiCore[0].scrollHeight) {
				clearTimeout(_scrollEndDelay);
				_scrollEndDelay = setTimeout(function() {
					_touchScrollEnd();
				}, 0);
			}
		});
	};

	this.render = function() {
		_me.base.render();
	};
	
	function _touchScrollEnd() {
		if(_canTouchScrollEnd) {
			_canTouchScrollEnd = false;
			setTimeout(function() {
				_canTouchScrollEnd = true;
			}, 500);
			
			//_me.world().setLoading('已滚动到底部');
			if(cfg.onScrollEnd != null) {
				cfg.onScrollEnd(_me);
			}
		}
	}
};
CSJSV3.MUI.ScrollView.prototype = new CSJSV3.SuperHelper();

/*列表页
autoLoadData:true
*/
CSJSV3.MUI.ListView = function(cfg) {
	var _me = this;
	var _data;
	var _pageIndex = 1;
	var _isPageEnd = false;

	{
		cfg.onScrollEnd = function() {
			if(!_isPageEnd) {
				_pageIndex++;
				_loadData();
			}
		};
		/* 继承父级 */
		this.super0(this, new CSJSV3.MUI.ScrollView(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
	};

	this.render = function() {
		_me.base.render();
		_me.getUICore().children().remove();
		if(cfg.autoLoadData != false) {
			_loadData();
		}
	};
	
	this.resize = function() {
		_me.getUICore().find('.TitleArea').each(function(i, n) {
			$(n).width($(window).width() - 150);
		});
		_me.getUICore().find('.SplitLine').each(function(i, n) {
			$(n).width($(window).width() - 40);
		});
	};
	
	function _loadData(callback) {
		_me.world().setLoading('加载中');
		_me.loadDataProc({page:_pageIndex}, function(r) {
			_me.world().setLoading(false);
			if(r.success == false) {
				_me.world().showErrorMsg(r.msg);
			}
			else {
				if(r.data == null || r.data.length == 0) {
					_isPageEnd = true;
				}
				else {
					if (r.total != null && r.data.length == r.total) {
						_isPageEnd = true;
					}
					_data = r.data;
					_me.buildList();
				}
				
				_me.getUICore().find('.NoListDataTip').remove();
				if(_pageIndex == 1 && (r.data == null || r.data.length == 0)) {
					_me.getUICore().append('<div class="NoListDataTip" style="text-align:center;">当前没有任何数据</div>');
				}
				
				if(callback != null) {
					callback();
				}
			}
		});
	}
	
	this.loadDataProc = function(pars, callback) {
		var t = [
			{ title: '谁法师的会计', crttime: '2019-01-01 18:22:21' },
			{ title: '谁法师的会计谁法师的会计谁法师的会计谁法师的会计谁法师的会计谁法师的会计', crttime: '2019-01-01 18:22:21' },
			{ title: '谁法师的会计', crttime: '2019-01-01 18:22:21' }
		];
		
		for(var i=0;i<30;i++) {
			t.push({ title: '谁法师的会计', crttime: '2019-01-01 18:22:21' });
		}
		
		callback({success:true,data:t});
	};
	
	this.loadData = function(callback) {
		_loadData(callback);
	};
	
	this.buildListRow = function(self, dc) {
		var item = $('<div class="InfoListItem" style="display:flex;"><div style="flex-grow:1;padding-left:26px;"><div class="TitleArea" style=" overflow:hidden; text-overflow:ellipsis; white-space:nowrap;"><a href="' + self.cfg().conPageUrl + '?id=' + dc.id + '">' + dc.title + '</a></div></div><div style="width:110px;">' + _me.com().toDateStr(dc.crttime) + '</div></div>');
		return item;
	};
	
	this.buildList = function() {
		if(_data != null && _data.length > 0) {
			for(var i=0;i<_data.length;i++) {
				if(i != 0) {
					var line = $('<div class="SplitLine">&nbsp;</div>');
					if(cfg.allowSplitLine != false) {
						_me.getUICore().append(line);
					}
				}
				var item = _me.buildListRow(_me, _data[i]);
				_me.getUICore().append(item);
			}
			_me.resize();
		}
	};
	
	this.clearList = function() {
		_pageIndex = 1;
		_isPageEnd = false;
		_me.getUICore().children().remove();
	};
};
CSJSV3.MUI.ListView.prototype = new CSJSV3.SuperHelper();

/*手机版页*/
CSJSV3.MUI.View = function(cfg) {
	var _me = this;
	var _uiCore;
	var _items = [];

	{
		if(cfg.items != null) _items = cfg.items;
		_uiCore = $('<div class="CSJSV3MUIView"></div>');
		cfg.uiCore = _uiCore;
		/* 继承父级 */
		this.super0(this, new CSJSV3.MUI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		if(cfg.items != null) {
			for(var i=0;i<cfg.items.length;i++) {
				if(cfg.items[i].getUICore != null && cfg.items[i].init != null) {
					cfg.items[i].init(world);
				}
			}
		}
	};

	this.render = function() {
		_me.base.render();
		_uiCore.children().remove();
		if(cfg.items != null) {
			for(var i=0;i<cfg.items.length;i++) {
				if(cfg.items[i].render != null) {
					cfg.items[i].render();
				}
				if(cfg.items[i].getUICore != null) {
					if(cfg.items[i].cfg().flex == 1 || cfg.items[i].cfg().flex == '1' || cfg.items[i].cfg().flex == true) {
						cfg.items[i].getUICore().css('position', 'relative');
						cfg.items[i].getUICore().css('flex-grow', '1');
						cfg.items[i].getUICore().css('overflow-y', 'auto');
						cfg.items[i].getUICore().css('-webkit-overflow-scrolling', 'touch');
						_uiCore.append(cfg.items[i].getUICore());
					}
					else {
						_uiCore.append(cfg.items[i].getUICore());
					}
				}
				else {
					_uiCore.append(cfg.items[i]);
				}
			}
			
			//设置伸缩区域高度
			var otherHeight = 0;
			for(var i=0;i<cfg.items.length;i++) {
				if(cfg.items[i].getUICore != null) {
					if(cfg.items[i].cfg().flex == 1 || cfg.items[i].cfg().flex == '1' || cfg.items[i].cfg().flex == true) {
					}
					else {
						otherHeight += cfg.items[i].getUICore().outerHeight(true);
					}
				}
				else {
						otherHeight += cfg.items[i].outerHeight(true);
				}
			}
			
			for(var i=0;i<cfg.items.length;i++) {
				if(cfg.items[i].getUICore != null) {
					if(cfg.items[i].cfg().flex == 1 || cfg.items[i].cfg().flex == '1' || cfg.items[i].cfg().flex == true) {
						cfg.items[i].getUICore().css('height', $(window).height() - otherHeight);
						break;
					}
					else {
					}
				}
				else {
				}
			}
		}
	};
	
	this.resize = function() {
		_me.base.resize();
		if(cfg.items != null) {
			for(var i=0;i<cfg.items.length;i++) {
				if(cfg.items[i].getUICore != null && cfg.items[i].resize != null) {
					cfg.items[i].resize();
				}
			}
		}
	};
};
CSJSV3.MUI.View.prototype = new CSJSV3.SuperHelper();

CSJSV3.MUI.InputField = function(cfg) {
	var _me = this;

	{
		/* 继承父级 */
		this.super0(this, new CSJSV3.MUI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
	};
	
	this.value = function(v) {
		if(v != null) {
			_me.getUICore().val(v);
		}
		else {
			return _me.getUICore().val();
		}
	};
	
	this.val = function(v) {
		return _me.value(v);
	};
	
	this.readonly = function(v) {
		if(v != null) {
			_me.getUICore().attr('readonly', v);
		}
		else {
			return _me.getUICore().attr('readonly');
		}
	};
};
CSJSV3.MUI.InputField.prototype = new CSJSV3.SuperHelper();

/*表单页*/
CSJSV3.MUI.FormView = function(cfg) {
	var _me = this;

	{
		/* 继承父级 */
		this.super0(this, new CSJSV3.MUI.View(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
	};
	
	this.findFieldByName = function(name) {
		var uiCore = _me.getUICore().find('[name=' + name + ']');
		var field = new CSJSV3.MUI.InputField({uiCore:uiCore});
		field.init(_me.world());
		return field;
	};
};
CSJSV3.MUI.FormView.prototype = new CSJSV3.SuperHelper();

/*企业微信*/
CSJSV3.MUI.QiYeWeiXin = function(cfg) {
	var _me = this;

	{
		/* 继承父级 */
		this.super0(this, new CSJSV3.MUI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		/*
		wx.config({
		    beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
		    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		    appId: 'ww12230cf33c3d8ed1', // 必填，企业微信的corpID
		    timestamp: , // 必填，生成签名的时间戳
		    nonceStr: '', // 必填，生成签名的随机串
		    signature: '',// 必填，签名，见附录1
		    jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});*/
	};
	/*去授权并获取code*/
	this.toGetCode = function() {
		var redurl = location.href;
		location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + cfg.appid + '&redirect_uri=' + encodeURIComponent(redurl) + '&response_type=code&scope=snsapi_base&state=#wechat_redirect';
		/*这个方法不行，只能顶层授权
		var iframe = $('<iframe></iframe>');
		iframe.load(function(){
			alert(this.src);
		});
		$(document.body).append(iframe);
		iframe.attr('src', 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + cfg.appid + '&redirect_uri=' + encodeURIComponent(redurl) + '&response_type=code&scope=snsapi_base&state=#wechat_redirect');
		*/
	};
	/*获取用户信息，用于绑定系统账号*/
	this.getUserInfo = function(code, callback) {
		_me.reqByCmd('getuserinfoa', {appid:cfg.appid,secret:cfg.secret,code:code}, function(r) { callback(r); }, _me.rootUrl() + 'api/qywx');
	};
	/*获取用户信息，用于绑定系统账号*/
	this.getUserInfoAndLogin = function(code, callback) {
		_me.reqByCmd('getuserinfoaandlogin', {appid:cfg.appid,secret:cfg.secret,code:code}, function(r) { callback(r); }, _me.rootUrl() + 'api/qywx');
	};
	/*获取门票（一般用不到，只在服务端使用）*/
	this.getAccessToken = function(callback) {
		_me.reqByCmd('getaccesstoken', {appid:cfg.appid,secret:cfg.secret}, function(r) { callback(r); }, _me.rootUrl() + 'api/qywx');
	};
};
CSJSV3.MUI.QiYeWeiXin.prototype = new CSJSV3.SuperHelper();

/*企业微信用户管理*/
CSJSV3.MUI.QYWXUserMgr = function(cfg) {
	var _me = this;
	var _qywx;
	var _qywxcode = '';
	var _qywxuserinfo;

	{
		/* 继承父级 */
		this.super0(this, new CSJSV3.MUI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		_qywx = new CSJSV3.MUI.QiYeWeiXin(cfg);
		_qywx.init(world);
	};
	//用户授权（一开始要启动一个遮罩来防止产生WeiXinJSbridge is not defined的问题）
	this.ready = function(func) {
		var world = _me.world();
		
		//授权获取用户信息
		_qywxcode = world.com().queryString('code');
		if(_qywxcode == '') {
			_qywx.toGetCode();
		}
		else {
			_qywx.getUserInfo(_qywxcode, function(r) {
				world.setLoading(false);
				if(r.success == false) {
					world.showErrorMsg(r.msg);
				}
				else {
					_qywxuserinfo = r.data;
					if(_qywxuserinfo.UserId == null || _qywxuserinfo.UserId == '') {
						world.showErrorMsg('你不是此企业微信的成员');
					}
					else {
						if(func != null) {
							func(_me);
						}
					}
				}
			});
		}
	};
	//用户授权并登录
	this.readyA = function(func) {
		var world = _me.world();
		world.setLoading('用户授权并登录');
		//授权获取用户信息
		_qywxcode = world.com().queryString('code');
		if(_qywxcode == '') {
			_qywx.toGetCode();
		}
		else {
			_qywx.getUserInfoAndLogin(_qywxcode, function(r) {
				world.setLoading(false);
				if(r.success == false) {
					if(r.code == "nobind") {
						_me.world().showInfoMsg('账号还未进行绑定，将进入绑定页', function() {
							//跳转到绑定页
							if(location.href.indexOf('?code=') != -1) {
								location.href = 'userbind.htm?preurl=' + encodeURIComponent(location.href.replace(/code[=][^&]+[&]*/, ''));
							}
							else {
								location.href = 'userbind.htm?preurl=' + encodeURIComponent(location.href.replace(/[&]code[=][^&]+/, ''));
							}
						});
					}
					else {
						world.showErrorMsg(r.msg);
					}
				}
				else {
					_qywxuserinfo = r.data;
					if(_qywxuserinfo.UserId == null || _qywxuserinfo.UserId == '') {
						world.showErrorMsg('你不是此企业微信的成员');
					}
					else {
						if(func != null) {
							func(_me);
						}
					}
				}
			});
		}
	};
	//检测是否登录（一般用于网页调试）
	this.ready0 = function (func) {
		_me.isLogin(function (r) {
			if (r.data != true) {
				_me.world().showErrorMsg('请先登录');
			}
			else {
				if (func != null) {
					func(_me, r);
				}
			}
		});
	};
	//检测是否登录，否则用户授权并登录系统
	this.ready1 = function(func) {
		_me.isLogin(function(r) {
			if(r.data != true) {
				_me.readyA(function() {
					if(func != null) {
						func(_me, r);
					}
				});
			}
			else {
				if(func != null) {
					func(_me, r);
				}
			}
		});
	};
	
	//判定是否已登录
	this.isLogin = function(callback) {
		_me.reqByCmd('islogin', {}, function(r) {
			callback(r);
		}, _me.rootUrl() + 'api/qywx');
	};

	//登出
	this.logout = function (callback) {
		_me.reqByCmd('user_logout', {}, function (r) {
			callback(r);
		}, _me.rootUrl() + 'api/def');
	};
	
	//绑定用户
	this.bindUser = function(un, pwd, callback) {
		if(_qywxuserinfo == null) {
			callback({success:false,msg:'还未获取企业微信用户信息'});
		}
		else {
			var pars = {qywxid:_qywxuserinfo.UserId,sac:'',un:un,pwd:pwd};
			_me.reqByCmd('bindqywx', pars, function(r) {
				callback(r);
			}, _me.rootUrl() + 'api/qywx');
		}
	};
	/*
	//根据企业微信号登录
	this.login = function(callback) {
		if(_qywxuserinfo == null) {
			_me.world().showErrorMsg('还未获取企业微信用户信息，无法自动登录');
		}
		else {
			_me.reqByCmd('loginbyqywx', {qywxid:_qywxuserinfo.UserId,sac:''}, function(r) {
				if(r.success == false) {
					if(r.code == "nobind") {
						_me.world().showInfoMsg('账号还未进行绑定，将进入绑定页', function() {
							//跳转到绑定页
							location.href = 'userbind.htm?preurl=' + encodeURIComponent(location.href.replace(/&code[=][^&]+/, ''));
						});
					}
					else {
						_me.world().showErrorMsg('自动登录失败 -> ' + r.msg);
					}
				}
				else {
					if(callback != null) {
						callback(r);
					}
				}
			}, _me.rootUrl() + 'api/qywx');
		}
	};*/
};
CSJSV3.MUI.QYWXUserMgr.prototype = new CSJSV3.SuperHelper();