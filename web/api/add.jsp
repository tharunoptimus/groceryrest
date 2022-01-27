<%@page contentType="application/json" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<% response.addHeader("Access-Control-Allow-Origin", "*"); %>
<%@include file="functions.jsp"%>
<%
    setJSONValues(request);
    
    String token = getReqBody("token");
    String list = getReqBody("list");
    
    updateList(token, list);
%>
{ "list" : "<%= list %>" }