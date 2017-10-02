/* FAExtender background code */

const browser = require("webextension-polyfill");
const Logger = require("./logger");
const message_actions = require("./common").message_actions;


browser.runtime.onMessage.addListener((request, sender, response) => {
    if (request.action === message_actions.downloader.save) {
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
    } else if (request.action === message_actions.downloader.exists) {
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
