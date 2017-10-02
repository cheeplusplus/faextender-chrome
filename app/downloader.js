/* Download support */

const browser = require("webextension-polyfill");
const StorageLoader = require("./loaderclasses").StorageLoader;
const Logger = require("./logger");
const common = require("./common");


class Downloader extends StorageLoader {
    constructor() {
        super(common.settings_keys.downloader.subfolder, common.settings_keys.downloader.artist_subdirs);
    }

    trimString(val) {
        return val.replace(/^\s*/, "").replace(/\s*$/, "");
    }

    getDownloadLink() {
        const downloadLink = jQuery("#page-submission div.actions>b>a:contains('Download')");
        if (downloadLink.length === 0) {
            // No download at all
            Logger.error("Could not find download link");
            return null;
        }

        return downloadLink;
    }

    // Handle retrieving download URL
    getDownloadUrl() {
        const downloadLink = this.getDownloadLink();
        return downloadLink[0].href;
    }

    getArtistLink() {
        const artistLink = jQuery("#page-submission table.maintable td.cat>a[href*='/user/']");
        if (artistLink.length === 0) {
            // Can't find artist link
            Logger.error("Could not find artist selector");
            return null;
        }

        return artistLink;
    }

    // Handle retrieving download URL
    getDownloadUrlComponents() {
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

        const fname = decodeURI(path.substr(path.lastIndexOf("/") + 1));
        const fext = fname.substr(fname.lastIndexOf(".") + 1);

        return {"url": url, "path": path, "artist": artist, "pretty_artist": prettyArtist, "filename": fname, "extension": fext};
    }

    init() {
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
        const downloadInsertPos = jQuery("#page-submission .maintable:first th.cat");
        if (downloadInsertPos.length === 0) {
            // Can't find either
            Logger.error("Bad download inject selector, aborting");
            return;
        }

        // Inject text
        downloadLink = jQuery("<a>").attr("href", "javascript:void(0);").attr("id", "__ext_fa_imgdl").text("Download now");
        downloadSpan = jQuery("<span>").attr("id", "__ext_fa_imgdlsp").append(downloadLink);
        downloadInsertPos.prepend(jQuery("<span>").append("[").append(downloadSpan).append("]"));

        const chgMsg = function(text, alt) {
            downloadSpan.html(text);
            downloadSpan.attr("title", alt);
        };

        if (!components.extension) {
            chgMsg("Error: No extension", "This file does not have an file extension. Please save it manually.");
            return;
        }

        const configureDownload = () => {
            // Handle link onclick event
            downloadLink.click((e) => {
                Downloader.save(this.options, components, downloadSpan);
            });
        };

        // Check if the download exists
        browser.runtime.sendMessage({"action": common.message_actions.downloader.exists, "options": components.url}).then((exists) => {
            if (exists === true) {
                chgMsg("File already exists.");
                return;
            }

            configureDownload();
        }).catch((err) => {
            configureDownload();
        });
    }

    static save(options, components, downloadSpan) {
        const fname = components.filename;
        const url = components.url;

        let dir = options[common.settings_keys.downloader.subfolder] || "";
        if (dir.trim() !== "") {
            dir = dir + "/";
        }

        // Pretty artist name support
        let artist = components.artist;
        /* if (options.download_prettyartist) {
            artist = components.pretty_artist;
        }*/

        if (options[common.settings_keys.downloader.artist_subdirs]) {
            dir = `${dir}${artist}/`;
        }

        const filename = `${dir}${fname}`;

        browser.runtime.sendMessage({"action": common.message_actions.downloader.save, "options": {url, filename}}).then((msg) => {
            downloadSpan.text(msg.message);

            if (msg.err) {
                downloadSpan.attr("title", msg.err);
            }
        }).catch((err) => {
            downloadSpan.text("Error").attr("title", err.message);
            Logger.error("Got background communication error", err);
        });

        downloadSpan.text("Download started");
    }
}


module.exports = (base) => {
    base.registerTarget(() => new Downloader(), ["/view/", "/full/"]);
};
