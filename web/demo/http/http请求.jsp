<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Insert title here</title>
    <script src="../js/jq/jquery-1.x.x.min.js"></script>
    <script src="../apps/?cmd=sys_101svc_getjs&tgt=CSJSV3Core.js,CSJSV3UICore.js" type="text/javascript"></script>
    <link href="../apps/?cmd=sys_101svc_getjs&tgt=CSJSV3UICore.css" rel="stylesheet" type="text/css" />
</head>
<body>
	<input type="button" value="测试1" onclick="test1()" />
	<script>
		function test1() {
		}
	    var _world = new CSJSV3.UI.World({});
	    _world.rootUrl('../');
	    _world.ready(function (world) {
	    });
	</script>
</body>
</html>