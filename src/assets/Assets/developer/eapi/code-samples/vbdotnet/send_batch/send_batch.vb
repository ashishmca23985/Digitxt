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

Module Module1

    Sub Main()
        Dim request As HttpWebRequest
        Dim response As HttpWebResponse = Nothing
        Dim reader As StreamReader
        Dim address As Uri

        Dim username As String
        Dim password As String
        Dim batch_data As String = ""

        Dim data As New StringBuilder
        Dim byteData() As Byte
        Dim postStream As Stream = Nothing

        ' Please see the FAQ regarding HTTPS (port 443) and HTTP (port 80/5567)
        address = New Uri("{{ page.eapi_url_placeholder }}/submission/send_batch/1/1.0")

        ' Create the web request
        request = DirectCast(WebRequest.Create(address), HttpWebRequest)

        ' Set type to POST
        request.Method = "POST"
        request.ContentType = "application/x-www-form-urlencoded"

        ' Create the data we want to send
        username = "your_username"
        password = "your_password"

        Dim file As File
        Dim file_reader As StreamReader

        file_reader = file.OpenText("Complete_Path\To\Your\batch_data_file")
        ' E.g. file_reader = file.OpenText("C:\Users\user\Desktop\my_batch_file.csv")
        ' Please see https://www.bulksms.com/developer/eapi/submission/send_batch/ for information
        ' on what the format of your input file should be.

        While file_reader.Peek <> -1
            batch_data = batch_data & file_reader.ReadLine() & Chr(10)
        End While

        Console.WriteLine(batch_data)

        data.Append("username=" + HttpUtility.UrlEncode(username, System.Text.Encoding.GetEncoding("ISO-8859-1")))
        data.Append("&password=" + HttpUtility.UrlEncode(password, System.Text.Encoding.GetEncoding("ISO-8859-1")))
        data.Append("&batch_data=" + HttpUtility.UrlEncode(batch_data, System.Text.Encoding.GetEncoding("ISO-8859-1")))


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
                    Console.WriteLine("Error sending message: " & tokens(0) & " " & tokens(1))
                End If
            End If
        Catch ex As Exception
            Console.WriteLine(ex.ToString())
        Finally
            If Not response Is Nothing Then response.Close()
        End Try

        Console.ReadLine()
    End Sub
End Module
