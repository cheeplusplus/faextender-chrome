/* Story in GDocs */

const StandardLoader = require("./loaderclasses").StandardLoader;

class StoryInGDocs extends StandardLoader {
	Init(doc) {
		// Reject if already injected
		if (jQuery("#__ext_fa_gdoclink").length > 0) return;

		// Find injection location
		const downloadLink = jQuery("#page-submission div.actions>b>a:contains('Download')");
		if (downloadLink.length == 0) {
			// No download at all
			return;
		}

		// Get and fix URL
		let url = downloadLink.attr("href");

		// Fix protocol-less URLs
		if (url.substr(0, 2) == "//") {
			url = doc.location.protocol + url;
		}

		// Make sure this is a story
		if (url.indexOf("stories") < 0) return;

		// Get the parent <b>
		const dLinkContainer = downloadLink.parent();

		// Append new link
		jQuery("<span> | <b><a id=\"__ext_fa_gdoclink\" href=\"https://docs.google.com/viewer?url=" + encodeURI(url) + "\">View in GDocs</a></b></span>").insertAfter(dLinkContainer);
	}
}


module.exports = (base) => {
	base.registerTarget(() => new StoryInGDocs(), ["/view/", "/full/"]);
};
