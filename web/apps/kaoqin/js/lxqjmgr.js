
CSJSV3.AUI.LXQJMgr = function(cfg) {
	var _me = this;
	var _uiCore;
	var _toUpdWin;

	{
		if(cfg.width == null) cfg.width = 620;
		_uiCore = $('<div class="LXQJTipPanel"><div class="TitleRow"></div><div class="BodyRow"></div></div>');
		cfg.uiCore = _uiCore;
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		_toUpdWin = new CSJSV3.UI.Win({
			title : '连续请假提示',
			body : _me.getUICore(),
			closeBtnType : 'hide',
			width: cfg.width,
			height: 'auto'
		});
		_toUpdWin.init(world);
	};
	
	this.check = function(id, reason, sqrid, sqrtitle, start, end, callback) {
		_me.world().setLoading('检测连续请假');
		_world.com().reqByCmd('lianxuqingjia', {
			userid:sqrid,
			id:id,
			start:start,
			end:end,
			reason:reason
		}, function(r) {
			_me.world().setLoading(false);
			_uiCore.find('.BodyRow').children().remove();
			if(r.data.lxitems != null && r.data.lxitems.length > 0) {
				_uiCore.find('.BodyRow').append('<div style="text-align:center;font-weight:bold;">*** 共' + r.data.lxitems.length + '条连续请假 ***</div>');
				for(var i=0;i<r.data.lxitems.length;i++) {
					_uiCore.find('.BodyRow').append('<div style="text-align:center;">' + renderQJD(r.data.lxitems[i]) + '</div>');
				}
			}
			if(r.data.needhb) {
				_toUpdWin.show();
				_uiCore.find('.BodyRow').append('<div style="text-align:center;color:red;">' + ('*** 需要合并，请假时间改为从 ' + r.data.hbstart + ' 到 ' + r.data.hbend).replace(/00:00:00/g, '上午').replace(/12:00:00/g, '下午') + ' ***' + '</div>');
				_uiCore.find('.BodyRow').append('<div style="text-align:center;color:red;font-weight:bold;">（请假时间已被修改并锁定）</div>');
			}
			else {
				_uiCore.find('.BodyRow').append('<div style="text-align:center;">' + '*** 不需要合并 ***' + '</div>');
				if(callback != null) {
					callback(_me, r);
				}
			}
			_uiCore.find('.BodyRow').append('<div style="height:20px;">&nbsp;</div>');
			var btnRow = $('<div style="text-align:center;"><input type="button" value="继续" />&emsp;&emsp;&emsp;<input type="button" value="取消" /></div>');
			btnRow.find('input').eq(0).click(function() { 
				if(callback != null) {
					callback(_me, r, 'y');
				}
				_toUpdWin.close(); 
			});
			btnRow.find('input').eq(1).click(function() { 
				if(callback != null) {
					callback(_me, r, 'n');
				}
				_toUpdWin.close(); 
			});
			_uiCore.find('.BodyRow').append(btnRow);
			
		}, '../../api/qingjiadan');
		
	};
		
	function renderQJD(item) {
		var html = '';
		html = ('<div>' + item.reason + '\t' + item.username + '\t（' + item.starttime + ' ~ ' + item.endtime + '）</div>').replace(/00:00:00/g, '上午').replace(/12:00:00/g, '下午');
		return html;
	}
};
CSJSV3.AUI.LXQJMgr.prototype = new CSJSV3.SuperHelper();
