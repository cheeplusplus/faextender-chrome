import jQuery from "jquery";

export function getSiteVersion(): "classic" | "beta" {
    const staticPath = jQuery("body").data("static-path");
    if (staticPath === "/themes/beta") {
        return "beta";
    }

    return "classic";
}

export function getSubmissionId(pathname: string = window.location.pathname): number {
    return parseInt(pathname.split("/")[2]);
}
