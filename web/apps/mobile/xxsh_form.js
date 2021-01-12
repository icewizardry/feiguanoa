
/* 信息审核页 */
CSJSV3.MUI.XXSHFormView = function(cfg) {
	var _me = this;
	var _field_start;
	var _field_end;
	var _field_content;
	var _field_cancelreason;
	var _saveBtn;
	var _submitBtn;
	var _cancelBtn;
	var _shenpiTGBtn;
	var _shenpiKFBtn;
	var _shenpiCHBtn;

	{
		cfg.items = [
			$('<div style="display:none;">' +
					'<input type="hidden" name="updType" value="new" />' +
					'<input type="hidden" name="id" value="" />' +
					'<input type="hidden" name="crttime" value="" />' +
					'<input type="hidden" name="days" value="" />' +
					'<input type="hidden" name="shenhecount" value="" />' +
					'<input type="hidden" name="state" value="" />' +
					'<input type="hidden" name="shenpi1userid" value="" />' +
					'<input type="hidden" name="shenpi1username" value="" />' +
					'<input type="hidden" name="shenpi1state" value="" />' +
					'<input type="hidden" name="shenpi1doneuserid" value="" />' +
					'<input type="hidden" name="shenpi1doneusername" value="" />' +
					'<input type="hidden" name="shenpi1time" value="" />' +
					'<input type="hidden" name="shenpi2userid" value="" />' +
					'<input type="hidden" name="shenpi2username" value="" />' +
					'<input type="hidden" name="shenpi2state" value="" />' +
					'<input type="hidden" name="shenpi2doneuserid" value="" />' +
					'<input type="hidden" name="shenpi2doneusername" value="" />' +
					'<input type="hidden" name="shenpi2time" value="" />' +
					'<input type="hidden" name="shenpi3userid" value="" />' +
					'<input type="hidden" name="shenpi3username" value="" />' +
					'<input type="hidden" name="shenpi3state" value="" />' +
					'<input type="hidden" name="shenpi3doneuserid" value="" />' +
					'<input type="hidden" name="shenpi3doneusername" value="" />' +
					'<input type="hidden" name="shenpi3time" value="" />' +
					'<input type="hidden" name="crtuserid" value="" />' +
					'<input type="hidden" name="crtusername" value="" />' +
					'<input type="hidden" name="shenhe1maxdays" value="" />' +
					'<input type="hidden" name="shenhe2maxdays" value="" />' +
					'<input type="hidden" name="userid" value="" />' +
					'<input type="hidden" name="bmid" value="" />' +
					'</div>'),
			$('<div class="SplitRow" style="height:20px;">&nbsp;</div>'),
			$('<div class="InputFieldRow"><span class="FieldLabel">标题&emsp;&emsp;&emsp;</span><input type="text" name="title" style="width:230px;" /></div>'),
			$('<div class="InputFieldRow"><span class="FieldLabel">副标题&emsp;&emsp;</span><input type="text" name="title1" style="width:230px;" /></div>'),
			$('<div class="SplitRow" style="height:20px;">&nbsp;</div>'),
			$('<div class="InputFieldRow"><span class="FieldLabel">作者&emsp;&emsp;&emsp;</span><input type="text" name="author" style="width:60px;" /><span class="FieldLabel">发布时间&emsp;</span><input type="text" name="crttime" style="width:100px;" /></div>'),
			$('<div class="InputFieldRow"><span class="FieldLabel">类目&emsp;&emsp;&emsp;</span><input type="text" name="ctgtitles" readonly="readonly" style="width:60px;" /><span class="FieldLabel">&emsp;&emsp;性质&emsp;</span><select name="xingzhi"><option value="0">行政工作</option><option value="1">团队工作</option></select></div>'),
			$('<div class="SplitRow" style="height:20px;">&nbsp;</div>'),
			_field_content = $('<div class="InputFieldRow"><span class="FieldLabel" style="">内容&emsp;&emsp;&emsp;</span><span class="Tag2" style="color:red;"></span><div style="height:10px;">&nbsp;</div><div class="FieldBody"></div></div>'),
			$('<div class="SplitRow" style="height:20px;">&nbsp;</div>'),
			_field_cancelreason = $('<div class="InputFieldRow CancelReasonRow"><span class="FieldLabel">留言&emsp;&emsp;&emsp;</span><div style="height:10px;">&nbsp;</div><div class="FieldBody"><textarea name="message" style="height:80px;margin:auto;border:0px;background-image:none;box-shadow:none;display:block;outline:none;"></textarea></div></div>'),
			$('<div class="SplitRow CancelReasonRow" style="height:20px;">&nbsp;</div>'),
			$('<div class="InputFieldRow" style="text-align:center;"><input type="button" class="SaveBtn" value="保存" style="margin-right:25px;background-color:#B67759;" /><input type="button" class="SubmitBtn" value="提交" style="margin-right:25px;background-color:#B67759" /><input type="button" class="ShenpiTGBtn" value="通过" style="margin-right:25px;background-color:#B67759;display:none;" /><input type="button" class="ShenpiKFBtn" value="可发" style="margin-right:25px;background-color:#B67759;display:none;" /><input type="button" class="ShenpiCHBtn" value="退回" style="margin-right:25px;background-color:#B67759;display:none;" /><input type="button" class="CancelBtn" value="返回" /></div>')
		];
		/* 继承父级 */
		this.super0(this, new CSJSV3.MUI.View(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
	};
	
	this.render = function() {
		_me.base.render();
		
		_saveBtn = _me.getUICore().find('.SaveBtn');
		_submitBtn = _me.getUICore().find('.SubmitBtn');
		_shenpiTGBtn = _me.getUICore().find('.ShenpiTGBtn');
		_shenpiKFBtn = _me.getUICore().find('.ShenpiKFBtn');
		_shenpiCHBtn = _me.getUICore().find('.ShenpiCHBtn');
		_cancelBtn = _me.getUICore().find('.CancelBtn');
		
		_field_content[0].plugin = new CSJSV3.UI.EditorA({ name: 'content', style: 'height:230px;' });
		_field_content[0].plugin.init(_me.world());
		_field_content[0].plugin.getUICore().find('iframe').css('border-left', '0px');
		_field_content[0].plugin.getUICore().find('iframe').css('border-right', '0px');
		_field_content[0].plugin.getUICore().find('iframe').css('border-bottom', '0px');
		_field_content.find('.FieldBody').append(_field_content[0].plugin.getUICore());
		
		_me.ready();
	};
	
	this.resize = function() {
		_field_content[0].plugin.getUICore().find('iframe').width($(window).width());
		_field_cancelreason.find('textarea').width($(window).width() - 30);
	};
	
	this.ready = function() {
		if(_me.com().queryString('id') != '') {
			_me.getUICore().find('[name=updType]').val('edit');
			_me.getUICore().find('[name=id]').val(_me.com().queryString('id'));
		}
		
		if(_me.com().queryString('adt') == '1') {
			_saveBtn.hide();
			_submitBtn.hide();
			_shenpiTGBtn.show();
			_shenpiKFBtn.show();
			_shenpiCHBtn.show();
			
			
			_me.getUICore().find('input[type=text],select').each(function(i,n) {
				$(n).attr('disabled', true);
			});
			_field_content[0].plugin.readonly(true);
			
			_shenpiTGBtn.click(function() {
				_me.world().confirm('确定通过？', function(r){
					if(r == 'yes') {
						_me.world().setLoading(true);
						var message = _me.getUICore().find('[name=message]').val();
						_me.reqByCmd('shenpi', {id:_me.getUICore().find('[name=id]').val(),flow:'tg',message:message}, function(r) {
							_me.world().setLoading(false);
							if(r.success == false) {
								_me.world().showErrorMsg(r.msg);
							}
							else {
								_me.world().setLoading(false);
								if(r.success == false) {
									_me.world().showErrorMsg(r.msg);
								}
								else {
									history.back();
								}
							}
						}, '~/api/info');
					}
				});
			});
			_shenpiKFBtn.click(function() {
				_me.world().confirm('确定可发？', function(r){
					if(r == 'yes') {
						_me.world().setLoading(true);
						var message = _me.getUICore().find('[name=message]').val();
						_me.reqByCmd('shenpi', {id:_me.getUICore().find('[name=id]').val(),flow:'kf',message:message}, function(r) {
							_me.world().setLoading(false);
							if(r.success == false) {
								_me.world().showErrorMsg(r.msg);
							}
							else {
								_me.world().setLoading(false);
								if(r.success == false) {
									_me.world().showErrorMsg(r.msg);
								}
								else {
									history.back();
								}
							}
						}, '~/api/info');
					}
				});
			});
			_shenpiCHBtn.click(function() {
				_me.world().confirm('确定退回？', function(r){
					if(r == 'yes') {
						_me.world().setLoading(true);
						var message = _me.getUICore().find('[name=message]').val();
						_me.reqByCmd('shenpi', {id:_me.getUICore().find('[name=id]').val(),flow:'ch',message:message}, function(r) {
							_me.world().setLoading(false);
							if(r.success == false) {
								_me.world().showErrorMsg(r.msg);
							}
							else {
								_me.world().setLoading(false);
								if(r.success == false) {
									_me.world().showErrorMsg(r.msg);
								}
								else {
									history.back();
								}
							}
						}, '~/api/info');
					}
				});
			});
		}
		else {
		}
		_cancelBtn.click(function(){
			history.back();
		});
		
		_me.loadData(function() {
			_me.world().setLoading(false);
		});
	};
	
	function _findInputFieldRowByChild(child) {
		if(child.hasClass('InputFieldRow')) {
			return child;
		}
		else if(child.parent() != null && child.parent()[0] != null) {
			return _findInputFieldRowByChild(child.parent());
		}
		return null;
	}
	
	this.getData = function(callback) {
		var pars = {};
		_me.getUICore().find('input,select,textarea').each(function(i,n) {
			if(n.name != null && n.name != '') {
				pars[n.name] = n.value;
			}
		});		return pars;
	};
	
	this.setData = function(data) {
		_me.getUICore().find('input,select,textarea').each(function(i,n) {
			if(n.name != null && n.name != '' && data[n.name] != null) {
				var node = _findInputFieldRowByChild($(n));
				if(node != null && node[0].plugin != null) {
					node[0].plugin.val(data[n.name]);
				}
				else {
					n.value = data[n.name];
				}
			}
		});
	};
	
	this.loadData = function(callback) {
		var pars = {updType:'new'};
		if(_me.com().queryString('id') != '') {
			pars = _me.getData();
		}
		_me.reqByCmd('load', pars, function(r) {
			_me.world().setLoading(false);
			if(r.success == false) {
				_me.world().showErrorMsg(r.msg);
			}
			else {
				_me.setData(r.data);
				
				if(_me.com().queryString('id') != '' && r.data.state != '101' && r.data.state != '-1') {
					_saveBtn.hide();
					_submitBtn.hide();
				}
				
				if(r.data.shenpi3users == '') {//只有3审才需要可发
					_shenpiKFBtn.hide();
				}
				if(r.data.shenpi1state != '0') {//只有一审的时候需要显示
					_shenpiKFBtn.hide();
				}
				if(r.data.shenpi1state == '0' && r.data.shenpi2users != '') {//1审的时候（不只1审）
					_shenpiTGBtn.val('复审');
				}
				if(r.data.shenpi1state == '1' && r.data.shenpi2state == '0' && r.data.shenpi3users != '') {//2审的时候（一共3审）
					_shenpiTGBtn.val('通过');
				}
				if(r.data.shenpi1state == '1' && r.data.shenpi2state == '1' && r.data.shenpi3state == '0' && r.data.shenpi3users != '') {//3审的时候（一共3审）
					_shenpiTGBtn.val('发布');
				}
				if(r.data.shenpi1state == '1' && r.data.shenpi2state == '0' && r.data.shenpi3users == '') {//2审的时候（一共2审）
					_shenpiTGBtn.val('发布');
				}
				if(r.data.shenpi1state == '0' && r.data.shenpi2users == '') {//1审的时候（一共1审）
					_shenpiTGBtn.val('发布');
				}
				
				if(callback != null) {
					callback();
				}
			}
		}, '~/api/info');
	};
	
	function _submit() {
		_me.world().setLoading(true);
		_me.reqByCmd('save', _me.getData(), function(r) {
			_me.world().setLoading(false);
			if(r.success == false) {
				_me.world().showErrorMsg(r.msg);
			}
			else {
				history.back();
			}
		}, '~/api/info');
	}
};
CSJSV3.MUI.XXSHFormView.prototype = new CSJSV3.SuperHelper();


