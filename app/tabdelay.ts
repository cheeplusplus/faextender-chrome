/* Open in tabs delay */

let countdownURL = "";
let countdownTimer = 0;
let urlLabel: JQuery<HTMLAnchorElement> = null;
let delayLabel: JQuery<HTMLSpanElement> = null;

function tabDelayOnLoad() {
    // URL parameters:
    //  url - Destination URL (encoded)
    //  delay - Time to count down

    const urlParams = new URLSearchParams(window.location.search);
    countdownURL = urlParams.get("url");
    countdownTimer = parseInt(urlParams.get("delay"), 10);
    urlLabel = jQuery("#redirURL");
    delayLabel = jQuery("#redirTime");

    if (!countdownURL || countdownURL === "false") {
        urlLabel.text("Error: Invalid URL");
        return;
    } else if (!countdownTimer) {
        // Instead of aborting with an error, redirect immediately
        countdownTimer = 0;
    }

    urlLabel.text(countdownURL);
    urlLabel.attr("href", countdownURL);

    tabDelayCountdown();
}

function tabDelayCountdown() {
    if (countdownTimer > 0) {
        document.title = "FurAffinity Redirecting in " + countdownTimer;
        delayLabel.text(`in ${countdownTimer} second${countdownTimer === 1 ? "" : "s"}.`);

        countdownTimer -= 1;
        setTimeout(tabDelayCountdown, 1000);
    } else {
        window.location.href = countdownURL;
    }
}

jQuery(function() {
    tabDelayOnLoad();
});
