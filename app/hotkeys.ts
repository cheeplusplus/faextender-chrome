/* Hotkey support */

require("jquery.hotkeys");

import { StorageLoader } from "./loaderclasses";
import { SettingsKeys } from "./common";


class Hotkeys extends StorageLoader {
    constructor() {
        super(SettingsKeys.hotkeys.enabled);
    }

    init() {
        if (!this.options[SettingsKeys.hotkeys.enabled]) return;

        let prevLink: JQuery<HTMLAnchorElement>;
        let prevHref: string;
        let nextLink: JQuery<HTMLAnchorElement>;
        let nextHref: string;

        // Check for view page
        const miniTarget = jQuery(".minigalleries .minigallery-title");
        if (miniTarget.length > 0) {
            // View page
            prevLink = miniTarget.prev().find("a") as JQuery<HTMLAnchorElement>;
            nextLink = miniTarget.next().find("a") as JQuery<HTMLAnchorElement>;
        }

        if (prevLink && prevLink.length > 0) {
            prevHref = prevLink[0].href;
        }
        if (prevLink && nextLink.length > 0) {
            nextHref = nextLink[0].href;
        }

        // Previous link
        const prevClick = () => {
            if (prevHref) document.location.href = prevHref;
        };

        jQuery(document).bind("keydown", "left", prevClick);
        jQuery(document).bind("keydown", "p", prevClick);

        // Next
        const nextClick = () => {
            if (nextHref) document.location.href = nextHref;
        };

        jQuery(document).bind("keydown", "right", nextClick);
        jQuery(document).bind("keydown", "n", nextClick);

        // Favorite
        jQuery(document).bind("keydown", "f", function() {
            const href = jQuery("a[href^='/fav/']:contains('+Add to Favorites')").attr("href");
            if (href) document.location.href = href;
        });

        // Save
        jQuery(document).bind("keydown", "s", function() {
            jQuery("a#__ext_fa_imgdl").click();
        });
    }
}

export default function(base: import("./base").Base) {
    base.registerTarget(() => new Hotkeys(), ["/view/", "/full/"]);
}
