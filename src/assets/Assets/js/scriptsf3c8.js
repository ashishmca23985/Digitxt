if (!window.console) console = { log:function(){}, dir:function(){} };

function ajaxStartDisplay(selector) {
	return function() {
		$(selector).find('.ajaxSpinner')
			.css('display', 'inline-block')
			.css('visibility', 'visible');
	}
}
function ajaxStopDisplay(selector) {
	return function() {
		$(selector).find('.ajaxSpinner')
			.css('display', 'none')
			.css('visibility', 'hidden');
	}
}
/****************************************************************************************/
// Google Captcha
/****************************************************************************************/
function recaptchaOnload() {
	var siteKey = '6Leeuq0UAAAAAHJIeHS-tjb4hRIlcCDTizIru6cv';
	
	grecaptcha.render(
			'recaptcha',
			{ 'sitekey' : siteKey },
			true
	);
	
	document.getElementById('send-message-btn').onclick = validate;
		
	$('#send-message-response').html('');
	$('#send-message-btn').prop( "disabled", false );
}

function validate(event) {
	event.preventDefault();

	var cn = $('#cell_number');
	if (cn.attr('country_code'))
		cn.val( cn.val().replace(/^0/, cn.attr('country_code')).replace(/\D/g, '') );
	
	if (($('#cell_number').val().length >= 7) && ($('#cell_number').val().length <= 15) ) {
		$('#send-message-response').text('');
		grecaptcha.execute();

	} else {
		$('#send-message-response').html('Please enter a valid phone number');
	}
}

function sendTest(token) {
	if (token == undefined || token == '') {
		grecaptcha.reset();
		$('#send-message-response').html("Please complete Captcha correctly.");
		return;
	}
	
	$('#send-message-response').text('');
	$('#send-message-btn').prop( "disabled", true );
	$('#submitting').show("slow") ;
	
	$.ajax({
		url: '/send-network-test-sms.php',
		type: 'post',
		dataType:'html',
		data: $('#network-test').serialize(),
		success: function(response, textStatus, jqXHR){
			var params = "?template=networkTest&phoneNumber=" + $('#cell_number').val();
			$('#send-message-response').html("Message sent!\nIf your test message does not reach you, <a href='/contact/" +  params + "'>please report it here</a>.");
		},
		error: function(jqXHR, textStatus, errorThrown){
			if (jqXHR.status == 429 || jqXHR.status == 503) {
				$('#send-message-response').html("Too many tests have already been sent. Please <a href='/contact/'>contact us for assistance</a>.");
			}
			else {
				$('#send-message-response').html("An error occurred when sending the message. Please <a href='/contact/'>contact us for assistance</a>.");
			}
		},
		complete: function(jqXHR, textStatus){
			$('#recaptcha').hide();
			$('#submitting').hide("slow");
			$('#send-message-btn').prop( "disabled", false );
			grecaptcha.reset();
		}
	});
}

/****************************************************************************************/
// StopSpam

function submitStopSpamIntro() {
	console.log($('#stop-spam-intro form').serialize());
	resetSuccessErrorMsg();
	$.ajax({
		url: '/stop/stop.php',
		type: 'post',
		timeout: 15000,
		dataType: 'json',
		data: $('#stop-spam-intro form').serialize(),
		beforeSend: ajaxStartDisplay( $('#stop-spam-intro') ),
		complete: ajaxStopDisplay( $('#stop-spam-intro') ),
		success: function (response, textStatus, jqXHR) {
			$('#stop-spam-intro').hide();
			$('#stop-spam-title-intro').hide();

			$('#stop-spam-verification')
				.find('input[name=msisdn]').val(response.msisdn).end()
				.find('input[name=hmac]').val(response.hmac).end()
				.find('input[name=otpExpiryTime]').val(response.otpExpiryTime).end()
				.show();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			handleError(jqXHR, textStatus, errorThrown);
		}
	});
	return false;
}

function stopSpamRecaptcha(v) {
	submitStopSpamIntro();
}

function showError(msg) {
	var x = '<div class="alert alert-danger alert-dismissable" style="display:hidden;"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + msg + '</div>';
	$('#user-alert').html(x);
}

function resetSuccessErrorMsg() {
	$('#user-alert').html('');
}

function showSuccess(msg) {
	var x = '<div class="alert alert-success alert-dismissable fade in" style="display:hidden;"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + msg + '</div>';
	$('#user-alert').html(x);
}

function handleError(jqXHR, textStatus, errorThrown) {
	console.log('error(s): ' + textStatus, errorThrown);
	var errorText;
	if (textStatus == 'timeout') {
		errorText = 'A timeout occurred. Please retry shortly, or contact Support.';
	} else {
		errorText = jqXHR.responseText || errorThrown || textStatus || 'An error occurred - please contact Support.';
	}
	showError(errorText);
}

function sanitiseExternalLinks() {
	$('a').each(function(index, anchor) {
		if (!anchor.href) return;
		// Only apply to external links:
		if (location.hostname === anchor.hostname) return;
		if ( /(\.bulksms\.com|\.bulksmstest\.com)$/.test(anchor.hostname) ) return;
		var newRel = [];
		if (anchor.rel !== undefined) {
			newRel = anchor.rel.toLowerCase().split(/\s*\b\s*/);
		}
		// Force all external URLs to contains rel=noopener and rel=noreferrer
		$.each(["noopener", "noreferrer"], function(index, attr) {
			if ($.inArray(attr, newRel) === -1) {
				newRel.push(attr);
			}
		})
		anchor.rel = newRel.join(" ").trim();
	});
}


$(function() {
	$('#stop-spam-intro-next #cell_number').on('keyup', function() {
		if (/^\+?\d{8,15}$/.test($(this).val())) {
			$('.stop-spam-intro-next').removeAttr('disabled');
		} else {
			$('.stop-spam-intro-next').attr('disabled','disabled');
		}
	});

	$('#stop-spam-verification form').on('submit', function() {
		resetSuccessErrorMsg();
		var form = $(this);

		function makeBlockedRow(row) {
			$(row).addClass('blocked')
			.unbind("click")
			.find('.messageBody')
				.attr('data-toggle', 'tooltip')
				.attr('data-placement', 'left')
				.attr('title', 'This user has already been blocked from sending to you')
				.tooltip();
		}

		$.ajax({
			url: '/stop/stop.php',
			type: 'post',
			dataType: 'json',
			timeout: 15000,
			data: form.serialize(),
			beforeSend: ajaxStartDisplay( $('#stop-spam-verification') ),
			complete: ajaxStopDisplay( $('#stop-spam-verification') ),
			success: function (response, textStatus, jqXHR) {
				$('#stop-spam-verification').hide();
				$(".stop-spam-info").hide();

				var msisdn = form.find('input[name=msisdn]').val();
				var otp = form.find('input[name=otp]').val();
				var hmac = form.find('input[name=hmac]').val();
				var otpExpiryTime = form.find('input[name=otpExpiryTime]').val();

				$('#stop-spam-messages-msisdn').html(msisdn);
				var messages = $('#stop-spam-messages');

				// remove any previous entries...
				messages.find('tbody').empty();

				// render each message into the table
				$.each(response, function(k, v) {
					var tr = $('<tr>')
						.data(v)
						.addClass('user-guid-' + v.user.guid)
						.append( $('<td>')
							.append(
								$('<span>')
									.attr('title', moment(v.date).format())
									.attr('data-toggle', 'tooltip')
									.attr('data-placement', 'right')
									.tooltip()
									.css("cursor", "pointer")
									.text(moment(v.date).fromNow())
							)
						)
						.append( $('<td>')
							.append(
								$('<span>')
									.attr('class','messageBody')
									.html($.parseHTML(v.body))
							)
					);
					if (v.user.blocked) makeBlockedRow($(tr));
					messages.find('tbody').prepend(tr);
				});

				// click handler to display details
				messages.find('tbody tr').not('.blocked').on('click', function() {
					resetSuccessErrorMsg();
					var tr = $(this);
					var details = $(this).data();

					$.featherlight($('#stop-spam-details'), {
						afterContent: function(event) {
							$(this.$content)
								.find('.name').text(details.user.name).end()
								.find('.company').text(details.user.company).end()
								.find('.email').text(details.user.email).end()
								.find('button.cancel')
									.on('click', function() { $.featherlight.current().close(); return false; })
									.end()
								.find('button.block')
									.on('click', this.$content, function(event) {
										var comment = event.data.find('textarea[name=comment]').val();

										$.ajax({
											url: '/stop/stop.php',
											type: 'post',
											timeout: 15000,
											data: {
												action: 'block',
												msisdn: msisdn,
												otp: otp,
												otpExpiryTime: otpExpiryTime,
												hmac: details.userHmac,
												user: details.user.guid,
												comment: comment
											},
											success: function (response, textStatus, jqXHR) {
												showSuccess('This user has been blocked from sending to you');
												$('#stop-spam-messages').find('tr.user-guid-' + details.user.guid).each(function() {
													makeBlockedRow(this)}
												);
												$.featherlight.current().close();
											},
											error: function (jqXHR, textStatus, errorThrown) {
												handleError(jqXHR, textStatus, errorThrown);
												$.featherlight.current().close();
											}
										});
										return false;
									})
									.end()
								.show();

							if (details.user.blockable) {
								$(this.$content).find('.blockable').show();
								$(this.$content).find('.not-blockable').hide();
							}
							else {
								$(this.$content).find('.not-blockable').show();
								$(this.$content).find('.blockable').hide();
							}
						}
					});
				});
				$(".stop-spam-input-container").hide();
				$(".stop-spam-msg-container").show();
				// finally... display the list of messages
				messages.show();
			},
			error: function (jqXHR, textStatus, errorThrown) {
				handleError(jqXHR, textStatus, errorThrown);
			}
		});
		return false;
	});
	
	sanitiseExternalLinks();
});
/****************************************************************************************/


/****************************************************************************************/
// Show/Hide
$(function(){
	// FIXME: for support/frequently-asked-questions.htm
	//            resources/mobile-marketing-guide.htm
	$('.mobile-guide-sub').hide();

	// FIXME: for solutions/index.htm
	$('.solution-sub').hide();

	$('.show_hide').on('click', function() {
		$($(this).attr('rel')).toggle(400);
	});
});
/****************************************************************************************/

/****************************************************************************************/
// Pricing
$(function() {
	$( document ).ajaxError(function( event, jqxhr, settings, thrownError ) {
		if (!/\/coverage\/country-data\//.test(settings.url) ) {
			console.log("Error making request to: " + settings.url);
		}
	});
});

function Querystring(qs) {
	this.params = {};

	if (qs == null) qs = location.search.substring(1, location.search.length);
	if (qs.length == 0) return;

	qs = qs.replace(/\+/g, ' ');
	var args = qs.split('&');

	for (var i = 0; i < args.length; i++) {
		var pair = args[i].split('=');
		var name = decodeURIComponent(pair[0]);
		var value = (pair.length==2) ? decodeURIComponent(pair[1]) : name;
		this.params[name] = value;
	}
}
Querystring.prototype.get = function(key, default_) { return (this.params[key] != null) ? this.params[key] : default_; }
Querystring.prototype.contains = function(key) { return (this.params[key] != null); }
var queryString = new Querystring();


/****************************************************************************************/
// Online application form psms
$(function() {
	// FIXME: these hides should be done via css, not js
	$('#dedicated-shortcode-description').hide();
	$('#dedicated-shortcode-data').hide();
	$('#dedicated-shortcodeCount').hide();
	$('#shared-shortcode-description').hide();
	$('#shared-shortcode-data').hide();
	$('#shared-shortcodeCount').hide();

	$('#dedicatedCheckbox').change(function() {
		if ($('#dedicatedCheckbox').prop("checked")) {
			$('#dedicated-shortcode-description, #dedicated-shortcode-data, #dedicated-shortcodeCount').show();
		} else {
			$('#dedicated-shortcode-description, #dedicated-shortcode-data, #dedicated-shortcodeCount').hide();
		}
	});

	$('#sharedCheckbox').change(function() {
		if ($('#sharedCheckbox').prop("checked")) {
			$('#shared-shortcode-description, #shared-shortcode-data, #shared-shortcodeCount').show();
		} else {
			$('#shared-shortcode-description, #shared-shortcode-data, #shared-shortcodeCount').hide();
		}
	});

	$('#dedicatedShortcodeCountSelect')
		.on('change', function() {
			// enable all fragments
			$('.dedicated-shortcode-fragment')
				.slice(0, $(this).val())
				.show()
				.find('select,input').removeAttr('disabled');

			// hide and disable all fragments beyond the number selected
			$('.dedicated-shortcode-fragment')
				.slice($(this).val())
				.hide()
				.find('select,input').attr('disabled', 'disabled');
		})
		.change();

	$('#sharedShortcodeCountSelect')
		.on('change', function() {
			// enable all fragments
			$('.shared-shortcode-fragment')
				.slice(0, $(this).val())
				.show()
				.find('select,input').removeAttr('disabled');

			// hide and disable all fragments beyond the number selected
			$('.shared-shortcode-fragment')
				.slice($(this).val())
				.hide()
				.find('select,input').attr('disabled', 'disabled');
		})
		.change();
});
/****************************************************************************************/

/****************************************************************************************/

$(function() {
	$('#sel_subject').on('change', function() {
		if ($(this).val() == 'other') {
			$('#hide-subject,#hide-subject2').show();
			$('input[name=other_subject]').removeAttr('disabled');

		}
		else {
			$('#other-subject').val($('#sel_subject').val());
			$('#hide-subject,#hide-subject2').hide();
			$('input[name=other_subject]').attr('disabled', 'true');
		}
	});
});
/****************************************************************************************/

/****************************************************************************************/
// Contact form submission:
$(function() {
	$('.contactform #mySubmit').click(function(event) {
        // In case user decides to submit a second request without reloading the page, start by clearing previous outcome notices:
        $('.form-mailer-success').addClass('d-none'); $('.form-mailer-error').addClass('d-none');
        $('#submitting').removeClass('d-none');
        if (!grecaptcha.getResponse()) {
            $('#submitting').addClass('d-none');
            // captcha not yet completed - prevent form submit:
            event.preventDefault();
            grecaptcha.execute();
        }
    });
});

var onContactFormCaptchaCompleted = function() {
	var previousButtonLabel = $('.send-button > .button-text').text();
	$('.send-button .button-text').text('Submitting...');
  $('#submitting').removeClass('d-none');
	$.ajax({
		url: '/mailer.php',
        timeout: 25000,
		type: 'post',
		dataType:'html',
        data: $('.contactform').serialize(),
		xhrFields: {
			withCredentials: true
		},
		success: function(response, textStatus, jqXHR){
			$('.form-mailer-success').removeClass('d-none');
		},
		error: function(jqXHR, textStatus, errorThrown){
			$('.form-mailer-error').removeClass('d-none');
		},
		complete: function(jqXHR, textStatus){
      $('#submitting').addClass('d-none');
			$('.send-button > .button-text').text(previousButtonLabel);
            grecaptcha.reset();
		}
	});
}
/****************************************************************************************/


/****************************************************************************************/
/* direct login to the correct server */
// http://stackoverflow.com/a/5639455
window.readCookie = function (k,r){return(r=RegExp('(^|; )'+encodeURIComponent(k)+'=([^;]*)').exec(document.cookie))?r[2]:null;}


/****************************************************************************************/
/* Populate support from */
$(function() {
	if(queryString.get("template") == "networkTest") {
		$("#sel_subject").val("Network Test");
		$("#postID").text('I have experienced poor delivery to this mobile number from your Network Test page:\n' + queryString.get("phoneNumber") + '\nMy phone is on this network:\nThese routes failed:\nFurther comments:');
	}
});


/****************************************************************************************/
/* DTM links */
$(function() {
	var updateDtmDownloadLinks = function() {
		var legacySite = $.cookie('bulksms_legacy_site'),
		    customerCountry = $.cookie('customerCountry');
		    dtm = 'http://messenger.bulksms.com/download/bulksms-windows-messenger.exe',
		    dtmCommunityZa = 'http://messenger.bulksms.com/download/messenger_bcom_7214.exe',
		    dtmCommunityUk = 'http://messenger.bulksms.com/download/messenger_cmuk_7214.exe';

		switch (true) {
			case /community.bulksms.com/.test(legacySite):
				$('a.dtm-download-link').attr('href', dtmCommunityZa);
				break;

			case /community.bulksms.co.uk/.test(legacySite):
				$('a.dtm-download-link').attr('href', dtmCommunityUk);
				break;

			case customerCountry == 'GB' && !legacySite:
			case customerCountry == 'ZA' && !legacySite:
				$('a.dtm-download-link')
					.attr('href', '#')
					.unbind('click')
					.on('click', function() {
						$.featherlight('/products/dtm-version-selector.htm', {
							afterContent: function(event) {
								$(this.$content)
									.find('a.dtm-download-link')
										.attr('href', customerCountry == 'GB' ? dtmCommunityUk : dtmCommunityZa);
							}
						});
						return false;
					});
				break;

			default:
				$('a.dtm-download-link')
					.unbind('click')
					.attr('href', dtm);
		}
	};
	updateDtmDownloadLinks.apply();
	$('#countrySelect').on('change', updateDtmDownloadLinks);
});

/****************************************************************************************/
/* initialize bootstrap tooltips */
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});

/***************************************************************************************/
/* Set community sign up links */

$(function() {
	var url = window.location.href;
	if(url.indexOf("community-messaging") >= 0) {
		var registrationLink = $('.register-link').attr('href');
		$('.register-link').attr('href', registrationLink + '?non_profit=1');
	}
});

