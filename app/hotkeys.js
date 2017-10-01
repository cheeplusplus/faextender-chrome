/* Hotkey support */

const StorageLoader = require("./loaderclasses").StorageLoader;

class Hotkeys extends StorageLoader {
    constructor() {
        super("hotkeys_enabled");
    }

    init() {
        if (!this.options.hotkeys_enabled) return;

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


module.exports = (base) => {
    base.registerTarget(() => new Hotkeys(), ["/view/", "/full/"]);
};
