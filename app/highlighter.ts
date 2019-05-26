/* Journal highlight */

import { StorageLoader } from "./loaderclasses";
import { SettingsKeys, HighlighterKey, HighlightTypes, HightlightFields } from "./common";

interface HighlightArguments {
    name: HighlightTypes;
    match: string;
    tests: {
        [K in HightlightFields]: string
    };
}

class Highlighter extends StorageLoader {
    constructor(protected args: HighlightArguments) {
        super(SettingsKeys.highlighter.keys);
    }

    init() {
        // Exit if no keys are set
        let keys = this.options[SettingsKeys.highlighter.keys];
        if (!keys) return;
        keys = keys.filter((f) => f.type === this.args.name);
        if (!keys) return;

        // Iterate through each row
        jQuery(this.args.match).each((i, row) => {
            // Evaluate each test
            jQuery.each(this.args.tests, (field, match) => {
                // Perform the test
                return this.evaluateRow(row, keys, field, match);
            });
        });
    }

    evaluateRow(row: HTMLElement, list: HighlighterKey[], type: HightlightFields, match: string) {
        // Get match target text
        const target = jQuery(match, row).text().toLowerCase();

        // Iterate through each list element
        for (let i = 0; i < list.length; i++) {
            const item = list[i];

            // Test for match
            if (target.indexOf(item.text.toLowerCase()) > -1) {
                // Set background color
                jQuery(row).css("background-color", item.color);
                return false;
            }
        }

        // No matches
        return true;
    }
}

class JournalHighlighter extends Highlighter {
    constructor() {
        super({
            "name": "journal",
            "match": "#messages-journals ul.message-stream li",
            "tests": {
                "user": "a[href^='/user/']",
                "title": "a[href^='/journal/']"
            }
        });
    }
}

class SubmissionHighlighter extends Highlighter {
    constructor() {
        super({
            "name": "submission",
            "match": "section.gallery figure",
            "tests": {
                "user": "a[href^='/user/']",
                "title": "a[href^='/view/']"
            }
        });
    }
}

export default function(base: import("./base").Base) {
    base.registerTarget(() => new JournalHighlighter(), ["/msg/others/"]);
    base.registerTarget(() => new SubmissionHighlighter(), ["/msg/submissions/"]);
}
