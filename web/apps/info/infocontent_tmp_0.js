

CSJSV3.AUI.CurrentListMgrView = function(cfg) {
	var _me = this;
	var _uiCore;
	var _dataAgent;
	var _data;

	{
		_uiCore = $('<div class="InfoArea"><div class="HeadArea">上海市废弃物管理处信息报送平台</div><div style="height:30px;">&nbsp;</div><div class="TitleArea"></div><div class="Title1Area"></div><div style="height:10px;">&nbsp;</div><div class="StateArea" style="display: none;"></div><div style="height:20px;">&nbsp;</div><div class="ImgArea" style="display:none;margin-bottom:20px;"></div><div class="ContentArea"></div><div style="height:20px;">&nbsp;</div><div class="UploadFilesArea"></div></div>');
		cfg.uiCore = _uiCore;
		/* 继承父级 */
		this.super0(this, new CSJSV3.UI.BaseObject(cfg));
	}

	this.init = function(world) {
		/* 继承父级 */
		_me.base.init(world);
		_dataAgent = new CSJSV3.AUI.DataAgent({});
		_dataAgent.init(world);
	};

	this.render = function() {
		_me.base.render();
		if(_data != null) {
			_uiCore.find('.TitleArea').html(_data.title);
			document.title = _data.title;
			if(_data.title1 == '') {
				_uiCore.find('.Title1Area').hide();
			}
			else {
				_uiCore.find('.Title1Area').html(_data.title1);
			}
			_uiCore.find('.StateArea').html('<div style="float:left;">' + _me.com().toDateTimeStr(_data.crttime, true) + '&emsp;&emsp;&emsp;科室：' + _data.cuserbm + (_data.channel != null && _data.channel != '' ? '&emsp;&emsp;&emsp;录用：' + _data.channel.replace(/,/g, '、') : '') + '</div><div style="float:right;width:310px;">发布人：' + _data.cusername + '&emsp;&emsp;&emsp;作者：' + _data.author + '</div><div style="clear:both;"></div>');
			_uiCore.find('.ContentArea').html(_data.content);
			
			var findImgTagArr = [];
			//自动调整图片宽度，准备转移图片
			_uiCore.find('.ContentArea').find('img').each(function(i,n) {
				$(n).css('max-width', _uiCore.find('.ContentArea').width() + 'px');
				if($(n).attr('onclick') == null || $(n).attr('onclick') == '') {
					$(n).attr('onclick', 'window.open(this.src)');
				}
				
				if($(n).attr('src').indexOf('file://') != -1) {
					$(n).remove();
				}
				else {
					findImgTagArr.push(n);
				}
			});
			
			// 转移图片到图片栏
			for(var i=0; i<findImgTagArr.length; i++) {
				if(i==0) {
					_uiCore.find('.ImgArea').show();
				}
				_uiCore.find('.ImgArea').append($(findImgTagArr[i]));
			}
			
			// 转移附件
			var findATagArr = [];
			_uiCore.find('.ContentArea').find('a').each(function(i,n) {
				if(n.href != null && n.href != '') {
					findATagArr.push(n);
				}
			});
			
			for(var i=0;i<findATagArr.length;i++) {
				var n = findATagArr[i];
				if(i == 0) {
					var area = $('<fieldset class="UploadFiles"><legend>附件</legend><div class="BodyArea" style=""></div></fieldset>');
					_uiCore.find('.UploadFilesArea').append(area);
				}
				$(n).remove();
				var item = $('<div style="line-height:30px;"></div>');
				item.append(n);
				_uiCore.find('.UploadFilesArea .BodyArea').append(item);
			}
			
			// 罗列阅读人并展示阅读情况
			if(_data.needreadusers != null && _data.needreadusers != '') {
				var area = $('<fieldset class="NoreadUsers" style="display: none;"><legend>阅读人</legend><div class="BodyArea" style="display:none;"></div><div class="Label" style="text-align:center;"></div></fieldset>');
				_uiCore.append(area);
				var body = area.find('.BodyArea');
				var label = area.find('.Label');
				
				var hasReadCount = 0;
				var needreadusers = [];
				if(_data.needreadusers != '') {
					needreadusers = JSON.parse(_data.needreadusers);
				}
				var hasreadusers = [];
				if(_data.hasreadusers != '') {
					hasreadusers = JSON.parse(_data.hasreadusers);
				}
				for(var i=0;i<needreadusers.length;i++) {
					var cell = $('<div class="NoreadUser"></div>');
					cell.html(needreadusers[i].title);
					body.append(cell);
					
					for(var r=0;r<hasreadusers.length;r++) {
						if(hasreadusers[r].id == needreadusers[i].id) {
							cell.addClass('HasreadUser');
							hasReadCount++;
							break;
						}
					}
				}
				body.append('<div style="clear:both;"></div>');
				
				label.append('<a href="javascript:;">当前阅读情况' + hasReadCount + '/' + needreadusers.length + '，点击查看详细</a>');
				label.find('a').click(function(){ body.show(); label.hide(); });
			}
			
			_uiCore.append('<div style="height:20px;">&nbsp;</div>');
		}
		_me.resize();
	};
	
	this.resize = function() {
		_me.base.resize();
	};
	
	this.loadData = function() {
		_me.world().setLoading('加载中，请稍候');
		_dataAgent.loadForm({updType:'edit',id:_me.com().queryString('infid')}, function(r) {
			_me.world().setLoading(false);
			if(r.success == false) {
				_me.world().showErrorMsg(r.msg);
			}
			else {
				_data = r.data;
				_me.render();
			}
		});
	};
	
	this.setData = function(v) {
		if(_data == null) {
			_data = {};
		}
		for(var prop in v) {
			_data[prop] = v[prop];
		}
		_me.render();
	};
};
CSJSV3.AUI.CurrentListMgrView.prototype = new CSJSV3.SuperHelper();