<%
  ' This simple ASP Classic code sample is provided as a starting point. Please extend your
  ' actual production code to properly check the response for any error statuses that may be
  ' returned (as documented for the send_sms API call).

  username = "your_username"
  password = "your_password"
  recipient = "44123123123"
  message = "This is a test SMS from ASP"
  postBody = "username=" & Server.URLEncode(username) _
           & "&password=" & Server.URLEncode(password) _
           & "&msisdn=" & recipient _
           & "&message=" & Server.URLEncode(message)

  set httpRequest = CreateObject("MSXML2.ServerXMLHTTP")
  httpRequest.open "POST", "{{ page.eapi_url_placeholder }}/submission/send_sms/2/2.0", false
  httpRequest.SetRequestHeader "Content-Type", "application/x-www-form-urlencoded"
  httpRequest.send postBody
  Response.Write (httpRequest.responseText)
%>
