CSJSV3.AUI.SiteCtgDataAgent = function(cfg) {
	var _me = this;
	var _reqSvrUrl = '../../api/sitectg';

	{
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
	};

	this.listSite = function(pars, callback) {
		_me.com().reqByCmd('listsites', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.saveSiteForm = function(pars, callback) {
		_me.com().reqByCmd('savesiteform', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.loadSiteForm = function(pars, callback) {
		_me.com().reqByCmd('loadsiteform', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.removeSiteForm = function(pars, callback) {
		_me.com().reqByCmd('removesiteform', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.listCtg = function(pars, callback) {
		_me.com().reqByCmd('listctgs', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.saveCtgForm = function(pars, callback) {
		_me.com().reqByCmd('savectgform', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.loadCtgForm = function(pars, callback) {
		_me.com().reqByCmd('loadctgform', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};

	this.removeCtgForm = function(pars, callback) {
		_me.com().reqByCmd('removectgform', pars, function(r) {
			if (callback != null) {
				callback(r);
			}
		}, _reqSvrUrl);
	};
};
CSJSV3.AUI.SiteCtgDataAgent.prototype = new CSJSV3.SuperHelper();
