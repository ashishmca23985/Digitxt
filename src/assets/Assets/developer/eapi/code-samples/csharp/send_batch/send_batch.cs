/* We use the HttpUtility class from the System.Web namespace
*
* If you see of the error "'HttpUtility' is not declared", you are probably
* using a newer version of Visual Studio. You need to navigate to
* Project | <Project name> Properties | Application,
* and select e.g. ".NET Framework 4" instead of ".NET Framework 4 Client Profile" as your 'Target framework'.
*
* Next, visit Project | Add reference, and select "System.Web" (specifically
* System.Web - not System.Web.<something>).
*/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.Web;
using System.IO;


namespace C_Sharp_sendbatch
{
  class BatchSMS{

    public static string Post(string url, string data){

    string result = null;
    try{
      byte[] buffer = Encoding.Default.GetBytes(data);
      HttpWebRequest WebReq = (HttpWebRequest)WebRequest.Create(url);
      WebReq.Method = "POST";
      WebReq.ContentType = "application/x-www-form-urlencoded";
      WebReq.ContentLength = buffer.Length;
      Stream PostData = WebReq.GetRequestStream();

      PostData.Write(buffer, 0, buffer.Length);
      PostData.Close();

      HttpWebResponse WebResp = (HttpWebResponse)WebReq.GetResponse();
      Console.WriteLine(WebResp.StatusCode);

      Stream Response = WebResp.GetResponseStream();
      StreamReader _Response = new StreamReader(Response);
      result = _Response.ReadToEnd();
    }
    catch (Exception ex){
      Console.WriteLine(ex.Message);
    }
    return result.Trim() + "\n";
  }

        static void Main(string[] args){
    TextReader tr = new StreamReader(@"\Path\to\your\batch_file");
    // E.g. TextReader tr = new StreamReader(@"C:\Users\user\Desktop\my_batch_file.csv")
    // Please see https://www.bulksms.com/developer/eapi/submission/send_batch/ for information
    // on what the format of your input file should be.

    string line;
    string batch = "";
    while ((line = tr.ReadLine()) != null){
      batch += line + "\n";
    }
    //Console.WriteLine(batch);

    tr.Close();


    string url = "{{ page.eapi_url_placeholder }}/submission/send_batch/1/1.0";

    /*****************************************************************************************************
    **Construct data
    *****************************************************************************************************/
    /*
    * Note the suggested encoding for the some parameters, notably
    * the username, password and especially the message.  ISO-8859-1
    * is essentially the character set that we use for message bodies,
    * with a few exceptions for e.g. Greek characters. For a full list,
    * see: https://www.bulksms.com/developer/eapi/submission/character-encoding/
    */

    string data = "";
    data += "username=" + HttpUtility.UrlEncode("your_username", System.Text.Encoding.GetEncoding("ISO-8859-1"));
    data += "&password=" + HttpUtility.UrlEncode("your_password", System.Text.Encoding.GetEncoding("ISO-8859-1"));
    data += "&batch_data=" + HttpUtility.UrlEncode(batch, System.Text.Encoding.GetEncoding("ISO-8859-1"));
    data += "&want_report=1";

    string sms_result = Post(url, data);

    string[] parts = sms_result.Split('|');

    string statusCode = parts[0];
    string statusString = parts[1];

    if (!statusCode.Equals("0")){
      Console.WriteLine("Error: " + statusCode + ": " + statusString);
    }
    else{
      Console.WriteLine("Success: batch ID " + parts[2]);
    }

    Console.ReadLine();
        }
    }
}
