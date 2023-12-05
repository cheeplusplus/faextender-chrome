/* Story in GDocs */

import { StandardLoader } from "./loaderclasses";
import { getInjectionElement } from "./_injection_list";
import { getSiteVersion } from "./common_fa";

class StoryInGDocs extends StandardLoader {
    init() {
        // Reject if already injected
        if (jQuery("#__ext_fa_gdoclink").length > 0) return;

        // Find injection location
        const injectionPoint = getInjectionElement("openInGDocsInsertPosition");
        if (injectionPoint.length === 0) {
            // No injection point
            return;
        }

        // Get download URL
        const url = this.getFullUrl();
        if (!url) {
            // No download link
            return;
        }

        if (getSiteVersion() === "beta") {
            this.injectBeta(injectionPoint, url);
        } else {
            this.injectClassic(injectionPoint, url);
        }
    }

    injectClassic(injectionPoint: JQuery<HTMLElement>, downloadUrl: string) {
        // Get the parent <b>
        const dLinkContainer = injectionPoint.parent();

        // Append new link
        jQuery("<span> | <b><a id=\"__ext_fa_gdoclink\" href=\"https://docs.google.com/viewer?url=" + encodeURI(downloadUrl) + "\">View in GDocs</a></b></span>").insertAfter(dLinkContainer);
    }

    injectBeta(injectionPoint: JQuery<HTMLElement>, downloadUrl: string) {
        // Get the target section
        const dLinkContainer = injectionPoint.parent().find("section.buttons");

        // Append new container
        const section = jQuery("<section>").addClass("buttons").insertAfter(dLinkContainer);
        const button = jQuery("<div>").addClass("download").appendTo(section);
        jQuery("<a>")
            .attr("id", "__ext_fa_gdoclink")
            .attr("href", "https://docs.google.com/viewer?url=" + encodeURI(downloadUrl))
            .text("View in GDocs")
            .appendTo(button);
    }

    private getFullUrl() {
        const downloadLink = getInjectionElement("downloadLink");

        // Get and fix URL
        let url = downloadLink.attr("href");

        // Fix protocol-less URLs
        if (url.substr(0, 2) === "//") {
            url = document.location.protocol + url;
        }

        // Make sure this is a story
        if (url.indexOf("stories") < 0) return;

        return url;
    }
}

export default function (base: import("./base").Base) {
    base.registerTarget(() => new StoryInGDocs(), ["/view/", "/full/"]);
}
