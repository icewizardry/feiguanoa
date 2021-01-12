<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.*" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="com.csaui5.*" %>
<%@ page import="com.csaui5.helper.*" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
<%
SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
DateTimeHelper dth = new DateTimeHelper();
Date start = sdf.parse("2019-08-01");
Date end = sdf.parse("2019-08-31");
Date[] dates = dth.getDatesFromStartToEnd(start, end);
for(int i=0;i<dates.length;i++) {
	%><div><%=sdf.format(dates[i])%></div><%
}
%>
<hr/>
<%=Date.parse("2019-08-01") %>
<hr/>
<%=String.format("哈哈哈%s，%s", 1, "sdfsf") %>
<hr/>
<%=new DateTimeHelper().getLastDayOfMonthStr(2019, 8, "yyyy-MM-dd") %>
<hr/>
<%=new DateTimeHelper().getLastDayOfMonth(2019, 8).equals(new DateTimeHelper().getLastDayOfMonth(2019, 8)) %>
<hr/>
<%=new DateTimeHelper().getLastDayOfMonth(2019, 9).compareTo(new DateTimeHelper().getLastDayOfMonth(2019, 8)) %>
</body>
</html>