/* Download support */

import browser from "webextension-polyfill";
import { StorageLoader } from "./loaderclasses";
import { Logger } from "./logger";
import {
    SettingsKeys, MessageActions, MessageTypeDownloaderExists, SettingsKeyTypes, MessageTypeDownloaderSave,
    MessageTypeDownloaderSaveResponse
} from "./common";
import { getInjectionElement } from "./_injection_list";

interface Components {
    "url": string;
    "path": string;
    "artist": string;
    "pretty_artist": string;
    "filename": string;
    "extension": string;
}

class Downloader extends StorageLoader {
    constructor() {
        super(SettingsKeys.downloader.subfolder, SettingsKeys.downloader.artist_subdirs);
    }

    private static save(options: SettingsKeyTypes, components: Components, downloadSpan: JQuery<HTMLSpanElement>) {
        const fname = components.filename;
        const url = components.url;

        let dir = options[SettingsKeys.downloader.subfolder] || "";
        if (dir.trim() !== "") {
            dir = dir + "/";
        }

        // Pretty artist name support
        const artist = components.artist;
        /* if (options.download_prettyartist) {
            artist = components.pretty_artist;
        }*/

        if (options[SettingsKeys.downloader.artist_subdirs]) {
            dir = `${dir}${artist}/`;
        }

        const filename = `${dir}${fname}`;

        const msg: MessageTypeDownloaderSave = { "action": MessageActions.downloader.save, "options": { url, filename } };
        browser.runtime.sendMessage(msg).then((response: MessageTypeDownloaderSaveResponse) => {
            downloadSpan.text(response.message);

            if (response.err) {
                downloadSpan.attr("title", response.err);
            }
        }).catch((err) => {
            downloadSpan.text("Error").attr("title", err.message);
            Logger.error("Got background communication error", err);
        });

        downloadSpan.text("Download started");
    }

    async init() {
        // Get image URL
        const components = this.getDownloadUrlComponents();
        if (!components) return;

        // Set up ID links
        let downloadLink = jQuery("#__ext_fa_imgdl");
        let downloadSpan = jQuery("#__ext_fa_imgdlsp");

        // Check to make sure we haven't already injected
        if ((downloadLink.length > 0) || (downloadSpan.length > 0)) {
            return;
        }

        // Find our download text injection point
        const downloadInsertPos = getInjectionElement("downloadInsertPosition");
        if (downloadInsertPos.length === 0) {
            // Can't find either
            Logger.error("Bad download inject selector, aborting");
            return;
        }

        // Inject text
        downloadLink = jQuery("<a>").attr("href", "javascript:void(0);").attr("id", "__ext_fa_imgdl").text("Download now");
        downloadSpan = jQuery("<span>").attr("id", "__ext_fa_imgdlsp").append(downloadLink);
        downloadInsertPos.prepend(jQuery("<span>").append("[").append(downloadSpan).append("]"));

        const chgMsg = (text: string, alt?: string) => {
            downloadSpan.html(text);
            downloadSpan.attr("title", alt);
        };

        if (!components.extension) {
            chgMsg("Error: No extension", "This file does not have an file extension. Please save it manually.");
            return;
        }

        const configureDownload = () => {
            // Handle link onclick event
            downloadLink.on("click", () => {
                Downloader.save(this.options, components, downloadSpan);
            });
        };

        // Check if the download exists
        try {
            const msg: MessageTypeDownloaderExists = { "action": MessageActions.downloader.exists, "options": components.url };
            const exists = await browser.runtime.sendMessage(msg);
            if (exists === true) {
                chgMsg("File already exists.");
                return;
            }
        } finally {
            configureDownload();
        }
    }

    private getDownloadLink() {
        const downloadLink = getInjectionElement("downloadLink");
        if (downloadLink.length === 0) {
            // No download at all
            Logger.error("Could not find download link");
            return null;
        }

        return downloadLink;
    }

    private getArtistLink() {
        const artistLink = getInjectionElement("artistLink");
        if (artistLink.length === 0) {
            // Can't find artist link
            Logger.error("Could not find artist selector");
            return null;
        }

        return artistLink;
    }

    // Handle retrieving download URL
    private getDownloadUrlComponents(): Components {
        const downloadLink = this.getDownloadLink();
        if (!downloadLink || downloadLink.length === 0) {
            return null;
        }

        const components = downloadLink[0];

        const url = components.href;
        const path = components.pathname;

        if (!url || !path) {
            return null;
        }

        const artistLink = this.getArtistLink();
        if (!artistLink) {
            return null;
        }

        const artistPath = artistLink.attr("href");
        const artist = artistPath.replace("/user/", "").replace("/", "");
        const prettyArtist = artistLink.text();

        const fname = decodeURI(path.substring(path.lastIndexOf("/") + 1));
        const fext = fname.substring(fname.lastIndexOf(".") + 1);

        return { "url": url, "path": path, "artist": artist, "pretty_artist": prettyArtist, "filename": fname, "extension": fext };
    }
}

export default function (base: import("./base").Base) {
    base.registerTarget(() => new Downloader(), ["/view/", "/full/"]);
}
