"use strict";
;
var theCountries;
(function (theCountries) {
    var countryToPhoneMap = {
        'us': '+1 347 417 5903',
        'gb': '0345 4030 767 (Sales) or 0345 301 6857 (Support)',
        'za': '+27 21 528 3420',
        'de': '+49 180 300 221 04096',
        'es': '+34 933 967 998',
        'au': '+61 2 6176 0844',
        'hk': '+85 281 930 767'
    };
    function getCountryCodes() {
        var countryCodes = new Array();
        var json = (function () {
            var list = getFullCountryList();
            var countryData1 = jsonPath(list, '$.*');
            var keys = Object.keys(countryData1);
            var codes = new Array();
            for (var k in keys) {
                var temp = window.$.map(countryData1[k], function (v, k) {
                    return k;
                });
                codes.push(temp);
            }
            var joined = codes.join(",");
            return joined.split(",");
        })();
        countryCodes.push(json);
        return lowerCase(countryCodes[0]);
    }
    theCountries.getCountryCodes = getCountryCodes;
    function lowerCase(array) {
        var lower = [];
        for (var i = 0; i < array.length; i++) {
            lower.push(array[i].toLowerCase());
        }
        return lower;
    }
    function setDefaultSelectedCountry() {
        var cookieCountry = window.$.cookie("customerCountry");
        if (cookieCountry) {
            window.$("#country_selector").countrySelect("selectCountry", cookieCountry);
        }
        else {
            geoip2.country(onGeoIpSuccess, onGeoIpError);
        }
    }
    theCountries.setDefaultSelectedCountry = setDefaultSelectedCountry;
    function setDisplayPhoneNumber(homeCountry) {
        var value = getDisplayPhoneNumber(homeCountry);
        window.$("#phone-number").val(value).html(value);
    }
    theCountries.setDisplayPhoneNumber = setDisplayPhoneNumber;
    function getDisplayPhoneNumber(homeCountry) {
        var code = homeCountry.iso2;
        var phone = countryToPhoneMap[code];
        return phone ? phone : '+44 345 4030 767 / +27 21 528 3420';
    }
    theCountries.getDisplayPhoneNumber = getDisplayPhoneNumber;
    function setCustomerCountryCookie(countryCode) {
        if (countryCode === null)
            return;
        window.$.cookie('customerCountry', countryCode.toUpperCase(), { expires: 10000, path: '/', domain: location.hostname.replace(/^www\./, '') });
    }
    function setAppServerLinks(server) {
        var cookieCountry = window.$.cookie("customerCountry");
        var webApp2Accessed = window.$.cookie("web-app-2");
        var registerLink = server + ".bulksms.com/register";
        var loginLink = server + '.bulksms.com';
        var loginHome = '/home/';
        if (cookieCountry !== "ZA") {
            registerLink = "www.bulksms.com/account/#!/registration";
        }
        if (webApp2Accessed === 'true') {
            loginLink = "www.bulksms.com/account/#!/login/";
            loginHome = "";
        }
        window.$('.register-link').each(function () {
            window.$(this).attr('href', window.$(this).attr('href').replace(/www[12]\.bulksms\.com\/register\//, registerLink));
        });
        window.$('.login-link').each(function () {
            window.$(this).attr('href', window.$(this).attr('href').replace(/www[12]\.bulksms\.com/, loginLink));
            window.$(this).attr('href', window.$(this).attr('href').replace('/login.mc', loginHome));
        });
    }
    theCountries.setAppServerLinks = setAppServerLinks;
    function onSelectedCountryChanged() {
        var selected = window.$("#country_selector").countrySelect("getSelectedCountryData");
        setCustomerCountryCookie(selected.iso2);
        setDisplayPhoneNumber(selected);
        setAppServerLinks(selected.iso2.toLowerCase() === 'za' ? 'www1' : 'www2');
        //if on pricing page
        if (window.location.pathname.match("/pricing\/\$")) {
            pricing.populatePackages(selected.iso2);
            window.$("#destination-country").countrySelect("selectCountry", selected.iso2);
            pricing.setCoverageLinks();
        }
        //if on global coverage page
        if (window.location.pathname.match(/^\/pricing\/all\//)) {
            pricing.setCoverageLinks();
            var creditsHoldingCurrency = pricing.getCurrency(selected.iso2);
            if (queryString.get('creditsHoldingCurrency') != creditsHoldingCurrency) {
                var loc = "/pricing/all/?creditsHoldingCurrency=" + creditsHoldingCurrency;
                window.location = loc;
            }
            pricing.populateGlobalCoverageSection(myCoverage);
        }
    }
    theCountries.onSelectedCountryChanged = onSelectedCountryChanged;
    var onGeoIpSuccess = function (location) {
        var ipCountry = jsonPath(location, '$.country.iso_code');
        if (ipCountry) {
            window.$("#country_selector").countrySelect("selectCountry", ipCountry[0].toLowerCase());
        }
        onSelectedCountryChanged();
    };
    var onGeoIpError = function (error) {
        window.$("#country_selector").countrySelect("selectCountry", "gb");
    };
})(theCountries || (theCountries = {}));
var pricing;
(function (pricing) {
    var $packageData = {};
    var $routingData = {};
    var $vatRates = {};
    var currencyLookup = {
        "GBP": {
            "baseunit": "Pounds",
            "baseunit_symbol": "£",
            "subunit": "pence",
            "subunit_symbol": "p"
        },
        "USD": {
            "baseunit": "Dollars",
            "baseunit_symbol": "$",
            "subunit": "cents",
            "subunit_symbol": "c"
        },
        "EUR": {
            "baseunit": "Euros",
            "baseunit_symbol": "€",
            "subunit": "cents",
            "subunit_symbol": "c"
        },
        "ZAR": {
            "baseunit": "Rands",
            "baseunit_symbol": "R",
            "subunit": "cents",
            "subunit_symbol": "c"
        }
    };
    var countryToCurrencyMap = {
        'us': 'USD',
        'gb': 'GBP',
        'za': 'ZAR'
    };
    function getCurrency(homeCountryCode) {
        var currency = countryToCurrencyMap[homeCountryCode];
        return currency ? currency : 'EUR';
    }
    pricing.getCurrency = getCurrency;
    function loadRoutingData(destCountryCode, userCountryCode) {
        window.$.getJSON('/coverage/country/?destinationCountry=' + destCountryCode.toUpperCase() + '&customerCurrency=' + getCurrency(userCountryCode))
            .done(function (data) {
            $routingData = data;
            loadVATRates(userCountryCode);
        });
    }
    function loadVATRates(userCountryCode) {
        window.$.getJSON("/pricing/vat-rates.json")
            .done(function (data) {
            $vatRates = data;
            updateSlider($packageData.bundles.length);
            updateSelectedPackageDetails(userCountryCode);
            updateNetworksTable();
        });
    }
    function updateSlider(packageCount) {
        window.$("#package-slider").slider({
            tooltip: 'always',
            max: packageCount - 1,
            step: 1,
            min: 0,
            value: 5,
            formatter: function (value) {
                return pricing.getPackageValue(value) + ' Credits';
            }
        });
        window.$('#package-slider').slider('refresh', { useCurrentValue: true });
    }
    //gets called when the home country or destinaion country changes
    function populatePackages(homeCountryCode) {
        window.$('#package-select').empty();
        var currency = getCurrency(homeCountryCode);
        var url = currency.toLowerCase() + ".json?v=20190130";
        window.$.getJSON("/pricing/" + url)
            .done(function (json) {
            $packageData = json;
            window.$.each($packageData.bundles, function (val, text) {
                var displayText = text.credits + " credits ";
                window.$('#package-select').append(window.$('<option></option>').val(val).html(displayText));
            });
            var destCountry = window.$("#destination-country").countrySelect("getSelectedCountryData");
            loadRoutingData(destCountry.iso2, homeCountryCode);
            window.$("#routing-table-header").find("tr td p").html("Networks we support in " + destCountry.name);
        }).fail(function () {
            console.error("Could not load package data for url: " + url);
        });
    }
    pricing.populatePackages = populatePackages;
    function getPackageValue(index) {
        return $packageData.bundles[index].credits;
    }
    pricing.getPackageValue = getPackageValue;
    var NO_ESTIMATE = 'No estimate available';
    //Gets called each time the selected package changes 
    function updateSelectedPackageDetails(userCountryCode) {
        var decimalPlaces = 2;
        var route2Average = 0;
        var thisCountryVatRate = $vatRates[userCountryCode.toUpperCase()];
        var selectedPackageIdx = window.$("#package-slider").val();
        var selectedBundle = $packageData.bundles[selectedPackageIdx ? selectedPackageIdx : 5];
        var currency = getCurrency(userCountryCode);
        var bundlePrice = selectedBundle.price;
        var smsPriceEstimate = NO_ESTIMATE;
        var smsVolumeEstimate = NO_ESTIMATE;
        if (thisCountryVatRate) {
            bundlePrice = selectedBundle.price * (100 + thisCountryVatRate) / 100;
        }
        window.$.each($routingData['routes'], function (index, value) {
            if (value.id === '2') {
                route2Average = value.averageCredits;
            }
        });
        if (route2Average) {
            smsVolumeEstimate = roundTotalMessages(selectedBundle.credits / route2Average).toFixed(0);
            smsPriceEstimate = (selectedBundle.price / smsVolumeEstimate * 100).toFixed(decimalPlaces)
                + currencyLookup[currency].subunit_symbol;
        }
        window.$('#num-smses').html(smsVolumeEstimate + "*");
        window.$('#sms-cost').html(smsPriceEstimate);
        window.$('#package-cost').html(currencyLookup[currency].baseunit_symbol + bundlePrice.toFixed(decimalPlaces));
        window.$('#sms-cost-vat-label').html('Excl. VAT');
        window.$('#package-cost-vat-label').html(thisCountryVatRate ? 'Incl. VAT' : '');
        if (smsPriceEstimate === NO_ESTIMATE || smsVolumeEstimate === NO_ESTIMATE) { //text must be smaller when 'no estimate' is displayed
            window.$('#num-smses').removeClass("option-numbes");
            window.$('#sms-cost').removeClass("option-numbes");
            window.$('#num-smses').addClass("no-estimate");
            window.$('#sms-cost').addClass("no-estimate");
        }
        else {
            window.$('#num-smses').removeClass("no-estimate");
            window.$('#sms-cost').removeClass("no-estimate");
            window.$('#num-smses').addClass("option-numbes");
            window.$('#sms-cost').addClass("option-numbes");
        }
        if (!thisCountryVatRate) {
            window.$('#sms-cost-vat-label').css('color', 'transparent');
        }
        else {
            window.$('#sms-cost-vat-label').css('color', '#FFF');
        }
    }
    pricing.updateSelectedPackageDetails = updateSelectedPackageDetails;
    function roundTotalMessages(total) {
        if (total > 10000) {
            return Math.ceil(total / 100) * 100;
        }
        else if (total > 1000) {
            return Math.ceil(total / 10) * 10;
        }
        else {
            return total;
        }
    }
    function updateNetworksTable() {
        clearNetworksTable();
        var networkArray = getDisplayNetworks();
        var networkCount = networkArray.length;
        var displayCount = 3;
        if (networkCount < 3) {
            displayCount = networkCount;
        }
        window.$.each(networkArray, function (index, networkValue) {
            if (index < displayCount) {
                addNetworkTableRows(networkValue);
            }
        });
        if (networkCount > 3) {
            addMoreNetworksAction(networkCount - 3);
        }
    }
    //This method strips out elements that have the name 'Unassigned Prefixes'
    function getDisplayNetworks() {
        var networks = new Array();
        window.$.each($routingData['networks'], function (index, networkValue) {
            if (networkValue && networkValue.name !== 'Unassigned Prefixes') {
                networks.push(networkValue);
            }
        });
        return networks;
    }
    function onShowMoreNetworksSelected() {
        window.$('#networkButtonRow').remove();
        var networkCount = $routingData['networks'].length;
        var filteredNetworks = $routingData['networks'].filter(function( obj ) {
            return obj.name !== 'Unassigned Prefixes';
        });
        window.$.each(filteredNetworks, function (index, networkValue) {
            if (index >= 3 && networkValue) {
                addNetworkTableRows(networkValue);
            }
        });
        addShowLessNetworksAction();
    }
    function onShowLessNetworksSelected() {
        updateNetworksTable();
    }
    function addNetworkTableRows(networkValue) {
        window.$.each(networkValue.routes, function (index2, networkRoute) {
            if (networkRoute.id === '2') {
                createNetworkTableRowHtml(networkValue.name, networkRoute.credits.toFixed(2));
            }
        });
    }
    function createNetworkTableRowHtml(networkName, credits) {
        window.$('#routing-table').append('<tr><td class="table-content text-center phone-networks">' + networkName +
            '</td><td class="default table-content table-last-col"><span>' + credits + '</span></td></tr>');
    }
    function addMoreNetworksAction(moreNetworksCount) {
        window.$('#routing-table').append('<tr id="networkButtonRow"><td class="text-center more-networks" colspan="2"><a id="networkButton">' + moreNetworksCount
            + ' More Networks<i class="fas fa-arrow-right more-network-arrow" style="width:14px; height:14px;"></i></a></td></tr>');
        window.$("#networkButton").click(function () {
            onShowMoreNetworksSelected();
        });
    }
    function addShowLessNetworksAction() {
        window.$('#routing-table').append('<tr id="networkButtonRow"><td class="text-center more-networks" colspan="2"><a id="networkButton">'
            + 'Show Less Networks<i class="fas fa-arrow-right more-network-arrow" style="width:14px; height:14px;"></i></a></td></tr>');
        window.$("#networkButton").click(function () {
            onShowLessNetworksSelected();
        });
    }
    function clearNetworksTable() {
        window.$('#routing-table').empty();
    }
    function clearGlobalCoverageTable() {
        window.$('#coverage-content').empty();
    }
    function populateGlobalCoverageSection(coverageData) {
        clearGlobalCoverageTable();
        window.$.each(coverageData, function (index, countryData) {
            createCoverageTableForCountry(countryData);
        });
    }
    pricing.populateGlobalCoverageSection = populateGlobalCoverageSection;
    function createCoverageTableForCountry(countryData) {
        var homeCountry = window.$("#country_selector").countrySelect("getSelectedCountryData");
        var isSouthAfrica = homeCountry.iso2 === 'za';
        window.$('#coverage-content').append('<br>');
        window.$('#coverage-content').append('<h4>' + countryData.name + ' +' + countryData.phoneCode + '</h4>');
        window.$('#coverage-content').append('<p></p>');
        var html = '<table><thead><tr>'
            + '<th class="table-content text-center network-tab-head">Network Name</th>'
            + '<th class="default table-content">MCC</th>'
            + '<th class="default table-content">MNC</th>';
        if (isSouthAfrica) {
            html = html + '<th class="default table-content">Standard Credits</th>';
        }
        else {
            html = html + '<th class="default table-content">Economy Credits</th>'
                + '<th class="default table-content">Standard Credits</th>'
                + '<th class="default table-content table-last-col">Premium Credits</th>';
        }
        html = html + '</th></tr></thead><tbody>';
        html = html + createCoverageTableRows(countryData, isSouthAfrica);
        window.$('#coverage-content').append(html);
        window.$('#coverage-content').append('</tbody></table>');
    }
    function createCoverageTableRows(countryData, isSouthAfrica) {
        var html = "";
        window.$.each(countryData.networks, function (index, networkData) {
            html = html + '<tr>'
                + '<td class="table-content text-center phone-networks">' + networkData.name + '</td>'
                + '<td class="default table-content table-last-col">' + countryData.mcc + '</td>'
                + '<td class="default table-content table-last-col">' + networkData.mnc + '</td>'
                + createRoutesHtml(networkData, isSouthAfrica)
                + '</tr>';
        });
        return html;
    }
    function createRoutesHtml(networkData, isSouthAfrica) {
        var html = "";
        var start_route = 1;
        var end_route = 3;
        if (isSouthAfrica) {
            start_route = 2;
            end_route = 2;
        }
        var _loop_1 = function (i) {
            var has_route = 0;
            window.$.each(networkData.routes, function (index, routeData) {
                if (routeData["id"] == i) {
                    html = html + '<td class="default table-content table-last-col">' + routeData.credits + '</td>';
                    has_route = 1;
                }
            });
            if (!has_route) {
                // Avoid producing table with missing cells, which could cause credits to show up in wrong column:
                html = html + '<td></td>';
            }
        };
        for (var i = start_route; i <= end_route; i++) {
            _loop_1(i);
        }
        return html;
    }
    //in Pricing page
    function setCoverageLinks() {
        var selected = window.$("#country_selector").countrySelect("getSelectedCountryData");
        window.$('.coverage-download-link').attr('href', './../coverage/full-coverage.php?creditsHoldingCurrency=' + getCurrency(selected.iso2));
        setFullCoverageLink(selected);
    }
    pricing.setCoverageLinks = setCoverageLinks;
    function setFullCoverageLink(homeCountry) {
        if (homeCountry === void 0) { homeCountry = window.$.cookie("customerCountry"); }
        window.$('.full-pricing-link').attr('href', '/pricing/all/?creditsHoldingCurrency=' + getCurrency(homeCountry.iso2));
    }
    pricing.setFullCoverageLink = setFullCoverageLink;
})(pricing || (pricing = {}));
