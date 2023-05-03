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

$('.carousel-animation').slick({
	dots: true,
	autoplay: true,
	autoplaySpeed: 2000,
	arrows: true,
	prevArrow: '<button type="button" class="slick-prev"> <i class="fas fa-chevron-left"></i> </button>',
	nextArrow: '<button type="button" class="slick-next"> <i class="fas fa-chevron-right"></i> </button>'
});



$(document).ready(function(){
	$(".api-checkbox").click(function(){
		$(".api-checkbox").toggleClass("rounded-img-clicked");
	});
	$(".web-checkbox").click(function(){
		$(".web-checkbox").toggleClass("rounded-img-clicked");
	}); 
	$(".desktop-checkbox").click(function(){
		$(".desktop-checkbox").toggleClass("rounded-img-clicked");
	});
	$(".iphone-checkbox").click(function(){
		$(".iphone-checkbox").toggleClass("rounded-img-clicked");
	});
	$(".integration-checkbox").click(function(){
		$(".integration-checkbox").toggleClass("rounded-img-clicked");
	});
	$(".question-checkbox").click(function(){
		$(".question-checkbox").toggleClass("rounded-img-clicked");
	});

	$('#country-codes li a').on('click', function() {
		$('#country-codes button span.value').text($(this).attr('value'));
	});
	$('#country li a').on('click', function() {
		$('#country button span.value').text($(this).attr('value'));
	});
	$('#Other li a').on('click', function() {
		$('#Other button span.value').text($(this).attr('value'));
	});
	
		$('#country_selector').val(''); // TP-22813
		$("#country_selector").countrySelect({
		  defaultCountry: "gb",
		  onlyCountries: theCountries.getCountryCodes(),
		  preferredCountries: []
		});
		
		theCountries.setDefaultSelectedCountry();
		
		$('#country_selector').change(function() {
			console.log("country changed");
			theCountries.onSelectedCountryChanged();
			dataLayer.push({
				'countryCode': $("#country_selector").countrySelect("getSelectedCountryData"),
			});	
		});

		var homeCountry = $("#country_selector").countrySelect("getSelectedCountryData");
		theCountries.setDisplayPhoneNumber(homeCountry);

		pricing.setFullCoverageLink(homeCountry);
		theCountries.setAppServerLinks(homeCountry.iso2.toLowerCase() === 'za' ? 'www1' : 'www2');

});



$(document).ready(function () {
	$("a").tooltip();
});

	// nav scroll
	// $(".solution-nav > li > a").on("click", function() {
	// 	var scrollAnchor = $(this).attr("data-scroll"),
	// 	  scrollPoint =
	// 		$('.nav-target[data-anchor="' + scrollAnchor + '"]').offset().top - 64;
		
	
	// 	$("body,html").animate(
	// 	  {
	// 		scrollTop: scrollPoint
	// 	  },
	// 	  800
	// 	);
	// 	return false;
	//   });
	
	$(".solution-nav > li").on('click',function () {
		$(".solution-nav > li").removeClass("active");
		// $(".tab").addClass("active"); // instead of this do the below 
		$(this).addClass("active");   
	});



	$(document).on('click', '.solution-nav > li a[href^="#"]', function(e) {
		// target element id
		var id = $(this).attr('href');
	
		// target element
		var $id = $(id);
		if ($id.length === 0) {
			return;
		}
	
		// prevent standard hash navigation (avoid blinking in IE)
		e.preventDefault();
	
		// top position relative to the document
		var pos = $id.offset().top;
	
		// animated top scrolling
		$('body, html').animate({scrollTop: pos});
	});


	$('.nav-sol-as').one('click', function() {

		// setTimeout(function(){
		// 	$('.nav-sol-as').attr('data-toggle', 'collapse');
		// 	$('.nav-sol-as').attr('data-target', '#collapseFive');
		//   }, 1000);
		
		  $('#collapseFive').addClass('show');
	});

	$('.nav-sol-smsh').one('click', function() {

		// setTimeout(function(){
		// 	$('.nav-sol-smsh').attr('data-toggle', 'collapse');
		// 	$('.nav-sol-smsh').attr('data-target', '#collapseFour');
		//   }, 1000);
		
		  $('#collapseFour').addClass('show');
	});

	$('.nav-sol-smsc').one('click', function() {

		// setTimeout(function(){
		// 	$('.nav-sol-smsc').attr('data-toggle', 'collapse');
		// 	$('.nav-sol-smsc').attr('data-target', '#collapseThree');
		//   }, 1000);
		
		  $('#collapseThree').addClass('show');
	});

	$('.nav-sol-cm').one('click', function() {

		// setTimeout(function(){
		// 	$('.nav-sol-cm').attr('data-toggle', 'collapse');
		// 	$('.nav-sol-cm').attr('data-target', '#collapseTwo');
		//   }, 1000);
		
		  $('#collapseTwo').addClass('show');
	});

	$('.nav-sol-sm').one('click', function() {

		// setTimeout(function(){
		// 	$('.nav-sol-sm').attr('data-toggle', 'collapse');
		// 	$('.nav-sol-sm').attr('data-target', '#collapseOne');
		//   }, 1000);
		
		  $('#collapseOne').addClass('show');
	});


	$('.nav-sol-sm').one('click', function() {


		$('#collapseFive').removeClass('show');
		$('#collapseFour').removeClass('show');
		$('#collapseThree').removeClass('show');
		$('#collapseTwo').removeClass('show');
		$('#collapseOne').addClass('show');
	});

	$('.nav-sol-cm').one('click', function() {

		$('#collapseFive').removeClass('show');
		$('#collapseFour').removeClass('show');
		$('#collapseThree').removeClass('show');
		$('#collapseTwo').addClass('show');
		$('#collapseOne').removeClass('show');
	});

	$('.nav-sol-smsc').one('click', function() {

		$('#collapseFive').removeClass('show');
		$('#collapseFour').removeClass('show');
		$('#collapseThree').addClass('show');
		$('#collapseTwo').removeClass('show');
		$('#collapseOne').removeClass('show');
	});

	$('.nav-sol-smsh').one('click', function() {

		$('#collapseFive').removeClass('show');
		$('#collapseFour').addClass('show');
		$('#collapseThree').removeClass('show');
		$('#collapseTwo').removeClass('show');
		$('#collapseOne').removeClass('show');
	});

	$('.nav-sol-as').one('click', function() {

		$('#collapseFive').addClass('show');
		$('#collapseFour').removeClass('show');
		$('#collapseThree').removeClass('show');
		$('#collapseTwo').removeClass('show');
		$('#collapseOne').removeClass('show');
	});


	$('#sending-messages').on('click', function() {
		$('.solution-nav .nav-item').removeClass('active');
		$('.nav-sol-sm').parent().addClass('active');
	});

	$('#contact-management').on('click', function() {
		$('.solution-nav .nav-item').removeClass('active');
		$('.nav-sol-cm').parent().addClass('active');
	});

	$('#managing-sms').on('click', function() {
		$('.solution-nav .nav-item').removeClass('active');
		$('.nav-sol-smsc').parent().addClass('active');
	});

	$('#viewing-sms').on('click', function() {
		$('.solution-nav .nav-item').removeClass('active');
		$('.nav-sol-smsh').parent().addClass('active');
	});

	$('#advanced-features').on('click', function() {
		$('.solution-nav .nav-item').removeClass('active');
		$('.nav-sol-as').parent().addClass('active');
	});