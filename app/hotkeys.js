/* Hotkey support */

const StorageLoader = require("./loaderclasses").StorageLoader;

class Hotkeys extends StorageLoader {
	constructor() {
		super("hotkeys_enabled");
	}

	Init(doc) {
		if (!this.Options.hotkeys_enabled) return;

		let prevLink, prevHref, nextLink, nextHref;

		// Check for view page
		const miniTarget = jQuery(".minigalleries .minigallery-title");
		if (miniTarget.length > 0) {
			// View page
			prevLink = miniTarget.prev().find("a");
			nextLink = miniTarget.next().find("a");
		}

		if (prevLink && prevLink.length > 0) {
			prevHref = prevLink[0].href;
		}
		if (prevLink && nextLink.length > 0) {
			nextHref = nextLink[0].href;
		}

		// Previous link
		const prevClick = () => {
			if (prevHref) doc.location.href = prevHref;
		};
		
		jQuery(doc).bind("keydown", "left", prevClick);
		jQuery(doc).bind("keydown", "p", prevClick);
		
		// Next
		const nextClick = () => {
			if (nextHref) doc.location.href = nextHref;
		};
		
		jQuery(doc).bind("keydown", "right", nextClick);
		jQuery(doc).bind("keydown", "n", nextClick);
		
		// Favorite
		jQuery(doc).bind("keydown", "f", function() {
			const href = jQuery("a[href^='/fav/']:contains('+Add to Favorites')").attr("href");
			if (href) doc.location.href = href;
		});
		
		// Save
		jQuery(doc).bind("keydown", "s", function() {
			jQuery("a#__ext_fa_imgdl").click();
		});
	}
}


module.exports = (base) => {
	base.registerTarget(() => new Hotkeys(), ["/view/", "/full/"]);
};
