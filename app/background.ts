/* FAExtender background code */

import browser from "webextension-polyfill";
import { Logger } from "./logger";
import { MessageActions, MessageType } from "./common";

browser.runtime.onMessage.addListener(async (request: MessageType) => {
    if (request.action === MessageActions.downloader.save) {
        let conflictAction: import("webextension-polyfill").Downloads.FilenameConflictAction = "prompt";
        let manifest = browser.runtime.getManifest();
        if (manifest.browser_specific_settings?.gecko) {
            // Prompt isn't supported on Firefox
            conflictAction = "overwrite";
        }

        try {
            await browser.downloads.download({
                "url": request.options.url,
                "filename": request.options.filename,
                "saveAs": false,
                conflictAction
            });
            return { "message": "Download complete" };
        } catch (err) {
            Logger.error("Got download error", err);
            return { "message": "Error downloading", "err": err.message };
        }
    } else if (request.action === MessageActions.downloader.exists) {
        try {
            const downloads = await browser.downloads.search({ "url": request.options });
            let exists = false;
            if (downloads && downloads.length > 0) {
                for (const download of downloads) {
                    if (download.exists) {
                        exists = true;
                        break;
                    }
                }
            }

            return exists;
        } catch (err) {
            Logger.error("Got download search error", err);
            return false;
        }
    }
});
