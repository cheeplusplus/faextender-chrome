/* Story in GDocs */

if (!faextender) { var faextender = {}; }

faextender.StoryInGDocs = {
	Bind: function(doc) {
		// Reject if already injected
		if (jQuery("#__ext_fa_gdoclink").length > 0) return;
		
		// Find injection location
		var downloadLink = jQuery("#submission div.actions b a:contains('Download')");
		if (downloadLink.length == 0) {
			// No download at all
			faextender.Base.logError("Could not find download link, aborting");
			return;
		}
		
		// Get and fix URL
		var url = downloadLink.attr("href");
		
		// Fix protocol-less URLs
		if (url.substr(0, 2) == "//") {
			url = doc.location.protocol + url;
		}
		
		// Make sure this is a story
		if (url.indexOf("stories") < 0) return;
		
		// Get the parent <b>
		var dLinkContainer = downloadLink.parent();
		
		// Append new link
		jQuery("<span> | <b><a id=\"__ext_fa_gdoclink\" href=\"https://docs.google.com/viewer?url=" + url + "\">View in GDocs</a></b></span>").insertAfter(dLinkContainer);
	}
}

faextender.Base.registerTarget(faextender.StoryInGDocs.Bind, ["/view/", "/full/"]);