/* Open in tabs delay */

// http://stackoverflow.com/questions/901115/get-query-string-values-in-javascript/901144#901144
function queryString(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    const regexS = "[\\?&]" + name + "=([^&#]*)";
    const regex = new RegExp(regexS);
    const results = regex.exec(window.location.href);
    if (results === null) {
        return "";
    } else {
        return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
}


let countdownURL = "";
let countdownTimer = 0;
let urlLabel = null;
let delayLabel = null;

function tabDelayOnLoad() {
	// URL parameters:
	//  url - Destination URL (encoded)
	//  delay - Time to count down

    countdownURL = queryString("url");
    countdownTimer = queryString("delay");
    urlLabel = document.getElementById("redirURL");
    delayLabel = document.getElementById("redirTime");

    if (countdownURL === "false") {
        urlLabel.innerHTML = "Error: Invalid URL";
        return;
    } else if ((countdownTimer === "false") || (countdownTimer < 1)) {
		// Instead of aborting with an error, redirect immediately
        countdownTimer = 0;
    }

    urlLabel.innerHTML = countdownURL;
    urlLabel.href = countdownURL;

    tabDelayCountdown();
}

function tabDelayCountdown() {
    if (countdownTimer > 0) {
        document.title = "FurAffinity Redirecting in " + countdownTimer;
        delayLabel.innerHTML = "in " + countdownTimer;

        if (countdownTimer === 1) {
            delayLabel.innerHTML += " second.";
        }		else {
            delayLabel.innerHTML += " seconds.";
        }

        countdownTimer -= 1;
        setTimeout(tabDelayCountdown, 1000);
    }	else {
        window.location.href = countdownURL;
    }
}

jQuery(document).ready(function() {
    tabDelayOnLoad();
});
