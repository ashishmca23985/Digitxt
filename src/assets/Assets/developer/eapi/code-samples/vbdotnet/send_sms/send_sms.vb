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
Imports System.Collections


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
    address = New Uri("{{ page.eapi_url_placeholder }}/submission/send_sms/2/2.0")

    ' Create the web request
    request = DirectCast(WebRequest.Create(address), HttpWebRequest)

    ' Set type to POST
    request.Method = "POST"
    request.ContentType = "application/x-www-form-urlencoded"

    ' Create the data we want to send
    username = "your_username"
    password = "your_password"
    message = "Test message: all non-alphanumeric GSM characters: $@!/""#%&,;:<>¡£¤¥§¿ÄÅÆÇÉÑÖØÜßàèéùìòå¿äöñüà" & Chr(10) & "Greek: ΩΘΔΦΓΛΩΠΨΣΘΞ"
    msisdn = "44123123123"

    data.Append("username=" + HttpUtility.UrlEncode(username, System.Text.Encoding.GetEncoding("ISO-8859-1")))
    data.Append("&password=" + HttpUtility.UrlEncode(password, System.Text.Encoding.GetEncoding("ISO-8859-1")))
    data.Append("&message=" + HttpUtility.UrlEncode(character_map(message), System.Text.Encoding.GetEncoding("ISO-8859-1")))
    data.Append("&msisdn=" + HttpUtility.UrlEncode(msisdn, System.Text.Encoding.GetEncoding("ISO-8859-1")))

    ' Create a byte array of the data we want to send
    byteData = System.Text.Encoding.GetEncoding("ISO-8859-1").GetBytes(data.ToString())
    'byteData = UTF8Encoding.UTF8.GetBytes(data.ToString())

    ' Set the content length in the request headers
    request.ContentLength = byteData.Length


    ' Write data
    Try
      postStream = request.GetRequestStream()
      postStream.Write(byteData, 0, byteData.Length)
    Catch ex As Exception
      Console.WriteLine(ex.ToString())
    Finally
      If Not postStream Is Nothing Then postStream.Close()
    End Try

    Try
      ' Get response
      response = DirectCast(request.GetResponse(), HttpWebResponse)

      ' Get the response stream into a reader
      reader = New StreamReader(response.GetResponseStream())

      ' Console application output
      ' Console.WriteLine(reader.ReadToEnd())

      Dim result As String = reader.ReadToEnd()
      Dim tokens() As String
      tokens = result.Split("|")

      If tokens.Length() <> 3 Then
        Console.WriteLine("Error: could not parse valid return data from server")
      Else
        If String.Compare(tokens(0).ToString, "0") = 0 Then
          Console.WriteLine("Message sent: batch " & tokens(2).ToString())
        Else
          Console.WriteLine("Error sending message: " & tokens(0) &" "& tokens(1))
        End If
      End if
    Catch ex As Exception
      Console.WriteLine(ex.ToString())
    Finally
      If Not response Is Nothing Then response.Close()
    End Try
  End Sub

  Public Shared Function character_map(msg As String) As String
    Dim chrs As Hashtable = New Hashtable
    ' Greek characters are mapped onto extended ASCII characters which are unused in the GSM character set
    chrs.Add("Ω", "Û")
    chrs.Add("Θ", "Ô")
    chrs.Add("Δ", "Ð")
    chrs.Add("Φ", "Þ")
    chrs.Add("Γ", "¬")
    chrs.Add("Λ", "Â")
    chrs.Add("Π", "º")
    chrs.Add("Ψ", "Ý")
    chrs.Add("Σ", "Ê")
    chrs.Add("Ξ", "±")

    Dim ret_str As String = ""
    Dim key As String
    Dim chrArray() As Char
    Dim nCnt As Integer
    chrArray = msg.ToCharArray

    For nCnt = 0 To chrArray.Length - 1
      key = chrArray(nCnt)
      If chrs.ContainsKey(key) Then
        ret_str = ret_str + chrs.Item(key)
      Else
        ret_str = ret_str + chrArray(nCnt)
      End If
    Next
    character_map = ret_str
  End Function
End Class
