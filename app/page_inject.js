// Load all the page injection scripts

const Base = require("./base");
const base = new Base();

require("./downloader")(base);
require("./highlighter")(base);
require("./hotkeys")(base);
require("./open_in_tabs")(base);
require("./story_in_gdocs")(base);


jQuery(document).bind("DOMContentLoaded", () => {
    base.onPageLoad(document);
});
