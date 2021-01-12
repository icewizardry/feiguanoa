<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>交叉请假识别</title>
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
	<div id="div1"></div>
	<script>
		var _userSelector1Box;
		
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
				_world.log('传入参数：' + sqrtitle + ' 从 ' + start.replace('00:00:00', '上午').replace('12:00:00', '下午') + ' 到 ' + end.replace('00:00:00', '上午').replace('12:00:00', '下午'));
				_world.com().reqByCmd('cansqforjj', {
					userid:sqrid,
					starttime:start,
					endtime:end,
					reason:reason
				}, function(r) {
					_world.log(JSON.stringify(r));
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