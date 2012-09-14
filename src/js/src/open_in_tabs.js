/* Open in tabs */

if (!faextender) { faextender = {}; }

faextender.OpenInTabs = {
	Bind: function(doc) {
		chrome.storage.sync.get(["openintabs_unreverse", "openintabs_delay", "openintabs_delaytime"], function(obj) {
			faextender.OpenInTabs.VarCheck(doc, obj);
		});
	},
	
	VarCheck: function(doc, obj) {
		faextender.OpenInTabs.Options = obj;
		faextender.OpenInTabs.Init(doc);
	},
	
	Options: null,
	
	Init: function(doc) {
		// Collect all view page links
		var tabLinks = jQuery("a[href*='/view/']");
		
		// Exit if no valid links were found so we don't inject
		if (tabLinks.length == 0) { return; }

		// Flip the page link order (oldest to newest by default)
		if (!faextender.OpenInTabs.Options.openintabs_unreverse) {
			tabLinks = jQuery.makeArray(tabLinks);
			tabLinks.reverse();
		}

		// Check to make sure if the injection point already exists
		var openLink = jQuery("#__ext_fa_opentabs");
		if (openLink.length > 0) { return; }

		// Create Open in Tabs link
		var openLink = jQuery("<a>").attr("id", "__ext_fa_opentabs").attr("href", "javascript:void(0);").text("Open images in tabs");

		// Find our tabs open injection point (submissions then general)
		var tabsOpenInsertPos = jQuery("#messagecenter-submissions div.actions");
		if (tabsOpenInsertPos.length > 0) {
			tabsOpenInsertPos.first().after(openLink);
		}
		else {
			// Injection paths to test
			var testPaths = [
				"id('gallery')/table[2]/tbody/tr/td/table/tbody/tr[1]/td[2]", // Gallery
				"id('scraps')/table[2]/tbody/tr/td/table/tbody/tr[1]/td[2]", // Scraps
				"id('favorites')/table[2]/tbody/tr/td/table/tbody/tr[1]/td[2]" // Favorites
			];
			
			// Iterate through each test path until we find a valid one
			for (var i = 0; i < testPaths.length; i++) {
				tabsOpenInsertPos = jQuery(faextender.Base.getXPath(doc, testPaths[i]));
				if (tabsOpenInsertPos.length > 0) break;
			}
			
			// Abort if not found
			if (tabsOpenInsertPos.length == 0) {
				faextender.Base.logError("Bad tabs open xpath, aborting");
				return;
			}
			
			tabsOpenInsertPos.append("<br /><br />").append(openLink);
		}
		
		openLink.click(function() {
			// Find the links, use a delay if configured
			var queueTimeDelay = faextender.OpenInTabs.Options.openintabs_delaytime;
			var useQueueTimer = !faextender.OpenInTabs.Options.openintabs_nodelay;
			if (!queueTimeDelay) queueTimeDelay = 2;
			
			var queueTime = queueTimeDelay;
			
			if (queueTimeDelay < 1) {
				useQueueTimer = false;
			}

			for (var i = 0; i < tabLinks.length; i++) {
				thisLink = tabLinks[i];
				if (useQueueTimer) {
					faextender.OpenInTabs.OpenTab(chrome.extension.getURL("tabdelay.html") + "?url=" + encodeURI(thisLink) + "&delay=" + queueTime);
					queueTime += queueTimeDelay;
				}
				else {
					faextender.OpenInTabs.OpenTab(thisLink);
				}
			}
		});
	},
	
	OpenTab: function(url) {
		/*chrome.tabs.create({
			"url": url,
			"active": false
		}, null);*/
		// Do this for now to avoid having to create a background page
		window.open(url);
	}
}

faextender.Base.registerTarget(faextender.OpenInTabs.Bind, ["/gallery/", "/scraps/", "/favorites/", "/msg/submissions/"]);