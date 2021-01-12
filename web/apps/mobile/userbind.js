
/* 用户绑定页 */
CSJSV3.MUI.UserBind = function(cfg) {
	var _me = this;
	var _uiCore;
	var _userMgr;

	{
		_uiCore = $('<div class="CSJSV3MUIUserBind"><div id="topsplitline" style="height:60px;">&nbsp;</div><div style="text-align:center;"><img src="res/img/bduser.png" style="height:50px;" /></div><div style="height:60px;">&nbsp;</div><div class="FieldRow InputRow">账号：<input type="text" name="un" style="width:200px;" /></div><div class="SplitRow">&#8203;</div><div style="height:30px;">&nbsp;</div><div class="FieldRow InputRow">密码：<input type="password" name="pwd" style="width:200px;" /></div><div class="SplitRow">&#8203;</div><div style="height:50px;">&nbsp;</div><div class="FieldRow"><input class="Btn" type="button" value="绑定" style="width:200px;" /></div></div>');
		cfg.uiCore = _uiCore;
		/* 继承父级 */
		this.super0(this, new CSJSV3.MUI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		
		_userMgr = new CSJSV3.MUI.QYWXUserMgr({
			appid:'ww12230cf33c3d8ed1', 
			secret:'iZpqGs50P0MRTSVNQ3zxeZ53bPfZTYiDMtUqsFNhlBw'
		});
		_userMgr.init(world);
		if(world.com().isQYWeiXin()) {
			_userMgr.ready(function(self){
				//alert('ready ok');
				world.setLoading(false);
			});
		}
		
		_uiCore.find('.Btn').click(function() {
			var un = _uiCore.find('input[name=un]').val();
			var pwd = _uiCore.find('input[name=pwd]').val();
			if(un == '' || pwd == '') {
				_me.world().showErrorMsg('账号和密码不能为空');
			}
			else {
				_me.world().setLoading(true);
				_userMgr.bindUser(un, pwd, function(r) {
					_me.world().setLoading(false);
					if(r.success == false) {
						_me.world().showErrorMsg(r.msg);
					}
					else {
						_uiCore.find('input[name=un]').val('');
						_uiCore.find('input[name=pwd]').val('');
						_me.world().setLoading('登出中');
						_userMgr.logout(function(r) {
							_me.world().setLoading(false);
							var success = true;
							if(r.success==false){
								if(r.code == 'nologin') {
									
								}
								else {
									success = false;
									_world.showErrorMsg(r.msg);
								}
							}
							else {
							}
							
							if(success) {
								_me.world().showInfoMsg('绑定完毕', function() {
									//返回原来页面
									var preurl = _me.com().queryString('preurl');
									if(preurl != '') {
										location.href = decodeURIComponent(preurl);
									}
								});
							}
						});
					}
				});
			}
		});
	};
	
	this.resize = function() {
		$('#topsplitline').height(($(window).height() - 300) / 2);
	};
};
CSJSV3.MUI.UserBind.prototype = new CSJSV3.SuperHelper();