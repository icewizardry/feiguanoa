CSJSV3.AUI.DataAgent = function(cfg) {
	var _me = this;
	var _reqSvrUrl = '../../api/info';

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

	this.loadForm = function(pars, callback) {
		_me.com().reqByCmd('loadforread', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};
};
CSJSV3.AUI.DataAgent.prototype = new CSJSV3.SuperHelper();
