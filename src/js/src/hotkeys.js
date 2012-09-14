/* Hotkey support */

if (!faextender) { faextender = {}; }

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
		// Previous link
		var prevClick = function() {
			var href = jQuery("a.prev").attr("href");
			if (href) doc.location.href = href;
		}
		
		jQuery(doc).bind("keydown", "left", prevClick);
		jQuery(doc).bind("keydown", "p", prevClick);
		
		// Next
		var nextClick = function() {
			var href = jQuery("a.next").attr("href");
			if (href) doc.location.href = href;
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

faextender.Base.registerTarget(faextender.Hotkeys.Bind, "/view/");