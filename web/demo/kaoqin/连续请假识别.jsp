<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>连续请假识别</title>
    <script src="../../js/jq/jquery-1.x.x.min.js"></script>
    <script src="../../js/jqui/js/jquery-ui-1.9.2.custom.min.js" type="text/javascript"></script>
    <link href="../../js/jqui/css/smoothness/jquery-ui-1.9.2.custom.min.css" rel="stylesheet"
          type="text/css" />
    <script src="../../js/jqui/jquery.ui.datepicker-zh-CN.js" type="text/javascript"></script>
    <script src="../../apps/?cmd=sys_101svc_getjs&tgt=CSJSV3Core.js,CSJSV3UICore.js,CSJSV3AUICore.js" type="text/javascript"></script>
    <link href="../../apps/?cmd=sys_101svc_getjs&tgt=CSJSV3UICore.css" rel="stylesheet" type="text/css" />
	<script src="../../apps/com/userselector1.js" type="text/javascript"></script>
	<script src="../../apps/kaoqin/js/lxqjmgr.js"></script>
</head>
<body>
	<div>
		<table><tr><td>事由</td><td><input id="reason" type="text" value="因公外出" /></td><td>&nbsp;</td><td>申请人</td><td id="sqr1"></td><td>&nbsp;</td><td>请假时间</td><td>从<input id="startdate" type="text" autocomplete="off" /><select id="starttime"><option value="00:00:00">上午</option><option value="12:00:00">下午</option></select>到<input id="enddate" type="text" autocomplete="off" /><select id="endtime"><option value="00:00:00">上午</option><option value="12:00:00">下午</option></select></td><td>&nbsp;</td><td><input type="button" value="开始识别" onclick="test1()" /></td></tr></table>
	</div>
	<div>
		<input type="button" value="连续请假识别面板" onclick="lxqjpanel()" />
	</div>
	<div id="div1"></div>
	<script>
		var _userSelector1Box;
		
		function lxqjpanel() {
			var reason = $('#reason').val();
			var sqrid = JSON.parse(_userSelector1Box.value())[0].id;
			var sqrtitle = JSON.parse(_userSelector1Box.value())[0].title;
			var id = '';
			var start = $('#startdate').val() + ' ' + $('#starttime').val();
			var end = $('#enddate').val() + ' ' + $('#endtime').val();
			
			var t = new CSJSV3.AUI.LXQJMgr({});
			t.init(_world);
			t.check(id, reason, sqrid, sqrtitle, start, end, function(self, r, decide) {
				if(r.data.needhb) {
					if(decide == 'y') {
						alert('用户确定合并');
					}
					else if(decide == 'n') {
						alert('用户取消合并');
					}
				}
				else {
					alert('不需要合并');
				}
			});
		}
		
		function renderQJD(item) {
			var html = '';
			html = ('<div>' + item.reason + '\t' + item.username + '\t（' + item.starttime + ' ~ ' + item.endtime + '）</div>').replace(/00:00:00/g, '上午').replace(/12:00:00/g, '下午');
			return html;
		}
		
		function test1() {
			var reason = $('#reason').val();
			if(reason == '') {
				alert('事由不能为空');
			}
			else if(_userSelector1Box.value() == '') {
				alert('请选择申请人');
			}
			else if($('#startdate').val() == '' || $('#enddate').val() == '') {
				alert('开始日期和结束日期不能为空');
			}
			else {
				var sqrid = JSON.parse(_userSelector1Box.value())[0].id;
				var sqrtitle = JSON.parse(_userSelector1Box.value())[0].title;
				var start = $('#startdate').val() + ' ' + $('#starttime').val();
				var end = $('#enddate').val() + ' ' + $('#endtime').val();
				_world.com().reqByCmd('lianxuqingjia', {
					userid:sqrid,
					start:start,
					end:end,
					reason:reason
				}, function(r) {
					_world.log('传入参数：' + sqrtitle + ' 从 ' + start.replace('00:00:00', '上午').replace('12:00:00', '下午') + ' 到 ' + end.replace('00:00:00', '上午').replace('12:00:00', '下午'));
					if(r.data.lxitems != null && r.data.lxitems.length > 0) {
						_world.log('/*** 共' + r.data.lxitems.length + '条连续请假 ***/');
						for(var i=0;i<r.data.lxitems.length;i++) {
							_world.log(renderQJD(r.data.lxitems[i]));
						}
					}
					if(r.data.needhb) {
						_world.log(('/*** 需要合并 *** 合并后申请时间改为从 ' + r.data.hbstart + ' 到 ' + r.data.hbend).replace(/00:00:00/g, '上午').replace(/12:00:00/g, '下午') + ' ***/');
					}
					else {
						_world.log('/*** 不需要合并 ***/');
					}
					console.log(r);
				}, '../../api/qingjiadan');
			}
		}
		
	    var _world = new CSJSV3.UI.World({});
	    _world.rootUrl('../../');
	    _world.addLogPlugin(function(msg) { 
	    	if(msg instanceof Object) {
		    	$('#div1').append('<div class="LogItem">' + JSON.stringify(msg) + '</div>'); 
	    	}
	    	else {
		    	$('#div1').append('<div class="LogItem">' + msg + '</div>'); 
	    	}
    	});
	    _world.ready(function (world) {
	    	_userSelector1Box = new CSJSV3.AUI.UsersSelector1Box({
	    		inputStyle: 'width:100px;',
        		showCheckbox:false,
        		onSelectDone:function(self, selected) {
        			
        		}
        	});
        	_userSelector1Box.init(world);
        	_userSelector1Box.render();
        	$('#sqr1').append(_userSelector1Box.getUICore());
        	
        	$('#startdate').datepicker({changeMonth: true, changeYear: true, dateFormat: "yy-mm-dd"});
        	$('#enddate').datepicker({changeMonth: true, changeYear: true, dateFormat: "yy-mm-dd"});
	    });
	</script>
	<style>
		.LogItem {
			line-height: 28px;
		}
	</style>
</body>
</html>