CSJSV3.AUI.DataAgent = function(cfg) {
	var _me = this;
	var _reqSvrUrl = '../../api/info';
	var _reqSvrUrl_sys = '../../api/sys';

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

	this.list = function(pars, callback) {
		_me.com().reqByCmd('list', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.saveForm = function(pars, callback) {
		_me.com().reqByCmd('save', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.loadForm = function(pars, callback) {
		_me.com().reqByCmd('load', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.removeForm = function(pars, callback) {
		_me.com().reqByCmd('remove', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.destroyForm = function(pars, callback) {
		_me.com().reqByCmd('destroy', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.listHistoryChanges = function(pars, callback) {
		_me.com().reqByCmd('listhc', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl_sys);
	};

	this.listHistoryContentChanges = function(pars, callback) {
		_me.com().reqByCmd('listhcc', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl_sys);
	};

	this.setFieldChannel = function(pars, callback) {
		_me.com().reqByCmd('setfieldchannel', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.getAllChannels = function(pars, callback) {
		_me.com().reqByCmd('getallchannels', pars, function(r) {
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
