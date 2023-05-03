#!/usr/bin/perl -w
use strict;
use HTTP::Request::Common;
use LWP::UserAgent;
	
my $ua = LWP::UserAgent->new(timeout => 30);

# Please see the FAQ regarding HTTPS (port 443) and HTTP (port 80/5567)

my $res = $ua->request(POST '{{ page.eapi_url_placeholder }}/submission/send_sms/2/2.0',
	Header => 'Content-Type: application/x-www-form-urlencoded',
	Content => [
		username => 'myusername',
		password => 'xxxxxxxxxx',
		msisdn => '44123123123',
		message => 'Test from Perl',
	],
);

if ($res->is_error) {
  die "HTTP request error, with error code ".$res->code.
  ", and body:\n\n".$res->error_as_HTML;
}

my ($result_code, $result_string, $batch_id) = split(/\|/, $res->content);

if ($result_code eq '0') {
  print "Message sent: batch $batch_id";
}
else {
  print "Error sending: $result_code: $result_string";
}
print "\n";