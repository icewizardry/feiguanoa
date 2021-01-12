
/* 信息列表页 */
CSJSV3.MUI.InfoList = function(cfg) {
	var _me = this;
	var _userMgr;
	var _debug = false;
	
	{
		var parent = new CSJSV3.MUI.ListView(cfg);
		
	
		parent.resize = function() {
			_me.getUICore().find('.TitleArea').each(function(i, n) {
				//$(n).width($(window).width() - 150);
			});
		};
		cfg.autoLoadData = false;
		cfg.conPageUrl = 'tzgg_con.htm';
		cfg.allowSplitLine = true;
		/* 继承父级 */
		this.super0(this, parent);
		_me.base.loadDataProc = function(pars, callback) {
			pars.ctgid = 'ca7ef6a7-30d3-47fa-b7d3-d09c32937caa';
			if(_me.com().queryString('ctgid') != '') {
				pars.ctgid = _me.com().queryString('ctgid');
			}
			
			if(_debug) {
				pars.debug = 1;
			}
			
			_me.reqByCmd('flist1', pars, function(r) {
				callback(r);
			}, _me.rootUrl() + 'api/info');
		};
		
	
		this.base.buildListRow = function(self, dc) {
			//var item = $('<div class="InfoListItem" style="display:flex;line-height:30px;"><div style="flex-grow:1;padding-left:26px;"><div class="TitleArea" style=""><a href="' + self.cfg().conPageUrl + '?id=' + dc.id + '">' + dc.title + '</a></div></div><div style="width:110px;">' + _me.com().toDateStr(dc.crttime) + '</div></div>');
			var item = $('<div class="InfoListItem" style="line-height:30px;"><div style=""><div class="TitleArea" style=""><a href="' + self.cfg().conPageUrl + '?id=' + dc.id + '">' + dc.title + '</a></div></div><div class="TimeArea" style="">' + _me.com().toDateStr(dc.crttime) + '&emsp;' + dc.cusername + '</div></div>');
			return item;
		};
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		
		_userMgr = new CSJSV3.MUI.QYWXUserMgr({
			appid:'ww12230cf33c3d8ed1', 
			secret:'Hzl-eAEsOlnQwp7zFakz8pq4vYWHq8WJEUf_idyCQxU'
		});
		_userMgr.init(world);
		//if(true) {
		if(world.com().isQYWeiXin()) {
			_userMgr.ready1(function(self) {
				_me.loadData(function() {
					//自动跳到内容页
					var infid = _me.com().queryString('infid');
					if(infid != '') {
						location.href = cfg.conPageUrl + '?id=' + infid;
					}
				});
			});
		}
		else {
			_debug = true;
			_me.loadData(function() {
				//自动跳到内容页
				var infid = _me.com().queryString('infid');
				if(infid != '') {
					location.href = cfg.conPageUrl + '?id=' + infid;
				}
			});
		}
	};
	
	this.render = function() {
	};
};
CSJSV3.MUI.InfoList.prototype = new CSJSV3.SuperHelper();


