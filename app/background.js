/* FAExtender background code */

const Logger = require("./logger");
const browser = require("webextension-polyfill");


browser.runtime.onMessage.addListener((request, sender, response) => {
    if (request.action === "save_file") {
        let conflictAction = "prompt";
        if (window.location.protocol === "moz-extension:") {
            // Prompt isn't supported on Firefox
            conflictAction = "overwrite";
        }

        return browser.downloads.download({
            "url": request.options.url,
            "filename": request.options.filename,
            "saveAs": false,
            conflictAction
        }).then(() => {
            return {"message": "Download complete"};
        }).catch((err) => {
            Logger.error("Got download error", err);
            return {"message": "Error downloading", "err": err.message};
        });
    } else if (request.action === "find_download_exists") {
        return browser.downloads.search({"url": request.options}).then((downloads) => {
            let exists = false;
            if (downloads && downloads.length > 0) {
                for (let download of downloads) {
                    if (download.exists) {
                        exists = true;
                        break;
                    }
                }
            }

            return exists;
        }).catch((err) => {
            Logger.error("Got download search error", err);
            return false;
        });
    }
});
