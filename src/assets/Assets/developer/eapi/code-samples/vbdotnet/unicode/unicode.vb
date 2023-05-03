' We use the HttpUtility class from the System.Web namespace
'
' If you see of the error "'HttpUtility' is not declared", you are probably
' using a newer version of Visual Studio. You need to navigate to
' Project | <Project name> Properties | Compile | Advanced Compiler Settings,
' and select e.g. ".NET Framework 4" instead of ".NET Framework 4 Client Profile".
'
' Next, visit Project | Add reference, and select "System.Web" (specifically
' System.Web - not System.Web.<something>).
Imports System.Web
Imports System.IO
Imports System.Net
Imports System.Text


Public Class Application
  Public Shared Sub Main()


    Dim request As HttpWebRequest
    Dim response As HttpWebResponse = Nothing
    Dim reader As StreamReader
    Dim address As Uri

    Dim username As String
    Dim password As String
    Dim message As String
    Dim msisdn As String

    Dim data As New StringBuilder
    Dim byteData() As Byte
    Dim postStream As Stream = Nothing

    ' Please see the FAQ regarding HTTPS (port 443) and HTTP (port 80/5567)
    address = New Uri("{{ page.eapi_url_placeholder }}/submission/send_sms/2/2.0?")

    ' Create the web request
    request = DirectCast(WebRequest.Create(address), HttpWebRequest)

    ' Set type to POST
    request.Method = "POST"
    request.ContentType = "application/x-www-form-urlencoded"

    ' Create the data we want to send
    data.Append("username=" + HttpUtility.UrlEncode("myusername", System.Text.Encoding.GetEncoding("ISO-8859-1")))
    data.Append("&password=" + HttpUtility.UrlEncode("mypassword", System.Text.Encoding.GetEncoding("ISO-8859-1")))
    data.Append("&message=" + stringToHex("This is a test: ☺" & Chr(10) & "Arabic: شصض" & Chr(10) & "Chinese: 本网"))
    data.Append("&msisdn=44123123123")
    data.Append("&want_report=1")
    data.Append("&dca=16bit")

    ' Create a byte array of the data we want to send
    byteData = System.Text.Encoding.GetEncoding("ISO-8859-1").GetBytes(data.ToString())

    ' Set the content length in the request headers
    request.ContentLength = byteData.Length

    ' Write data
    Try
      postStream = request.GetRequestStream()
      postStream.Write(byteData, 0, byteData.Length)
    Catch ex As Exception
      Console.WriteLine(ex.toString())
    Finally
      If Not postStream Is Nothing Then postStream.Close()
    End Try

    Try
      ' Get response
      response = DirectCast(request.GetResponse(), HttpWebResponse)

      ' Get the response stream into a reader
      reader = New StreamReader(response.GetResponseStream())

      ' Console application output
      Console.WriteLine(reader.ReadToEnd())
    Catch ex As Exception
      Console.WriteLine(ex.toString())
    Finally
      If Not response Is Nothing Then response.Close()
    End Try
  End Sub

  Public Shared Function stringToHex(s As String) as String

    Dim ascii_number As String
    Dim hex_str As String
    Dim sResult As String
    Dim nCnt As Integer

    For nCnt = 1 To Len(s)
          ascii_number = AscW(Mid(s, nCnt, 1))
          hex_str = Hex(ascii_number)
      If Len(hex_str) = 1 Then
        sResult = sResult & ("000" & hex_str)
      Else If Len(hex_str) = 2 Then
        sResult = sResult & ("00" & hex_str)
      Else If Len(hex_str) = 3 Then
        sResult = sResult & ("0" & hex_str)
      Else
        sResult = sResult & hex_str
            End If
    Next
    stringToHex = sResult
  End Function

End Class
