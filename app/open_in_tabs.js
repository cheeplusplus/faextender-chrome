/* Open in tabs */

const Logger = require("./logger");
const StorageLoader = require("./loaderclasses").StorageLoader;
const browser = require("webextension-polyfill");


class OpenInTabs extends StorageLoader {
    constructor() {
        super("openintabs_unreverse", "openintabs_delay", "openintabs_delaytime");
    }

    init() {
		// Collect all view page links
        let tabLinks = jQuery("figure figcaption a[href*='/view/']");

		// Exit if no valid links were found so we don't inject
        if (tabLinks.length === 0) return;
        tabLinks = jQuery.makeArray(tabLinks);

		// Flip the page link order (oldest to newest by default)
        if (!this.options.openintabs_unreverse) {
            tabLinks.reverse();
        }

		// Check to make sure if the injection point already exists
        const openLinkCheck = jQuery("#__ext_fa_opentabs");
        if (openLinkCheck.length > 0) return;

		// Create Open in Tabs link
        const openLink = jQuery("<a>").attr("id", "__ext_fa_opentabs").attr("href", "javascript:void(0);").text("Open images in tabs");

		// Find our tabs open injection point
		// Try submissions first
        let tabsOpenInsertPos = jQuery("#messagecenter-submissions div.actions");
        if (tabsOpenInsertPos.length > 0) {
            tabsOpenInsertPos.first().after(openLink);
        } else {
			// Try other pages
            const testPaths = [
                "#page-galleryscraps div.page-options", // Gallery/scraps
                "#favorites td.cat>table.maintable>tbody>tr>td:nth(1)" // Favorites
            ];

			// Iterate through each test path until we find a valid one
            for (let i = 0; i < testPaths.length; i++) {
                tabsOpenInsertPos = jQuery(testPaths[i]);
                if (tabsOpenInsertPos.length > 0) break;
            }

			// Abort if not found
            if (tabsOpenInsertPos.length === 0) {
                Logger.error("Bad tabs open selector, aborting");
                return;
            }

            tabsOpenInsertPos.append("<br /><br />").append(openLink);
        }

        openLink.click(() => {
			// Find the links, use a delay if configured
            const queueTimeDelay = this.options.openintabs_delaytime || 2;
            let useQueueTimer = !this.options.openintabs_nodelay;

			// Start with the delay
            let queueTime = queueTimeDelay;

            if (queueTimeDelay < 1) {
                useQueueTimer = false;
            }

            tabLinks.forEach((thisLink) => {
                if (useQueueTimer) {
                    window.open(browser.extension.getURL("tabdelay.html") + "?url=" + encodeURI(thisLink) + "&delay=" + queueTime);
                    queueTime += queueTimeDelay;
                }				else {
                    window.open(thisLink);
                }
            });
        });
    }
}


module.exports = (base) => {
    base.registerTarget(() => new OpenInTabs(), ["/gallery/", "/scraps/", "/favorites/", "/msg/submissions/"]);
};
