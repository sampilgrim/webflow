// Replace production domain names with current staging 
// domain in all the links with the "replace-host" attribute.

 $(document).ready(function() {

    // var staging_hostname = "nashmaritime.webflow.io"
    var live_hostname = "nashmaritime.com"
    var current_hostname = "https://" + window.location.hostname;

    /* if on staging */
    if (current_hostname.match(/webflow\.io/)) {

        var live_regex = new RegExp(live_hostname);

        $('a').each(function(){
          	var old_url = $(this).attr('href');
            var old_URL = new URL(old_url, current_hostname);

            if (old_URL.hostname.match(live_regex)) {
                var new_URL = new URL(old_url);
                new_URL.hostname = document.location.hostname;
                $(this).attr('href', new_URL.href)
                console.log(old_url + " changed to " + $(this).attr('href'));
            }

    	});
    }
 });