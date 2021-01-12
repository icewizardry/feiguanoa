CSJSV3.AUI.DataAgent = function(cfg) {
	var _me = this;
	var _reqSvrUrl = '../../api/ui';

	{
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
	};

	this.reqSvrUrl = function() {
		return _reqSvrUrl;
	};

	this.loadHomeData = function(pars, callback) {
		_me.world().setLoading(true);
		_me.com().reqByCmd('loadhomedata', pars, function(r) {
			_me.world().setLoading(false);
			if(r.success == false) {
				_me.world().showErrorMsg(r.msg);
			}
			else {
				if (callback != null) {
					callback(r);
				}
			}
		}, _reqSvrUrl);
	};
};
CSJSV3.AUI.DataAgent.prototype = new CSJSV3.SuperHelper();

CSJSV3.AUI.CurrentView = function(cfg) {
	var _me = this;
	var _uiCore;
	var _da;
	var _resizeDelayThread;
	var _area1;
	var _area2;
	var _area3;
	var _area4;
	var _area5;
	var _area6;
	var _area7;
	var _area8;

	{
		_uiCore = $('<div class="CSJSV3UIHome"></div>');
		cfg.uiCore = _uiCore;
		_da = new CSJSV3.AUI.DataAgent({});
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		_da.init(world);
		
		_area1 = new CSJSV3.AUI.HomeArea1({});
		_area1.init(world);
		_uiCore.append(_area1.getUICore());
		
		_area2 = new CSJSV3.AUI.HomeArea2({});
		_area2.init(world);
		_uiCore.append(_area2.getUICore());
		
		_area3 = new CSJSV3.AUI.HomeArea3({});
		_area3.init(world);
		_uiCore.append(_area3.getUICore());
		
		_area4 = new CSJSV3.AUI.HomeArea4({});
		_area4.init(world);
		_uiCore.append(_area4.getUICore());
		
		_area5 = new CSJSV3.AUI.HomeArea5({});
		_area5.init(world);
		_uiCore.append(_area5.getUICore());
		
		_area6 = new CSJSV3.AUI.HomeArea6({});
		_area6.init(world);
		_uiCore.append(_area6.getUICore());
		
		_area7 = new CSJSV3.AUI.HomeArea7({});
		_area7.init(world);
		_uiCore.append(_area7.getUICore());
		
		_area8 = new CSJSV3.AUI.HomeArea8({});
		_area8.init(world);
		_uiCore.append(_area8.getUICore());
		
		_me.loadData();
	};

	this.render = function() {
		_me.base.render();
		_area1.render();
		_area2.render();
		_area3.render();
		_area4.render();
		_area5.render();
		_area6.render();
		_area7.render();
		_area8.render();
	};
	
	this.resize = function() {
		_resize();
		clearTimeout(_resizeDelayThread);
		_resizeDelayThread = setTimeout(function(){_resize();}, 1000 * 1);
	};
	
	this.loadData = function() {
		_da.loadHomeData({}, function(r) {
			for(var i=0;i<8;i++) {
				if(eval('_area' + (i+1)) != null && eval('_area' + (i+1) + '.setData') != null) {
					eval('_area' + (i+1) + '.setData(r.data)');
				}
			}
			/*
			_area1.setData(r.data);
			_area2.setData(r.data);
			_area3.setData(r.data);
			_area4.setData(r.data);
			_area5.setData(r.data);
			_area6.setData(r.data);
			_area7.setData(r.data);
			_area8.setData(r.data);*/
		});
	};
	
	function _resize() {
		var winWidth = $(window).width();
		var winHeight = $(window).height();
		
		_area1.getUICore().width(winWidth - 380);
		_area1.getUICore().height(80);
		_area1.getUICore().css('left', 18);
		_area1.getUICore().css('top', 18);
		_area1.resize();
		
		_area2.getUICore().width(330);
		_area2.getUICore().height(winHeight / 2 - 10 - 95);
		_area2.getUICore().css('right', 18);
		_area2.getUICore().css('top', 18 + 95);
		_area2.resize();
		
		_area3.getUICore().width(300);
		_area3.getUICore().height(winHeight / 2 - 105);
		_area3.getUICore().css('left', 18);
		_area3.getUICore().css('top', _area1.getUICore().height() + 33);
		_area3.resize();
		
		_area4.getUICore().width((winWidth - _area2.getUICore().width() - 50) / 2);// - _area3.getUICore().width()
		_area4.getUICore().height(winHeight / 2 - 105);
		_area4.getUICore().css('left', 18);//_area3.getUICore().position().left + _area3.getUICore().width() + 
		_area4.getUICore().css('top', _area1.getUICore().height() + 33);
		_area4.resize();
		
		_area5.getUICore().width(winWidth - _area2.getUICore().outerWidth(true) - _area4.getUICore().outerWidth(true) - 64);// - _area3.getUICore().outerWidth(true)
		_area5.getUICore().height(winHeight / 2 - 105);
		_area5.getUICore().css('left', _area4.getUICore().outerWidth(true) + 32);//_area3.getUICore().position().left +  + _area3.getUICore().outerWidth(true)
		_area5.getUICore().css('top', _area1.getUICore().height() + 33);
		_area5.resize();
		
		_area6.getUICore().width(winWidth - _area2.getUICore().outerWidth(true) - 50);
		_area6.getUICore().height(winHeight / 2 - 88);
		_area6.getUICore().css('left', 18);
		_area6.getUICore().css('top', winHeight / 2 + 23);
		_area6.resize();
		
		_area7.getUICore().width(330);
		_area7.getUICore().height(winHeight / 2 - 88);
		_area7.getUICore().css('right', 18);
		_area7.getUICore().css('top', winHeight / 2 + 23);
		_area7.resize();
		
		_area8.getUICore().css('left', 0);
		_area8.getUICore().css('right', 0);
		_area8.getUICore().css('bottom', 0);
		_area8.resize();
	}
};
CSJSV3.AUI.CurrentView.prototype = new CSJSV3.SuperHelper();
//首页用户个人面板
CSJSV3.AUI.HomeArea1 = function(cfg) {
	var _me = this;
	var _uiCore;
	var _da;
	var _area1;
	var _area2;
	var _area3;
	var _area4;
	var _area5;

	{
		_uiCore = $('<div class="CSJSV3UIHomeArea"></div>');
		cfg.uiCore = _uiCore;
		_da = new CSJSV3.AUI.DataAgent({});
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		_da.init(world);
		
		_area1 = $('<div class="CSJSV3UIHomeBlock"></div>');
		_area1.html('<span class="BlueTxt">欢迎</span>&nbsp;<span style="color:#FE9004;font-weight:bold;">' + _me.com().getWebTopObj().getMyAttr('rn') + '</span>&nbsp;<span class="BlueTxt">登录，祝您一天工作好心情~</span>');
		_uiCore.append(_area1);
		
		_area2 = $('<div class="CSJSV3UIHomeBlock" style="border-left:3px solid #F99269;border-bottom:3px solid #F99269;">&nbsp;</div>');
		_uiCore.append(_area2);
		
		_area3 = $('<div class="CSJSV3UIHomeBlock" style=""></div>');
		//<span style="color:gray;font-size:13px;">人员性质&emsp;</span><span id="ryxz">无</span>
		_area3.html('<span style="color:gray;font-size:13px;">科室&emsp;</span>{0}&emsp;&emsp;&emsp;<span style="color:gray;font-size:13px;">职务&emsp;</span><span id="zhiwu">无</span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<span style="color:gray;font-size:13px;display:none;">我的评级&emsp;</span><span id="wdpj" style="display:none;">无</span>'.replace('{0}', _me.com().getWebTopObj().getMyAttr('dep')));
		_uiCore.append(_area3);
		
		_area4 = $('<div class="CSJSV3UIHomeBlock" style=""><div class="TimeLabel BlueTxt" style="font-size:26px;text-align:center;"></div><div style="height:5px;">&nbsp;</div><div class="DateLabel" style="text-align:center;color:gray;"></div></div>');
		_uiCore.append(_area4);
		
		_area5 = $('<iframe class="CSJSV3UIHomeBlock" name="weather_inc" src="http://i.tianqi.com/index.php?c=code&id=48" width="700" height="70" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>');
		_uiCore.append(_area5);
		
		thread1();
	};

	this.render = function() {
		_me.base.render();
	};
	
	this.resize = function() {
		_area1.css('left', 18);
		_area1.css('top', 10);
		_area2.css('left', 0);
		_area2.css('top', 0);
		_area2.width(60);
		_area2.height(_uiCore.height() - 3);
		_area3.css('left', 25);
		_area3.css('bottom', 15);
		_area4.css('left', _area3.width() + 90);
		_area4.css('top', 8);
		_area5.css('left', _area4.position().left + 130);
		_area5.css('bottom', 5);
	};
	
	this.setData = function(data) {
		if(data.userzhiwu == '') {
			_area3.find('#zhiwu').html('无');
		}
		else {
			_area3.find('#zhiwu').html(data.userzhiwu);
		}
	};
	
	function thread1() {
		var str = _me.com().toDateTimeStr(new Date());
		var strs = str.split(' ');
		_area4.find('.TimeLabel').html(strs[1]);
		_area4.find('.DateLabel').html(strs[0]);
		setTimeout(function() {
			thread1();
		}, 1000);
	}
};
CSJSV3.AUI.HomeArea1.prototype = new CSJSV3.SuperHelper();
//请假面板
CSJSV3.AUI.HomeArea2 = function(cfg) {
	var _me = this;
	var _uiCore;
	var _da;
	var _data;
	var _area1;
	var _headArea;
	var _moreBtn;
	var _listHeadArea;
	var _bodyArea;

	{
		_uiCore = $('<div class="CSJSV3UIHomeArea"><div class="headArea" style="border-bottom:1px solid #F4F4F4; line-height:50px;height:50px;"><img src="img/ic_user.png" style="vertical-align:middle;height:26px;margin-right:8px;" />请假动态<div style="float:right;padding-right:12px;color:#4EA6ED;"><img class="moreBtn" src="img/ic_view.png" style="vertical-align:middle;height:23px;" /></div></div><div class="listHeadArea listItem" style="line-height:26px;background-color:#F4F5F7;"><div class="listField" style="width:20%;text-align:center;">姓名</div><div class="listField" style="width:20%;text-align:center;">事由</div><div class="listField" style="width:60%;text-align:center;">时间</div><div style="clear:both;"></div></div><div class="bodyArea" style="overflow:hidden;padding-top:8px;"></div></div>');
		cfg.uiCore = _uiCore;
		_da = new CSJSV3.AUI.DataAgent({});
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		_da.init(world);
		
		_area1 = $('<div class="CSJSV3UIHomeBlock" style="border-left:3px solid #8BD4DF;border-top:3px solid #8BD4DF;">&nbsp;</div>');
		_uiCore.append(_area1);
		
		_headArea = _uiCore.find('.headArea');
		_moreBtn = _uiCore.find('.moreBtn').click(function() {
			_me.com().getWebTopObj().addTab({ title: '请假管理', body: '../apps/kaoqin/qingjiadanmgr.htm' });
		});
		_listHeadArea = _uiCore.find('.listHeadArea');
		_bodyArea = _uiCore.find('.bodyArea');
		
		// 输出节约粮食banner
		var jylsBanner = $('<div style="position:absolute;top:-95px;right:0;box-shadow:#E0E1E5 0px 0px 6px 1px;width:330px;height:80px;"><div style="width:330px;height:80px;"><img src="{src}" data-url="{url}" onclick="if ($(this).attr(\'data-url\') != \'\' && $(this).attr(\'data-url\').indexOf(\'{\') == -1) { window.open($(this).attr(\'data-url\')); }" style="width:330px;height:80px;" /></div></div>');
		_me.getUICore().append(jylsBanner);
		jylsBanner.ready(function() {
	        var aasb = new CSUIAreaAutoScrollBar({ 
	        	renderTo: jylsBanner.children().first(), 
	        	canSeeItemCount: 1, 
	            direction: 'r-l',
	            scrollInterval: 10,
	            scrollDistance: 5,
	            waitTime: 1000 * 3,
	        	data: [{ src: 'img/banner1.jpg', url: '../info/infocontent_tmp_0.htm?infid=80b3004f-2621-47f6-a58c-880200469952' },
					{ src: 'img/home_img0.png' }, { src: 'img/home_img1.png' }, { src: 'img/home_img2.png' }, { src: 'img/home_img3.png'}, { src: 'img/home_img4.png'}, { src: 'img/home_img5.png'}] });
	        aasb.build();
	        aasb.rebuild();
		});
	};

	this.render = function() {
		_me.base.render();
		_bodyArea.children().remove();
		if(_data != null && _data.length > 0) {
			var panel = $('<div class="ScrollItem"></div>');
			for(var i=0;i<_data.length;i++) {
				var str = _me.com().toDateStr(_data[i].starttime) + '&ensp;到&ensp;' + _me.com().toDateStr(_data[i].endtime);
				
				var item = $('<div class="listItem"><div class="listField" style="width:20%;">' + _data[i].username + '</div><div class="listField" style="width:20%;color:gray;">' + _data[i].reason + '</div><div class="listField" style="width:60%;color:silver;">' + str + '</div><div style="clear:both;"></div></div>');
				panel.append(item);
			}
			_bodyArea.append(panel[0].outerHTML);
			_bodyArea.append(panel[0].outerHTML);
			_bodyArea.append(panel[0].outerHTML);
			//_bodyArea.niceScroll({ autohidemode: true });
		
			var cusb = new CSUIScrollBarA({
                direction: 'top',
                scrollInterval: 60,
                scrollView: _bodyArea,
                scrollItem: _bodyArea.find('.ScrollItem')
            });
            cusb.start();
		}
		
		_me.resize();
	};
	
	this.resize = function() {
		_area1.css('left', 0);
		_area1.css('top', 0);
		_area1.width(35);
		_area1.height(80);
		
		_bodyArea.height(_uiCore.height() - _headArea.height() - _listHeadArea.height() - 8);
	};
	
	this.setData = function(data) {
		_data = data.qinjiadans;
		_me.render();
	};
};
CSJSV3.AUI.HomeArea2.prototype = new CSJSV3.SuperHelper();
//签到签退面板
CSJSV3.AUI.HomeArea3 = function(cfg) {
	var _me = this;
	var _uiCore;
	var _da;
	var _data;

	{
		_uiCore = $('<div class="CSJSV3UIHomeArea" style="display:none;"><div class="headArea" style="background-color:#77D0D8;color:white;">签到状态</div><div class="bodyArea" style="padding-top:8px;"></div></div>');//<div style="float:right;padding-right:12px;color:#4EA6ED;"><img class="moreBtn" src="img/ic_view.png" style="vertical-align:middle;height:23px;" /></div>
		cfg.uiCore = _uiCore;
		_da = new CSJSV3.AUI.DataAgent({});
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		_da.init(world);
		var body = _uiCore.find('.bodyArea');
	};

	this.render = function() {
		_me.base.render();
		var head = _uiCore.find('.headArea');
		var body = _uiCore.find('.bodyArea');
		body.children().remove();
		if(_data != null && _data.length > 0) {
			for(var i=0;i<_data.length;i++) {
				var str = '';
				if(_data[i].type == 'I') {
					str = '上班签到';
				}
				else {
					str = '下班签退';
				}
				var date = '';
				date = _me.com().toDateStr(_data[i].time);
				var strs = date.split('-');
				date = date.replace(strs[0] + '-', '');
				var item = $('<div class="listItem"><div class="listField" style="width:45%;padding-left:12px;color:gray;text-align:left;">' + _data[i].realname + '</div><div class="listField" style=""><span style="color:#4EA6ED;">' + date + '&ensp;' + _me.com().toTimeStr(_data[i].time, true) + '</span>&emsp;<span style="color:silver;">' + str + '</span></div><div style="clear:both;"></div></div>');
				body.append(item);
			}
			body.niceScroll({ autohidemode: true });
		}
		_me.resize();
	};
	
	this.resize = function() {
		var head = _uiCore.find('.headArea');
		var body = _uiCore.find('.bodyArea');
		body.height(_uiCore.height() - head.height() - 8);
	};
	
	this.setData = function(data) {
		_data = data.signinouts;
		_me.render();
	};
};
CSJSV3.AUI.HomeArea3.prototype = new CSJSV3.SuperHelper();
//通知公告面板
CSJSV3.AUI.HomeArea4 = function(cfg) {
	var _me = this;
	var _uiCore;
	var _da;
	var _data;

	{
		_uiCore = $('<div class="CSJSV3UIHomeArea"><div class="headArea" style="border-bottom:1px solid #F4F4F4;">通知公告<div class="moreBtn" style="float:right;padding-right:12px;color:#4EA6ED;">more</div></div><div class="bodyArea" style="padding-top:8px;overflow:hidden;"></div></div>');
		cfg.uiCore = _uiCore;
		_da = new CSJSV3.AUI.DataAgent({});
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		_da.init(world);
		_uiCore.find('.moreBtn').click(function() {
			_me.com().getWebTopObj().addTab({ title: '通知公告', body: '../apps/info/infomgr.htm?mode=see&nolimit=1&needreadlimit=1&ctgid=ca7ef6a7-30d3-47fa-b7d3-d09c32937caa' });
		});
	};

	this.render = function() {
		_me.base.render();
		var head = _uiCore.find('.headArea');
		var body = _uiCore.find('.bodyArea');
		body.children().remove();
		if(_data != null && _data.length > 0) {
			var panel = $('<div class="ScrollItem"></div>');
			for(var i=0;i<_data.length;i++) {
				var date = '';
				date = _me.com().toDateStr(_data[i].crttime);
				var strs = date.split('-');
				date = date.replace(strs[0] + '-', '');
				var item = $('<div class="listItem"><div class="listField" style="width:45%;padding-left:12px;color:gray;text-align:left;"><a href="../info/infocontent.htm?infid=' + _data[i].id + '" title="' + _data[i].title + '" target="_blank">' + _data[i].title + '</a></div><div class="listField" style="margin-left:10px;"><span style="color:silver;">' + _me.com().toDateStr(_data[i].crttime) + '</span></div><div style="clear:both;"></div></div>');
				item[0].datacontext = _data[i];
				panel.append(item);
			}
			body.append(panel[0].outerHTML);
			body.append(panel[0].outerHTML);
			body.append(panel[0].outerHTML);
			//body.niceScroll({ autohidemode: true });
		
			var cusb = new CSUIScrollBarA({
                direction: 'top',
                scrollInterval: 60,
                scrollView: body,
                scrollItem: body.find('.ScrollItem')
            });
            cusb.start();
		}
		_me.resize();
	};
	
	this.resize = function() {
		var head = _uiCore.find('.headArea');
		var body = _uiCore.find('.bodyArea');
		body.height(_uiCore.height() - head.height() - 9);
		body.find('.listItem').each(function(i,n){
			$(n).find('.listField').first().width(body.width() - 100 - 8);
		});
	};
	
	this.setData = function(data) {
		_data = data.tongzhigonggaos;
		_me.render();
	};
};
CSJSV3.AUI.HomeArea4.prototype = new CSJSV3.SuperHelper();
//站内信面板
CSJSV3.AUI.HomeArea5 = function(cfg) {
	var _me = this;
	var _uiCore;
	var _da;
	var _data;

	{
		_uiCore = $('<div class="CSJSV3UIHomeArea"><div class="headArea" style="border-bottom:1px solid #F4F4F4;">邮件<div class="moreBtn" style="float:right;padding-right:12px;color:#4EA6ED;">more</div></div><div class="bodyArea" style="padding-top:8px;"></div></div>');
		cfg.uiCore = _uiCore;
		_da = new CSJSV3.AUI.DataAgent({});
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		_da.init(world);
		_uiCore.find('.moreBtn').click(function() {
			_me.com().getWebTopObj().addTab({ title: '邮件', body: '../apps/sys/inmailmgr.htm' });
		});
	};

	this.render = function() {
		_me.base.render();
		var head = _uiCore.find('.headArea');
		var body = _uiCore.find('.bodyArea');
		body.children().remove();
		if(_data != null && _data.length > 0) {
			for(var i=0;i<_data.length;i++) {
				var date = '';
				date = _me.com().toDateStr(_data[i].crttime);
				var strs = date.split('-');
				date = date.replace(strs[0] + '-', '');
				var item = $('<div class="listItem"><div class="listField" style="width:45%;padding-left:12px;color:gray;text-align:left;"><a href="javascript:;" data-id="' + _data[i].id + '" title="' + _data[i].title + '">' + _data[i].title + '</a></div><div class="listField" style="margin-left:10px;"><span style="color:silver;">' + _me.com().toDateStr(_data[i].crttime) + '</span></div><div style="clear:both;"></div></div>');
				item[0].datacontext = _data[i];
				item.find('a').click(function() {
					_me.com().getWebTopObj().addTab({ title: '邮件', body: '../apps/sys/inmailmgr.htm?seeid=' + $(this).attr('data-id') });
				});
				body.append(item);
			}
			body.niceScroll({ autohidemode: true });
		}
		_me.resize();
	};
	
	this.resize = function() {
		var head = _uiCore.find('.headArea');
		var body = _uiCore.find('.bodyArea');
		body.height(_uiCore.height() - head.height() - 9);
		body.find('.listItem').each(function(i,n){
			$(n).find('.listField').first().width(body.width() - 100 - 8);
		});
	};
	
	this.setData = function(data) {
		_data = data.zhanneixins;
		_me.render();
	};
};
CSJSV3.AUI.HomeArea5.prototype = new CSJSV3.SuperHelper();
//政务信息/工作动态面板
CSJSV3.AUI.HomeArea6 = function(cfg) {
	var _me = this;
	var _uiCore;
	var _da;
	var _data;
	var _dangtuanmembers;

	{
		_uiCore = $('<div class="CSJSV3UIHomeArea"><div class="headArea" style="border-bottom:1px solid #F4F4F4;"><div class="tabHead tabHeadSelected" ctgid="9a9b8792-fa53-4d4b-8c6c-7e4f8298c1f7" style="float:left;">政务信息</div><div style="float:left;width:20px;">&nbsp;</div><div class="tabHead" ctgid="5cc77b04-0951-412f-986c-f654cdeae25a" style="float:left;display:none;">工作动态</div><div class="moreBtn" style="float:right;padding-right:12px;color:#4EA6ED;">more</div></div><div class="bodyArea" style="padding-top:8px;overflow:hidden;"></div><div class="bodyArea" style="display:none;padding-top:8px;overflow:hidden;"></div></div>');
		cfg.uiCore = _uiCore;
		_da = new CSJSV3.AUI.DataAgent({});
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		_da.init(world);
		_buildTab();
		
		_uiCore.find('.moreBtn').click(function() {
			var tab = _uiCore.find('.tabHeadSelected');
			var ctgid = tab.attr('ctgid');
			_me.com().getWebTopObj().addTab({ title: tab.html(), body: '../apps/info/infomgr.htm?mode=see&nolimit=1&needreadlimit=1&ctgid=' + ctgid });
		});
	};

	this.render = function() {
		_me.base.render();
		_uiCore.find('.bodyArea').each(function(r, n) {
			var body = $(n);
			body.children().remove();
			if(_data != null && _data.length > 1) {
				if(_data[r] != null && _data[r].length > 0) {
					var panel = $('<div class="ScrollItem"></div>');
					for(var i = 0;i < _data[r].length;i++) {
						var date = '';
						date = _me.com().toDateStr(_data[r][i].crttime);
						var strs = date.split('-');
						date = date.replace(strs[0] + '-', '');
						
						var bmstr = _data[r][i].cuserbm;
						if(_data[r][i].xingzhi == 1) {
							for(var x=0;x<_dangtuanmembers.length;x++) {
								if(_data[r][i].cuserid == _dangtuanmembers[x].id) {
									bmstr = _dangtuanmembers[x].bmtitle;
									break;
								}
							}
						}
						var item = $('<div class="listItem"><div class="listField" style="width:45%;padding-left:12px;color:gray;text-align:left;"><a href="../info/infocontent.htm?infid=' + _data[r][i].id + '" title="' + _data[r][i].title + '" target="_blank">【' + bmstr + '】' + _data[r][i].title + '</a></div><div class="listField" style="margin-left:10px;"><span style="color:silver;">' + _me.com().toDateStr(_data[r][i].crttime) + '</span></div><div style="clear:both;"></div></div>');
						item[0].datacontext = _data[r][i];
						panel.append(item);
					}
					body.append(panel[0].outerHTML);
					body.append(panel[0].outerHTML);
					body.append(panel[0].outerHTML);
					//body.niceScroll({ autohidemode: true });
		
					var cusb = new CSUIScrollBarA({
		                direction: 'top',
		                scrollInterval: 60,
		                scrollView: body,
		                scrollItem: body.find('.ScrollItem')
		            });
		            cusb.start();
				}
			}
		});
		_me.resize();
	};
	
	this.resize = function() {
		var head = _uiCore.find('.headArea');
		var body = _uiCore.find('.bodyArea');
		body.height(_uiCore.height() - head.height() - 8);
		body.find('.listItem').each(function(i,n){
			$(n).find('.listField').first().width(body.width() - 110);
		});
	};
	
	this.setData = function(data) {
		_data = [data.dangwugongkais, data.gongzuodongtais];
		_dangtuanmembers = data.dangtuanmembers;
		_me.render();
	};
	
	function _buildTab() {
		_uiCore.find('.tabHead').each(function(i, n) {
			var tab = $(n);
			tab.attr('tabindex', i);
			_uiCore.find('.bodyArea').eq(i).attr('tabindex', i);
			tab.click(function() {
				_uiCore.find('.tabHeadSelected').removeClass('tabHeadSelected');
				$(this).addClass('tabHeadSelected');
				_uiCore.find('.bodyArea').hide();
				_uiCore.find('.bodyArea[tabindex=' + $(this).attr('tabindex') + ']').show();
			});
		});
	}
};
CSJSV3.AUI.HomeArea6.prototype = new CSJSV3.SuperHelper();
//常用资料区面板
CSJSV3.AUI.HomeArea7 = function(cfg) {
	var _me = this;
	var _uiCore;
	var _da;
	var _data;

	{
		_uiCore = $('<div class="CSJSV3UIHomeArea"><div class="headArea" style="border-bottom:1px solid #F4F4F4;">常用资料区<div class="moreBtn" style="float:right;padding-right:12px;color:#4EA6ED;">more</div></div><div class="bodyArea" style="padding-top:8px;"></div></div>');
		cfg.uiCore = _uiCore;
		_da = new CSJSV3.AUI.DataAgent({});
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		_da.init(world);
		
		_uiCore.find('.moreBtn').click(function() {
			_me.com().getWebTopObj().addTab({ title: '常用资料', body: '../apps/info/infomgr.htm?mode=see&nolimit=1&needreadlimit=1&ctgid=83d3aa3f-d61f-4f59-bfc1-c8c410702d50' });
		});
	};

	this.render = function() {
		_me.base.render();
		var head = _uiCore.find('.headArea');
		var body = _uiCore.find('.bodyArea');
		body.children().remove();
		if(_data != null && _data.length > 0) {
			for(var i=0;i<_data.length;i++) {
				var date = '';
				date = _me.com().toDateStr(_data[i].crttime);
				var strs = date.split('-');
				date = date.replace(strs[0] + '-', '');
				var item = $('<div class="listItem"><div class="listField" style="width:45%;padding-left:12px;color:gray;text-align:left;"><a href="../info/infocontent.htm?infid=' + _data[i].id + '" title="' + _data[i].title + '" target="_blank">' + _data[i].title + '</a></div><div class="listField" style="margin-left:10px;"><span style="color:silver;">' + _me.com().toDateStr(_data[i].crttime) + '</span></div><div style="clear:both;"></div></div>');
				item[0].datacontext = _data[i];
				body.append(item);
			}
			body.niceScroll({ autohidemode: true });
		}
		_me.resize();
	};
	
	this.resize = function() {
		var head = _uiCore.find('.headArea');
		var body = _uiCore.find('.bodyArea');
		body.height(_uiCore.height() - head.height() - 8);
		body.find('.listItem').each(function(i,n){
			$(n).find('.listField').first().width(body.width() - 100);
		});
	};
	
	this.setData = function(data) {
		_data = data.changyongziliaos;
		_me.render();
	};
};
CSJSV3.AUI.HomeArea7.prototype = new CSJSV3.SuperHelper();
//页尾
CSJSV3.AUI.HomeArea8 = function(cfg) {
	var _me = this;
	var _uiCore;
	var _da;

	{
		_uiCore = $('<div class="CSJSV3UIHomeArea" style="text-align:center;line-height:50px;background-color:#012da7;color:white;font-size:13px;">版权所有：上海市废弃物管理处&emsp;&emsp;&emsp;&emsp;&emsp;服务热线：400-601-8522&emsp;&emsp;&emsp;&emsp;&emsp;技术支持：创正信息化</div>');
		//&emsp;&emsp;&emsp;&emsp;&emsp;<a href="http://10.85.31.137" target="_blank" style="color:white;">市局OA系统</a>
		cfg.uiCore = _uiCore;
		_da = new CSJSV3.AUI.DataAgent({});
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		_da.init(world);
	};

	this.render = function() {
		_me.base.render();
	};
	
	this.resize = function() {
	};
};
CSJSV3.AUI.HomeArea8.prototype = new CSJSV3.SuperHelper();