
if(window.csapi == null) {
	window.csapi = {};
}
csapi.listCEB = function(pars, callback) {
	_world.com().reqByCmd('listceb', pars, function(r) {
		if (callback != null) {
			callback(r);
		}
	}, '../../api/syscmd');
};

CSJSV3.AUI.SysCmdMgr = function(cfg) {
	var _me = this;

	{
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
	};
	
	this.loadData = function(callback) {
		csapi.listCEB({},function(r) {
			if(r.success == false) {
				_me.world().showErrorMsg(r.msg, callback);
			}
			else {
				var data = r.data;
				var area = $('#CEBArea').find('.BodyArea');
				area.children().remove();
				for(var i=0;i<data.length;i++) {
					var ceb = data[i];
					var item = $('<div class="CEBPanel"></div>');
					item.append('<div class="TitleRow"></div>');
					item.append('<div class="StateBar1">状态 <span class="State"></span>&emsp;允许最大并发 <span class="MaxExecCount"></span></div>');
					item.append('<div class="CountLabelRow">执行中 <span class="RunningCountLabel"></span>&emsp;单次队列 <span class="OnceQueueCountLabel"></span>&emsp;永久队列 <span class="ForeverQueueCountLabel"></span>&emsp;执行成功 <span class="ExecSuccessCountLabel"></span>&emsp;执行失败 <span class="ExecFailCountLabel"></span></div>');
					item.append('<div style="height:8px;">&nbsp;</div>');
					item.append('<div class="QueueAreaHead"><div class="Tab YXZTab" style=""></div><div class="Tab PDZTab" style=""></div><div style="clear:both;"></div></div>');
					item.append('<div class="QueueArea"><div class="RunningList" style="float:left;width:249px;">&nbsp;</div><div class="OnceForeverList" style="float:left;width:250px;">&nbsp;</div><div style="clear:both;"></div></div>');
					area.append(item);
					_buildCEBPanel(item, ceb);
				}
				
				if(callback != null) {
					callback();
				}
			}
		});
	};
	
	function _buildCEBPanel(panel, dc) {
		panel.find('.TitleRow').html(dc.name);
		panel.find('.State').html(dc.canRunning ? "运行中" : "已停止");
		panel.find('.MaxExecCount').html(dc.maxExecCount);
		panel.find('.RunningCountLabel').html(dc.runningList.length);
		panel.find('.OnceQueueCountLabel').html(dc.onceExecQueue.length);
		panel.find('.ForeverQueueCountLabel').html(dc.foreverExecQueue.length);
		panel.find('.ExecSuccessCountLabel').html(dc.memory.execsuccesscount);
		panel.find('.ExecFailCountLabel').html(dc.memory.execerrorcount);
		
		panel.find('.YXZTab').html('运行中(' + dc.runningList.length + ')');
		panel.find('.PDZTab').html('排队中(' + (dc.onceExecQueue.length + dc.foreverExecQueue.length) + ')');
		if(dc.runningList.length > 0) {
			panel.find('.RunningList').html('');
		}
		for(var i=0;i<dc.runningList.length;i++) {
			panel.find('.RunningList').append('<div class="ListItem">' + dc.runningList[i].name + '</div>');
		}
		
		if(dc.onceExecQueue.length > 0 || dc.foreverExecQueue.length > 0) {
			panel.find('.OnceForeverList').html('');
		}
		for(var i=0;i<dc.onceExecQueue.length;i++) {
			panel.find('.OnceForeverList').append('<div class="ListItem">' + dc.onceExecQueue[i].name + '(单)</div>');
		}
		for(var i=0;i<dc.foreverExecQueue.length;i++) {
			panel.find('.OnceForeverList').append('<div class="ListItem">' + dc.foreverExecQueue[i].name + '(永)</div>');
		}
		
		if(panel.find('.OnceForeverList').children().length > panel.find('.RunningList').children().length) {
			panel.find('.OnceForeverList').css('border-left', '1px solid silver');
		}
		else {
			panel.find('.RunningList').css('border-right', '1px solid silver');
		}
	}
};
CSJSV3.AUI.SysCmdMgr.prototype = new CSJSV3.SuperHelper();