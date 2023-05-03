  // If on Pricing page:
  $(document).ready(function () {
    if (window.location.pathname.match("/pricing\/\$")) {

      var selectedHomeCountry = $("#country_selector").countrySelect("getSelectedCountryData");
      $('#destination-country').val(''); // TP-22813
      $("#destination-country").countrySelect({
        defaultCountry: selectedHomeCountry.iso2,
        onlyCountries: theCountries.getCountryCodes()
      });
      pricing.populatePackages(selectedHomeCountry.iso2);

      $("#destination-country").change(function () {
        if ($('#destination-country').length) {
          var selected = $("#country_selector").countrySelect("getSelectedCountryData");
          pricing.populatePackages(selected.iso2);
        }
      });

      $("#package-slider").change(function () {
        var homeCountry = $("#country_selector").countrySelect("getSelectedCountryData");
        pricing.updateSelectedPackageDetails(homeCountry.iso2);
      });
    }
    //if on global coverage page
    if (window.location.pathname.match(/^\/pricing\/all\//)) {
      pricing.populateGlobalCoverageSection(myCoverage);
    }
      pricing.setCoverageLinks();
    });

  //##########################################################

  // Initialize the media query
  var mediaQuery = window.matchMedia('(min-width: 640px)');

  // Add a listen event
  mediaQuery.addListener(doSomething);

  // Function to do something with the media query
  function doSomething(mediaQuery) {
    if (mediaQuery.matches) {
      $('.sep').attr('colspan', 5);
    } else {
      $('.sep').attr('colspan', 2);
    }
  }

  // On load
  doSomething(mediaQuery);
