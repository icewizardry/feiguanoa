/* 登录后首次执行指令 */
var _firstcmds = [];

function _execFirstCmds(world) {
	var queueproca = new CSJSV3.QueueProcA({ onAllDone:function(self){self.world().log('all first cmds done');} });
	queueproca.init(world);
	for(var i=0;i<_firstcmds.length;i++) {
		queueproca.push(_firstcmds[i]);
	}
	queueproca.start();
}

/*
_firstcmds.push({
	name: '疗养最后一年到期提醒',
	pars: {},
	proc: function(pars, callback) {
		csjsv3com.reqByCmd('islastyear', {date:csjsv3com.toDateStr(new Date())}, function(r) { 
			if(r.success == false) {
				// 报告执行完毕
				callback();
			} else {
				if(r.data == false) {
					_world.showSelectorA('您的休假权益即将过期请尽快报名或确认放弃权益', [{id:'sq',title:'申请',focus:true},{id:'fq',title:'放弃'},{id:'xczs',title:'下次再说'}], function(r) {
						console.log(r);
						// 报告执行完毕
						callback();
					});
				} else {
					// 报告执行完毕
					callback();
				}
			}
		 }, '../api/xiuyangluxian');
	}
});*/