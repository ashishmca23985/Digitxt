// http://stackoverflow.com/a/5639455
window.readCookie = function (k,r){return(r=RegExp('(^|; )'+encodeURIComponent(k)+'=([^;]*)').exec(document.cookie))?r[2]:null;}

$(function() {
    $('pre code[class|="language"]').each(function() {
        hljs.highlightBlock(this);
    });

    // not exactly easy to add CSS classes to HTML tables in markdown...
    $('body .bulksms-content table').addClass('table table-condensed table-bordered');

    // CSS doesn't allow this type of selector
    // the idea is to remove the bottom margin of a http headers code
    // block when it is immediately followed by another highlightjs block
    // and adjust the border radius of both blocks so that it doesn't look kak
    $('pre:has(>code.language-http)').filter(':has(+pre>code.hljs)')
        .css({
            borderBottom: 'none',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            marginBottom: 0
        })
        .next()
            .css({
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0
            });

    // replace generic «EAPI base URL» with user-specific base url
    var bulksms_legacy_site = readCookie('bulksms_legacy_site');
    if (bulksms_legacy_site) {
        bulksms_legacy_site = decodeURIComponent(bulksms_legacy_site);

        // replace inline EAPI base URLs
        findAndReplaceDOMText($('body').get(0), {
            find: new RegExp('«EAPI URL»', 'g'),
            replace: bulksms_legacy_site + '/eapi'
        });

        // select the correct code sample download
        var site = null;
        site = site || /bulksms.2way.co.za/.test(bulksms_legacy_site) && 'za';
        site = site || /bulksms.co.uk/.test(bulksms_legacy_site) && 'uk';
        site = site || /bulksms.vsms.net/.test(bulksms_legacy_site) && 'int';
        site = site || /usa.bulksms.com/.test(bulksms_legacy_site) && 'usa';
        site = site || /bulksms.de/.test(bulksms_legacy_site) && 'de';
        site = site || /bulksms.com.es/.test(bulksms_legacy_site) && 'es';
        site = site || /community.bulksms.com/.test(bulksms_legacy_site) && 'zacomm';
        site = site || /community.bulksms.co.uk/.test(bulksms_legacy_site) && 'ukcomm';
        site = site || 'int'; // default to downloading int code samples

        $('a.code-sample-download').each(function() {
            $(this).attr('href', site + '-' + $(this).attr('href'));
        });
    }
    else {
        findAndReplaceDOMText($('body').get(0), {
            find: new RegExp('«EAPI URL»', 'g'),
            replace: function(portion, match) {
                return $('<a>')
                          .attr('href', 'https://www1.bulksms.com/home/profile?post_auth_url=/home/profile')
                          .attr('target', '_blank')
                          .attr('title', 'Please login to see your correct EAPI URL')
                          .text('«EAPI URL»')
                          .get(0);
            }
        });

        // default to downloading int code samples
        $('a.code-sample-download').each(function() {
            $(this).attr('href', 'int-' + $(this).attr('href'));
        });
    }

    // any a-href that has a download class gets a download attribute
    $('a.download').each(function() {
        $(this).attr('download', $(this).attr('href'));
    });
});