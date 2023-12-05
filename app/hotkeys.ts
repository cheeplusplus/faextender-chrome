/* Hotkey support */

import "jquery.hotkeys";

import { StorageLoader } from "./loaderclasses";
import { SettingsKeys } from "./common";
import { getSubmissionId, getSiteVersion } from "./common_fa";
import { getInjectionPoint, getInjectionElement } from "./_injection_list";


class Hotkeys extends StorageLoader {
    constructor() {
        super(SettingsKeys.hotkeys.enabled);
    }

    init() {
        if (!this.options[SettingsKeys.hotkeys.enabled]) return;

        // Collect prev/next links
        let prevLink: JQuery<HTMLAnchorElement>;
        let nextLink: JQuery<HTMLAnchorElement>;

        if (getSiteVersion() === "beta") {
            // New layout is missing focal point, so figure it out by submission ID
            const miniTarget = jQuery(getInjectionPoint("miniGallery") + " a");
            if (miniTarget.length > 0) {
                const currentId = getSubmissionId();
                const allIds = miniTarget.toArray().map((d) => {
                    const href = jQuery(d).attr("href");
                    return getSubmissionId(href);
                }).sort();

                let prevId = -1;
                let nextId = -1;
                for (let index = 0; index < allIds.length; index++) {
                    const curId = allIds[index];
                    if (curId > currentId) {
                        nextId = curId;
                        break;
                    } else {
                        prevId = curId;
                    }
                }

                if (prevId > -1) {
                    prevLink = miniTarget.parent().find(`a[href*='${prevId}']`) as JQuery<HTMLAnchorElement>;
                }
                if (nextId > -1) {
                    nextLink = miniTarget.parent().find(`a[href*='${nextId}']`) as JQuery<HTMLAnchorElement>;
                }
            }
        } else {
            // Pull from the minigallery centered around the title
            const miniTarget = jQuery(getInjectionPoint("miniGallery") + " .minigallery-title");
            if (miniTarget.length > 0) {
                prevLink = miniTarget.next().find("a") as JQuery<HTMLAnchorElement>;
                nextLink = miniTarget.prev().find("a") as JQuery<HTMLAnchorElement>;
            }
        }

        // Previous link
        let prevHref: string;
        if (prevLink && prevLink.length > 0) {
            prevHref = prevLink[0].href;
        }

        const prevClick = () => {
            if (prevHref) document.location.href = prevHref;
        };

        jQuery(document).on("keydown", null, "left", prevClick);
        jQuery(document).on("keydown", null, "p", prevClick);

        // Next link
        let nextHref: string;
        if (nextLink && nextLink.length > 0) {
            nextHref = nextLink[0].href;
        }

        const nextClick = () => {
            if (nextHref) document.location.href = nextHref;
        };

        jQuery(document).on("keydown", null, "right", nextClick);
        jQuery(document).on("keydown", null, "n", nextClick);

        // Favorite
        jQuery(document).on("keydown", null, "f", function () {
            const href = getInjectionElement("addFavoriteLink").attr("href");
            if (href) document.location.href = href;
        });

        // Save
        jQuery(document).on("keydown", null, "s", function () {
            jQuery("a#__ext_fa_imgdl").trigger("click");
        });
    }
}

export default function (base: import("./base").Base) {
    base.registerTarget(() => new Hotkeys(), ["/view/", "/full/"]);
}
