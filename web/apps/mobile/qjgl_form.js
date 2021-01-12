
/* 请假管理表单页 */
CSJSV3.MUI.QJGLFormView = function(cfg) {
	var _me = this;
	var _field_sy;
	var _field_start;
	var _field_end;
	var _field_content;
	var _field_cancelreason;
	var _saveBtn;
	var _submitBtn;
	var _cancelBtn;
	var _shenpiTGBtn;
	var _shenpiCHBtn;
	
	var _lxqjmgr;
	// 是否要进行了连续申请验证
	var _needLXCheck = false;
	// 是否已经进行了连续申请验证
	var _hasLXCheck = false;

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
			//$('<div class="SplitRow" style="height:20px;">&nbsp;</div>'),
			_field_sy = $('<div class="InputFieldRow"><span class="FieldLabel">事由&emsp;&emsp;&emsp;</span><select name="reason"></select><span class="Tag1" style="margin-left:20px;"></span></div>'),
			//$('<div class="SplitRow" style="height:20px;">&nbsp;</div>'),
			_field_start = $('<div class="InputFieldRow" style="border-bottom:0px;"><span class="FieldLabel">开始时间&emsp;</span></div>'),
			_field_end = $('<div class="InputFieldRow"><span class="FieldLabel">结束时间&emsp;</span></div>'),
			$('<div class="SplitRow" style="height:6px;">&nbsp;</div>'),
			$('<div class="InputFieldRow"><span class="FieldLabel">申请人&emsp;&emsp;</span><input type="text" name="username" readonly="readonly" /></div>'),
			$('<div class="InputFieldRow"><span class="FieldLabel">科室&emsp;&emsp;&emsp;</span><input type="text" name="bmtitle" readonly="readonly" /></div>'),
			$('<div class="SplitRow" style="height:6px;">&nbsp;</div>'),
			_field_content = $('<div class="InputFieldRow"><span class="FieldLabel" style="">请假说明&emsp;</span><span class="Tag2" style="color:red;"></span><div style="height:10px;">&nbsp;</div><div class="FieldBody"></div></div>'),
			$('<div class="SplitRow" style="height:6px;">&nbsp;</div>'),
			_field_cancelreason = $('<div class="InputFieldRow CancelReasonRow"><span class="FieldLabel">撤回理由&emsp;</span><div style="height:10px;">&nbsp;</div><div class="FieldBody"><textarea name="cancelnote" style="height:80px;margin:auto;border:0px;background-image:none;box-shadow:none;display:block;outline:none;"></textarea></div></div>'),
			$('<div class="SplitRow CancelReasonRow" style="height:20px;">&nbsp;</div>'),
			$('<div class="InputFieldRow" style="text-align:center;"><input type="button" class="SaveBtn" value="保存" style="margin-right:25px;background-color:#B67759;" /><input type="button" class="SubmitBtn" value="提交" style="margin-right:25px;background-color:#B67759" /><input type="button" class="ShenpiTGBtn" value="通过" style="margin-right:25px;background-color:#B67759;display:none;" /><input type="button" class="ShenpiCHBtn" value="退回" style="margin-right:25px;background-color:#B67759;display:none;" /><input type="button" class="CancelBtn" value="返回" /></div>')
		];
		/* 继承父级 */
		this.super0(this, new CSJSV3.MUI.FormView(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		
		_lxqjmgr = new CSJSV3.AUI.LXQJMgr({width:300});
		_lxqjmgr.init(world);
	};
	
	this.render = function() {
		_me.base.render();
		
		_saveBtn = _me.getUICore().find('.SaveBtn');
		_submitBtn = _me.getUICore().find('.SubmitBtn');
		_shenpiTGBtn = _me.getUICore().find('.ShenpiTGBtn');
		_shenpiCHBtn = _me.getUICore().find('.ShenpiCHBtn');
		_cancelBtn = _me.getUICore().find('.CancelBtn');
		
		_field_sy.change(function(){_onDateTimeChange();});
		
		_field_start[0].plugin = new CSJSV3.UI.DateTimePickerA({ name: 'starttime', useSelfDateType:true, dateStyle: 'width:120px;', onChange:function(){_onDateTimeChange();} });
		_field_start[0].plugin.init(_me.world());
		_field_start[0].plugin.getUICore().css('display', 'inline');
		_field_start.append(_field_start[0].plugin.getUICore());
		
		_field_end[0].plugin = new CSJSV3.UI.DateTimePickerA({ name: 'endtime', useSelfDateType:true, dateStyle: 'width:120px;', onChange:function(){_onDateTimeChange();} });
		_field_end[0].plugin.init(_me.world());
		_field_end[0].plugin.getUICore().css('display', 'inline');
		_field_end.append(_field_end[0].plugin.getUICore());
		
		_field_content[0].plugin = new CSJSV3.UI.EditorA({ name: 'content', style: 'height:230px;' });
		_field_content[0].plugin.init(_me.world());
		_field_content[0].plugin.getUICore().find('iframe').css('border-left', '0px');
		_field_content[0].plugin.getUICore().find('iframe').css('border-right', '0px');
		_field_content[0].plugin.getUICore().find('iframe').css('border-bottom', '0px');
		_field_content.find('.FieldBody').append(_field_content[0].plugin.getUICore());
		
		_me.reqByCmd('listshiyou', {}, function(r) {
			if(r.success == false) {
				_me.world().showErrorMsg(r.msg);
			}
			else {
				var select = _me.getUICore().find('[name=reason]');
				for(var i=0;i<r.data.length;i++) {
					var option = $('<option>' + r.data[i] + '</option>');
					select.append(option);
				}
				
				_me.ready();
			}
		}, '~/api/qingjiadan');
	};
	
	this.resize = function() {
		_field_content[0].plugin.getUICore().find('iframe').width($(window).width());
		_field_content[0].plugin.getUICore().height($(window).height() - 405);
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
			_shenpiCHBtn.show();
			
			//_field_sy.find('select').attr('disabled', true);
			//_field_start[0].plugin.disabled(true);
			//_field_end[0].plugin.disabled(true);
			//_field_content[0].plugin.readonly(true);
			
			_shenpiTGBtn.click(function() {
				_me.world().confirm('确定通过？', function(r){
					if(r == 'yes') {
						_me.world().setLoading(true);
						_me.reqByCmd('shenpitg', {id:_me.getUICore().find('[name=id]').val()}, function(r) {
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
						}, '~/api/qingjiadan');
					}
				});
			});
			_shenpiCHBtn.click(function() {
				_me.world().confirm('确定退回？', function(r){
					if(r == 'yes') {
						_me.world().setLoading(true);
						var cancelnote = _me.getUICore().find('[name=cancelnote]').val();
						if($.trim(cancelnote) == '') {
							_me.world().showErrorMsg('撤回理由不能为空');
						}
						else {
							_me.reqByCmd('shenpich', {id:_me.getUICore().find('[name=id]').val(),cancelnote:cancelnote}, function(r) {
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
							}, '~/api/qingjiadan');
						}
					}
				});
			});
		}
		else {
			_saveBtn.show();
			_submitBtn.show();
			_shenpiTGBtn.hide();
			_shenpiCHBtn.hide();
			
			_me.getUICore().find('.CancelReasonRow').hide();
			
			_saveBtn.click(function(){
				_me.getUICore().find('[name=state]').val('101');
				_submit();
			});
			_submitBtn.click(function(){
				var updType = _me.findFieldByName('updType').value();
				var oldFlow = _me.findFieldByName('state').value();
				if(_me.findFieldByName('updType').value() == 'new') {
					_needLXCheck = true;
				}
				else {
					if(_hasLXCheck == false && oldFlow == '101') {
						_needLXCheck = true;
					}
				}
				//连续请假检查
				if(_needLXCheck && !_hasLXCheck) {
					//进行连续申请验证
					var start = _me.findFieldByName('starttime').value();
					var end = _me.findFieldByName('endtime').value();
					_lxqjmgr.check(_me.findFieldByName('id').value(), _me.findFieldByName('reason').value(), _me.findFieldByName('userid').value(), _me.findFieldByName('username').value(), start, end, function(self, r, decide) {
						_hasLXCheck = true;
						if(r.data.needhb) {
							_needLXCheck = false;
							// 修改时间
							_me.findFieldByName('starttime').value(r.data.hbstart);
							_me.findFieldByName('endtime').value(r.data.hbend);
							_onDateTimeChange();
							
							if(decide == 'y') {
	            				_submitBtn.click();
								//alert('用户确定合并');
							}
							else if(decide == 'n') {
								_field_start.find('input,select').attr('disabled', true);
								//_me.findFieldByName('starttime').readonly(true);
								_field_end.find('input,select').attr('disabled', true);
								//_me.findFieldByName('endtime').readonly(true);
								_field_sy.find('select').attr('disabled', true);
								//_me.findFieldByName('reason').readonly(true);
								//alert('用户取消合并');
							}
						}
						else {
							_needLXCheck = false;
	            			_submitBtn.click();
							//alert('不需要合并');
						}
					});
				}
				else {
					_me.getUICore().find('[name=state]').val('0');
					_submit();
				}
			});
		}
		_cancelBtn.click(function(){
			history.back();
		});
		
		_me.loadData(function() {_onDateTimeChange();});
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
				
				if(callback != null) {
					callback();
				}
			}
		}, '~/api/qingjiadan');
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
		}, '~/api/qingjiadan');
	}
	
	function _onDateTimeChange() {
		//debugger;
		//零星假控制
		var isLXJ = false;//是否为零星假
		var lxjTipStr = '';
		if(_me.getUICore().find('[name=reason]').val() == '零星假') {
			isLXJ = true;
			_field_end[0].plugin.readonly(true);
			lxjTipStr = '<span style="color:red;font-size:12px;vertical-align:middle;">（零星假时间为上午9:00-11:00，下午15:00-17:00）</span>';
			_field_end[0].plugin.value(_field_start[0].plugin.value().split(' ')[0] + ' ' + _field_start[0].plugin.value().split(' ')[1]);
		}
		else {
			_field_end[0].plugin.readonly(false);
		}
		//
		var shenhe1maxdays = _me.getUICore().find('[name=shenhe1maxdays]').val();
		var shenhe2maxdays = _me.getUICore().find('[name=shenhe2maxdays]').val();
		var starttime = _me.com().toDateTimeStr(_field_start[0].plugin.value());
		var endtime = _me.com().toDateTimeStr(_field_end[0].plugin.value());
		var days = 0;var labelDays = '';
		var shenhecount = 0;var labelShenhecount = '';
		
		if(starttime != '' && endtime != '') {
			days = _calQingJiaDays(starttime, endtime);
		}
		
		shenhecount = _callShenHeCount(days, shenhe1maxdays, shenhe2maxdays);
		
		if(isNaN(days)) {
			labelDays = '<span style="color:red;"> ? </span>';
		}
		else if(days <= 0) {
			labelDays = '<span style="color:red;"> ' + days + ' </span>';
		}
		else {
			labelDays = ' ' + days + ' ';
		}
		
		labelShenhecount = ' ' + shenhecount + ' ';
		
		
		_me.getUICore().find('.Tag1').html('共' + labelDays + '天，需' + labelShenhecount + '审');
		_me.getUICore().find('.Tag2').html(lxjTipStr);
		if(isNaN(days) || days <= 0) { days = ''; }
		_me.getUICore().find('[name=days]').val(days);
		_me.getUICore().find('[name=shenhecount]').val(shenhecount);
	}
	
	function _calQingJiaDays(start, end) {
		var days = 0;
		var startAmOrPm = '';
		var endAmOrPm = '';
		var startDate = new Date(start.split(' ')[0]);
		var endDate = new Date(end.split(' ')[0]);
		if(start.indexOf('00:00:00') != -1) { startAmOrPm = 'am'; }
		else { startAmOrPm = 'pm'; }
		if(end.indexOf('00:00:00') != -1) { endAmOrPm = 'am'; }
		else { endAmOrPm = 'pm'; }
		//debugger;
		days = (endDate - startDate) / 1000 / 60 / 60 / 24;
		if(startAmOrPm == 'am' && endAmOrPm == 'am') {
			days += 0.5;
		}
		else if(startAmOrPm == 'pm' && endAmOrPm == 'pm') {
			days += 0.5;
		}
		else if(startDate.toString() == endDate.toString() && startAmOrPm == 'pm' && endAmOrPm == 'am') {
			days = NaN;
		}
		else if(startAmOrPm == 'pm' && endAmOrPm == 'am') {
		}
		else {
			days += 1;
		}
		return days;
	}
	
	function _callShenHeCount(days, shenhe1maxdays, shenhe2maxdays) {
		if(days <= shenhe1maxdays) {
			return 1;
		}
		else if(days <= shenhe2maxdays) {
			return 2;
		}
		return 3;
	}
};
CSJSV3.MUI.QJGLFormView.prototype = new CSJSV3.SuperHelper();


