<%@page contentType="application/json" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<% response.addHeader("Access-Control-Allow-Origin", "*"); %>
<%@include file="functions.jsp"%>
<%
    setJSONValues(request);
    
    String username = getReqBody("username");
    String password = getReqBody("password");
    
    CheckUser user = new CheckUser(login(username, password));
    if (user.token != "") user.status = true;
%>
{ "token" : "<%= user.token %>", "name" : "<%= user.name %>", "username" : "<%= user.username %>", "profilePic" : "<%= user.profilePic %>", "list" : "<%= user.list %>", "status": <%= user.status %>  }