

CSJSV3.AUI.PasswordChangeWin = function(cfg) {
	var _me = this;
	var _submitForm;

	{
		cfg.closeBtnType = 'hide';
		cfg.title = '修改密码';
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.Win(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		
		var cfg = {};
		cfg.updTypeFieldName = 'updType';
        cfg.hiddenFields = [
        ];
        cfg.fieldLabelStyle = 'width:70px;';
        cfg.rows = [
            {
                fields: [
                    { label: '原密码', type: 'password', name: 'oldpwd', value: '', canEmpty: false, canEmptyFor: '', style: '' }
                ]
            },
            {
                fields: [
                    { label: '新密码', type: 'password', name: 'newpwd', value: '', canEmpty: false, canEmptyFor: '', style: '' }
                ]
            }
        ];

        cfg.onSubmit = function (self) {
            _me.world().setLoading(true);
            _me.com().reqByCmd('changepwd', self.data(), function(r) {
            	_me.world().setLoading(false);
            	if(r.success == false) {
            		_me.world().showErrorMsg(r.msg);
            	}
            	else {
            		_me.world().showInfoMsg('修改完毕');
            		_me.hide();
            		_submitForm.reset();
            	}
            }, '../api/user')
        };
        cfg.onCancel = function (self) {
            _me.hide();
        };
		
		_submitForm = new CSJSV3.UI.SubmitForm(cfg);
		_submitForm.init(world);
		_submitForm.render();
		_me.body(_submitForm.getUICore());
	};

	this.render = function() {
		_me.base.render();
	};
};
CSJSV3.AUI.PasswordChangeWin.prototype = new CSJSV3.SuperHelper();


CSJSV3.AUI.MessageFloatPanel = function(cfg) {
	var _me = this;
	var _hideDelay;
	var _init = false;

	{
		cfg.uiCore = $('<div class="MessageFloatPanel"><div class="Point1">&nbsp;</div><div class="ListArea"></div></div>');
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
	};

	this.render = function() {
		_me.base.render();
	};
	
	this.show = function(tgt) {
		if(!_init) {
			_init = true;
			
			_me.getUICore().mouseleave(function() { _hideDelay = setTimeout(function(){ _me.hide(); }, 300); });
			_me.getUICore().mouseenter(function() { clearTimeout(_hideDelay); });
			
			tgt.mouseleave(function() { _hideDelay = setTimeout(function(){ _me.hide(); }, 300); });
			tgt.mouseenter(function() { clearTimeout(_hideDelay); });
		}
		_me.getUICore().show();
		_me.getUICore().css('left', tgt.offset().left - (_me.getUICore().width() - tgt.outerWidth(true)) / 2);
		_me.getUICore().css('top', tgt.offset().top + tgt.height());
	};
	
	this.hide = function() {
		_me.getUICore().hide();
	};
	
	this.loadData = function() {
		_me.com().reqByCmd('listmyunreadmessage', {}, function(r) { 
			if(r.success == false) {} 
			else {
				var listArea = _me.getUICore().find('.ListArea');
				listArea.children().remove();
				for(var i=0;i<r.data.length;i++) {
					var listItem = $('<div class="ListItem"><div class="TitleArea">' + r.data[i].title + '</div><div style="height:3px;">&nbsp;</div><div class="BodyArea">' + r.data[i].content + '</div><div style="height:3px;">&nbsp;</div><div class="TimeArea">' + r.data[i].crttime + '</div><div style="height:10px;">&nbsp;</div></div>');
					listItem[0].datacontext = r.data[i];
					var closeBtn = $('<input type="image" class="CloseBtn" src="' + _me.world().homeUrl() + '/img/btn_close.png" />');
					closeBtn.click(function(){
						_me.setHasread($(this).parent()[0].datacontext.id);
						$(this).parent().remove(); 
					});
					listItem.mouseenter(function(){
						var closeBtn = $(this).find('.CloseBtn');
						closeBtn.show();
						closeBtn.css('top', ($(this).height() - 30) / 2 - 6);
					});
					listItem.mouseleave(function(){
						var closeBtn = $(this).find('.CloseBtn');
						closeBtn.hide();
					});
					listItem.append(closeBtn);
					listArea.append(listItem);
				}
			}
		}, '../api/sys');
	};
	
	this.setHasread = function(id) {
		_me.com().reqByCmd('sethasreadmessage', {id:id}, function(r) { 
			if(r.success == false) {} 
			else {
				
			}
		}, '../api/sys');
	};
};
CSJSV3.AUI.MessageFloatPanel.prototype = new CSJSV3.SuperHelper();
