/* Open in tabs */

import browser from "webextension-polyfill";
import { Logger } from "./logger";
import { StorageLoader } from "./loaderclasses";
import { SettingsKeys } from "./common";
import { getSiteVersion } from "./common_fa";
import { getInjectionElement, InjectionPoint } from "./_injection_list";


class OpenInTabs extends StorageLoader {
    constructor() {
        super(SettingsKeys.openintabs.unreverse, SettingsKeys.openintabs.no_delay, SettingsKeys.openintabs.delay_time);
    }

    init() {
        // Collect all view page links
        const tabLinks = jQuery.makeArray(getInjectionElement("standardSubmissionLink"));

        // Exit if no valid links were found so we don't inject
        if (tabLinks.length === 0) return;

        // Flip the page link order (oldest to newest by default)
        if (!this.options[SettingsKeys.openintabs.unreverse]) {
            tabLinks.reverse();
        }

        // Check to make sure if the injection point already exists
        const openLinkCheck = jQuery("#__ext_fa_opentabs");
        if (openLinkCheck.length > 0) return;

        // Find our tabs open injection point
        let openLink: JQuery<HTMLAnchorElement>;
        if (getSiteVersion() === "beta") {
            openLink = this.injectBeta();
        } else {
            openLink = this.injectClassic();
        }

        if (!openLink) {
            // Couldn't inject
            return;
        }

        // re-query because multiple links may have been created >:C
        jQuery("#__ext_fa_opentabs").on("click", () => {
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
                    window.open(browser.runtime.getURL("tabdelay.html") + "?url=" + encodeURI(thisLink.href) + "&delay=" + queueTime);
                    queueTime += queueTimeDelay;
                } else {
                    window.open(thisLink.href);
                }
            });
        });
    }

    injectClassic() {
        // Create Open in Tabs link
        const openDiv = jQuery("<div>").attr("style", "text-align: center; margin-top: 1em;");
        const openLink = jQuery<HTMLAnchorElement>("<a>")
            .attr("id", "__ext_fa_opentabs")
            .attr("href", "javascript:void(0);")
            .text("Open images in tabs")
            .appendTo(openDiv);

        // Try pages in order
        const tabsOpenInsertPos = this.getTestPath();
        if (tabsOpenInsertPos.length === 0) {
            // Abort if not found
            Logger.error("Bad tabs open selector, aborting");
            return;
        }

        tabsOpenInsertPos.append(openDiv);
        return openLink;
    }

    injectBeta() {
        // Create Open in Tabs link
        const openDiv = jQuery("<div>").addClass("aligncenter");
        const openLink = jQuery<HTMLAnchorElement>("<a>")
            .attr("id", "__ext_fa_opentabs")
            .attr("href", "javascript:void(0);")
            .addClass("button")
            .addClass("standard")
            .text("Open images in tabs")
            .appendTo(openDiv);

        // Try pages in order
        const tabsOpenInsertPos = this.getTestPath();
        if (tabsOpenInsertPos.length === 0) {
            // Abort if not found
            Logger.error("Bad tabs open selector, aborting");
            return;
        }

        tabsOpenInsertPos.append(openDiv);
        return openLink;
    }

    private getTestPath(): JQuery<HTMLElement> | null {
        const testPaths: InjectionPoint[] = [
            "insertInTabsInsertPositionSubmissions", // Submissions
            "insertInTabsInsertPositionGallery", // Gallery/scraps
            "insertInTabsInsertPositionFavorites" // Favorites
        ];
        return testPaths.map((p) => getInjectionElement(p)).find((p) => p.length > 0) || null;
    }
}

export default function (base: import("./base").Base) {
    base.registerTarget(() => new OpenInTabs(), ["/gallery/", "/scraps/", "/favorites/", "/msg/submissions/"]);
}
