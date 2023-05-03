<?php
//============================================= PHP Mobile Originating code sample =============================================//

/*
* 1. Save this script to your Web server.
*
* 2. Visit the corresponding URL for the script with your browser, to confirm that it is error-free.
*
* 3. Find the resulting logged entry (from error_log() below) in your Web server's error log (not the access log).
*
* 4. Next, set this URL as the MO SMS relay URL via your BulkSMS Profile. Send a repliable Mobile Terminating SMS
* to your phone, reply to it, and you should see a resulting log entry appear in your error log.
*
* When we push a Mobile Originating SMS to your relay URL, your script runs just as if you had visited the script's
* URL in your Web browser. However, the script's output text that would have been displayed to you in the browser,
* is simply discarded by our calling process. So if you want to know if we have called your URL successfully, you
* need to log something (as this example does), or add something to a database, or similar.
*/

$msisdn = $_REQUEST['msisdn'];
$sender = $_REQUEST['sender'];
$message = $_REQUEST['message'];

$output = "A message with body " . $message . " was sent from " . $sender . " to " . $msisdn ."\n";
echo $output;
error_log($output);

// Hex-encoded unicode SMS bodies ($_REQUEST['dca']=='16bit') can be decoded to UTF-8
// (which is typically what you would want to use) with:
// $decoded_body = mb_convert_encoding(hex2bin($_REQUEST['message']), "UTF-8", "UTF-16");

// Print the rest of the pushed parameters:
foreach ( $_REQUEST as $param => $value ) {
  echo $param . ": " . $value . "<br />";
}
?>
