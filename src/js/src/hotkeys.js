/* Hotkey support */

if (!faextender) { var faextender = {}; }

faextender.Hotkeys = {
	Bind: function(doc) {
		chrome.storage.sync.get("hotkeys_enabled", function(obj) {
			faextender.Hotkeys.VarCheck(doc, obj);
		});
	},
	
	VarCheck: function(doc, obj) {
		if (obj.hotkeys_enabled) faextender.Hotkeys.Init(doc);
	},
	
	Init: function(doc) {
		var prevLink = null;
		var prevHref = null;		
		var nextLink = null;
		var nextHref = null;

		// Check for view page
		var miniTarget = jQuery(".minigalleries .minigallery-title");
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
		var prevClick = function() {
			if (prevHref) doc.location.href = prevHref;
		}
		
		jQuery(doc).bind("keydown", "left", prevClick);
		jQuery(doc).bind("keydown", "p", prevClick);
		
		// Next
		var nextClick = function() {
			if (nextHref) doc.location.href = nextHref;
		}
		
		jQuery(doc).bind("keydown", "right", nextClick);
		jQuery(doc).bind("keydown", "n", nextClick);
		
		// Favorite
		jQuery(doc).bind("keydown", "f", function() {
			var href = jQuery("a[href^='/fav/']:contains('+Add to Favorites')").attr("href");
			if (href) doc.location.href = href;
		});
		
		// Save
		jQuery(doc).bind("keydown", "s", function() {
			jQuery("a#__ext_fa_imgdl").click();
		});
	}
}

faextender.Base.registerTarget(faextender.Hotkeys.Bind, ["/view/", "/full/"]);