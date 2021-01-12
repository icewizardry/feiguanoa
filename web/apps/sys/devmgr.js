CSJSV3.AUI.DataAgent = function(cfg) {
	var _me = this;
	var _reqSvrUrl = '../../api/def';

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

	this.clearCloudRes = function(pars, callback) {
		_me.com().reqByCmd('sys_clearcloudres', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.clearCache = function(pars, callback) {
		_me.com().reqByCmd('clearcache', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, '../../api/sys');
	};
};
CSJSV3.AUI.DataAgent.prototype = new CSJSV3.SuperHelper();

CSJSV3.AUI.SysMgr = function(cfg) {
	var _me = this;
	var _da;

	{
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.Tree(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		_da = new CSJSV3.AUI.DataAgent({});
		_da.init(world);
	};
	
	this.clearCloudRes = function() {
		_da.clearCloudRes({}, function(r) {
			if(r.success == false) {
				_me.world().showErrorMsg(r.msg);
			}
			else {
				_me.world().showInfoMsg('清理完毕(' + JSON.stringify(r.data) + ')');
			}
		});
	};
	
	this.clearCache = function() {
		_da.clearCache({}, function(r) {
			if(r.success == false) {
				_me.world().showErrorMsg(r.msg);
			}
			else {
				_me.world().showInfoMsg('清理完毕');
			}
		});
	};
	
	this.clearCloudResWithNewWin = function() {
		window.open('../../api/def?cmd=sys_clearcloudres');
	};
	
	this.bakDB = function() {
		_me.world().setLoading(true);
		_me.com().reqByCmd('bakdb', {}, function(r) {
		_me.world().setLoading(false);
			if(r.success == false) {
				_me.world().showErrorMsg(r.msg);
			}
			else {
				_me.world().showInfoMsg('备份完毕');
			}
		}, '../../api/sys');
	};
};
CSJSV3.AUI.SysMgr.prototype = new CSJSV3.SuperHelper();