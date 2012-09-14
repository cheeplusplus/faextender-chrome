/* Story in GDocs */

if (!faextender) { faextender = {}; }

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
		
		// Make sure this is a story
		if (downloadLink.attr("href").indexOf("stories") < 0) return;
		
		// Get the parent <b>
		var dLinkContainer = downloadLink.parent();
		
		// Append new link
		jQuery("<span> | <b><a id=\"__ext_fa_gdoclink\" href=\"https://docs.google.com/viewer?url=" + downloadLink.attr("href") + "\">View in GDocs</a></b></span>").insertAfter(dLinkContainer);
	}
}

faextender.Base.registerTarget(faextender.StoryInGDocs.Bind, "/view/");