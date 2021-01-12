
/* 邮件表单页 */
CSJSV3.MUI.MailFormView = function(cfg) {
	var _me = this;
	var _field_0;
	var _field_1;
	var _field_2;
	var _field_content;
	var _saveBtn;
	var _submitBtn;
	var _cancelBtn;
	var _replyBtn;

	{
		cfg.items = [
			$('<div style="display:none;">' +
					'<input type="hidden" name="updType" value="new" />' +
					'<input type="hidden" name="id" value="" />' +
					'<input type="hidden" name="crttime" value="" />' +
					'<input type="hidden" name="fromuserid" value="" />' +
					'<input type="hidden" name="fromuser" value="" />' +
					'<input type="hidden" name="touserids" value="" />' +
					'<input type="hidden" name="ccuserids" value="" />' +
					'<input type="hidden" name="hasreaduserids" value="" />' +
					'<input type="hidden" name="readtime" value="" />' +
					'<input type="hidden" name="flow" value="" />' +
					'<input type="hidden" name="hideuserids" value="" />' +
					'<input type="hidden" name="curuserid" value="" />' +
					'<input type="hidden" name="curuser" value="" />' +
					'</div>'),
			//$('<div class="SplitRow" style="height:10px;">&nbsp;</div>'),
			_field_0 = $('<div class="InputFieldRow InputFieldRow1"><span class="FieldLabel">收信人&emsp;&emsp;</span><div class="FieldBody" style="display:flex;flex-grow:1;"></div><div style="width:16px;">&nbsp;</div></div>'),
			_field_1 = $('<div class="InputFieldRow InputFieldRow1"><span class="FieldLabel">抄送人&emsp;&emsp;</span><div class="FieldBody" style="display:flex;flex-grow:1;"></div><div style="width:16px;">&nbsp;</div></div>'),
			//$('<div class="SplitRow" style="height:10px;">&nbsp;</div>'),
			_field_2 = $('<div class="InputFieldRow InputFieldRow1"><span class="FieldLabel">主题&emsp;&emsp;&emsp;</span><input type="text" name="title" style="flex-grow:1;" /><div style="width:16px;">&nbsp;</div></div>'),
			$('<div class="SplitRow" style="height:6px;">&nbsp;</div>'),
			_field_content = $('<div class="InputFieldRow"><span class="FieldLabel" style="">内容&emsp;&emsp;&emsp;&emsp;</span><span class="Tag2" style="color:red;"></span><div style="height:10px;">&nbsp;</div><div class="FieldBody"></div></div>'),
			$('<div class="SplitRow" style="height:6px;">&nbsp;</div>'),
			$('<div class="InputFieldRow" style="text-align:center;"><input type="button" class="SaveBtn" value="保存" style="margin-right:25px;background-color:#B67759;" /><input type="button" class="SubmitBtn" value="发送" style="margin-right:25px;background-color:#B67759" /><input type="button" class="ReplyBtn" value="回复" style="margin-right:25px;background-color:#B67759;display:none;" /><input type="button" class="CancelBtn" value="返回" /></div>')
		];
		/* 继承父级 */
		this.super0(this, new CSJSV3.MUI.FormView(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		
		_field_0[0].plugin = new CSJSV3.AUI.UsersSelector1Box({
			name: 'tousers',
			inputStyle: 'width:auto;flex-grow:1;',
			onCheckDone:function(self, checkeds) {
				var str = '';
				var arr = [];
				
				if(checkeds != null && checkeds.length > 0) {
					for(var i=0;i < checkeds.length;i++) {
						if(checkeds[i].type == 'user') {
							arr.push(checkeds[i]);
						}
					}
				}
				
				if(arr != null && arr.length > 0) {
					for(var i=0;i < arr.length;i++) {
						if(i!=0) {
							str += ',';
						}
						str += arr[i].id;
					}
				}
				_me.findFieldByName('touserids').value(str);
			}
		});
		_field_0[0].plugin.init(world);
		_field_0[0].plugin.getUICore().css('display', 'flex');
		_field_0[0].plugin.getUICore().css('flex-grow', '1');
		_field_0.find('.FieldBody').append(_field_0[0].plugin.getUICore());
		
		_field_1[0].plugin = new CSJSV3.AUI.UsersSelector1Box({
			name: 'ccusers',
			inputStyle: 'width:auto;flex-grow:1;',
			onCheckDone:function(self, checkeds) {
				var str = '';
				if(checkeds != null && checkeds.length > 0) {
					for(var i=0;i < checkeds.length;i++) {
						if(i!=0) {
							str += ',';
						}
						str += checkeds[i].id;
					}
				}
				_me.findFieldByName('touserids').value(str);
			}
		});
		_field_1[0].plugin.init(world);
		_field_1[0].plugin.getUICore().css('display', 'flex');
		_field_1[0].plugin.getUICore().css('flex-grow', '1');
		_field_1.find('.FieldBody').append(_field_1[0].plugin.getUICore());
	};
	
	this.render = function() {
		_me.base.render();
		
		_saveBtn = _me.getUICore().find('.SaveBtn');
		_submitBtn = _me.getUICore().find('.SubmitBtn');
		_cancelBtn = _me.getUICore().find('.CancelBtn');
		_replyBtn = _me.getUICore().find('.ReplyBtn');
		
		_field_0.change(function(){_onDateTimeChange();});
		
		_field_content[0].plugin = new CSJSV3.UI.EditorA({ name: 'content', style: 'height:230px;' });
		_field_content[0].plugin.init(_me.world());
		_field_content[0].plugin.getUICore().find('iframe').css('border-left', '0px');
		_field_content[0].plugin.getUICore().find('iframe').css('border-right', '0px');
		_field_content[0].plugin.getUICore().find('iframe').css('border-bottom', '0px');
		_field_content.find('.FieldBody').append(_field_content[0].plugin.getUICore());
		
		
	};
	
	this.resize = function() {
		_field_content[0].plugin.getUICore().find('iframe').width($(window).width());
		_field_content[0].plugin.getUICore().height($(window).height() - 295);
	};
	
	this.ready = function() {
		if(_me.com().queryString('id') != '') {// 编辑模式
			_me.getUICore().find('[name=updType]').val('edit');
			_me.getUICore().find('[name=id]').val(_me.com().queryString('id'));
			
			_saveBtn.hide();
			_replyBtn.show();
			_replyBtn.click(function(){
				_reply();
			});
			
			_field_0[0].plugin.readonly(true);
			_field_1[0].plugin.readonly(true);
			_field_2.find('input').attr('readonly', true);
			_field_content[0].plugin.readonly(true);
		}
		else {// 新增模式
			
			_saveBtn.show();
			_saveBtn.click(function(){
				_me.getUICore().find('[name=flow]').val('101');
				_submit();
			});
			_replyBtn.hide();
		}
		
		_submitBtn.show();
		_submitBtn.click(function(){
			_me.getUICore().find('[name=flow]').val('0');
			_submit();
		});
		
		_cancelBtn.click(function(){
			history.back();
		});
		
		_me.loadData(function() {
			if(_me.findFieldByName('flow').value() == '101') {
				_saveBtn.show();
				_submitBtn.show();
				_replyBtn.hide();
			}
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
		_me.reqByCmd('loadform', pars, function(r) {
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
				
				if(callback != null) {
					callback();
				}
			}
		}, '~/api/inmail');
	};
	
	function _submit() {
		_me.world().setLoading(true);
		_me.reqByCmd('saveform', _me.getData(), function(r) {
			_me.world().setLoading(false);
			if(r.success == false) {
				_me.world().showErrorMsg(r.msg);
			}
			else {
				history.back();
			}
		}, '~/api/inmail');
	}
	
	function _reply() {
		_submitBtn.show();
		_replyBtn.hide();
		
		_field_0[0].plugin.readonly(false);
		_field_1[0].plugin.readonly(false);
		_field_2.find('input').attr('readonly', false);
		_field_content[0].plugin.readonly(false);
		
		_me.findFieldByName('id').value('');
		_me.findFieldByName('updType').value('new');
		
		var curuserid = _me.findFieldByName('curuserid').value();
		var curuser = _me.findFieldByName('curuser').value();
		var fromuseridField = _me.findFieldByName('fromuserid');
		var fromuserField = _me.findFieldByName('fromuser');
		//设置回复时的主题和内容
		_me.findFieldByName('hideuserids').value('');
		var str = '';
		str += '<div><br/></div>';
		str += '<div><br/></div>';
		str += '<div>------------------ 原始邮件 ------------------</div>';
		str += '<div style="background-color:#EFEFEF;padding-left:8px;">';
		str += '<div>发件人：' + fromuserField.value() + '</div>';
		str += '<div>发送时间：' + _me.findFieldByName('crttime').value() + '</div>';
		str += '<div>收件人：' + _field_0[0].plugin.text() + '</div>';
		str += '<div>主题：' + _me.findFieldByName('title').value() + '</div>';
		str += '</div>';
		str += '<div style="height:20px;">&nbsp;</div>';
		_field_content[0].plugin.value(str + _field_content[0].plugin.value() + "<div></div>");
		//设置主题
		var titleField = _me.findFieldByName('title');
		titleField.value("回复: " + titleField.value().replace('回复: ', ''));
		
		var touseridsField = _me.getUICore().find('[name=touserids]');
		//添加原发信人到收信人
		var arr = JSON.parse(_field_0[0].plugin.value());
		if(touseridsField.val().indexOf(fromuseridField.val()) == -1) {
			arr.push({id:fromuseridField.val(),title:fromuserField.val()});
			_field_0[0].plugin.value(JSON.stringify(arr));
		}
		
		//从收信人删除自己
		for(var i=0;i < arr.length;i++) {
			if(arr[i].id == curuserid) {
				arr.splice(i, 1);
				break;
			}
		}
		var str = '';
		for(var i=0;i < arr.length;i++) {
			if(i!=0) {
				str += ',';
			}
			str += arr[i].id;
		}
		touseridsField.val(str);
		_field_0[0].plugin.value(JSON.stringify(arr));
		
		fromuseridField.value(curuserid);
		fromuserField.value(curuser);
		
	}
};
CSJSV3.MUI.MailFormView.prototype = new CSJSV3.SuperHelper();


