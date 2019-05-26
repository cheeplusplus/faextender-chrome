// Load all the page injection scripts

import * as jQuery from "jquery";
import { Base } from "./base";
import hookDownloader from "./downloader";
import hookHighlighter from "./highlighter";
import hookHotkeys from "./hotkeys";
import hookOpenInTabs from "./open_in_tabs";
import hookStoryInGdocs from "./story_in_gdocs";

const base = new Base();
hookDownloader(base);
hookHighlighter(base);
hookHotkeys(base);
hookOpenInTabs(base);
hookStoryInGdocs(base);

jQuery(document).bind("DOMContentLoaded", () => {
    base.onPageLoad();
});
