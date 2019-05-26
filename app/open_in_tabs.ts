/* Open in tabs */

import { browser } from "webextension-polyfill-ts";
import { Logger } from "./logger";
import { StorageLoader } from "./loaderclasses";
import { SettingsKeys } from "./common";


class OpenInTabs extends StorageLoader {
    constructor() {
        super(SettingsKeys.openintabs.unreverse, SettingsKeys.openintabs.no_delay, SettingsKeys.openintabs.delay_time);
    }

    init() {
        // Collect all view page links
        const tabLinks = jQuery.makeArray(jQuery<HTMLAnchorElement>("figure figcaption a[href*='/view/']"));

        // Exit if no valid links were found so we don't inject
        if (tabLinks.length === 0) return;

        // Flip the page link order (oldest to newest by default)
        if (!this.options[SettingsKeys.openintabs.unreverse]) {
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
            const queueTimeDelay = this.options[SettingsKeys.openintabs.delay_time] || 2;
            let useQueueTimer = !this.options[SettingsKeys.openintabs.no_delay];

            // Start with the delay
            let queueTime = queueTimeDelay;

            if (queueTimeDelay < 1) {
                useQueueTimer = false;
            }

            tabLinks.forEach((thisLink) => {
                if (useQueueTimer) {
                    window.open(browser.extension.getURL("tabdelay.html") + "?url=" + encodeURI(thisLink.href) + "&delay=" + queueTime);
                    queueTime += queueTimeDelay;
                } else {
                    window.open(thisLink.href);
                }
            });
        });
    }
}

export default function(base: import("./base").Base) {
    base.registerTarget(() => new OpenInTabs(), ["/gallery/", "/scraps/", "/favorites/", "/msg/submissions/"]);
}
