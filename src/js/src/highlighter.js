/* Journal highlight */

if (!faextender) { var faextender = {}; }

faextender.Highlighter = {
	BindJournals: function(doc) {
		faextender.Highlighter.Bind(doc, "journal");
	},

	BindSubmissions: function(doc) {
		faextender.Highlighter.Bind(doc, "submission");
	},

	Bind: function(doc, page) {
		chrome.storage.sync.get("highlighter_keys", function(obj) {
			faextender.Highlighter.VarCheck(doc, obj, page);
		});
	},
	
	VarCheck: function(doc, obj, page) {
		faextender.Highlighter.Options = obj;
		faextender.Highlighter.Init(doc, page);
	},
	
	/*
		Highlighter_keys should have the following structure:
		[{
			"type": "journal|submission"
			"field": "title|username",
			"text": "matchtext",
			"color": "matchcolor"
		}]
	*/
	Options: null,

	// Pages and tests to run for matching
	Match: {
		"journal": {
			"match": "#messages-journals ul.message-stream li",
			"tests": {
				"user": "a[href^='/user/']",
				"title": "a[href^='/journal/']"
			}
		},
		"submission": {
			"match": "#messages-form .messagecenter b",
			"tests": {
				"user": "a[href^='/user/']",
				"title": "span"
			}
		}
	},
	
	Init: function(doc, page) {
		// Exit if no keys are set
		var keys = faextender.Highlighter.Options.highlighter_keys;
		if (!keys) return;
		keys = keys.filter(function(f) { return (f.type == page); })
		if (!keys) return;

		var matchSet = faextender.Highlighter.Match[page];
		if (!matchSet) return;

		// Iterate through each row
		jQuery(matchSet.match).each(function(i, row) {
			// Evaluate each test
			jQuery.each(matchSet.tests, function(field, match) {
				// Perform the test
				return faextender.Highlighter.EvaluateRow(row, keys, field, match);
			});
		});
	},

	EvaluateRow: function(row, list, type, match) {
		// Get match target text
		var target = $(match, row).text().toLowerCase();

		// Iterate through each list element
		for (var i = 0; i < list.length; i++) {
			var item = list[i];

			// Test for match
			if (target.indexOf(item.text.toLowerCase()) > -1) {
				// Set background color
				$(row).css("background-color", item.color);
				return false;
			}
		}

		// No matches
		return true;
	}
}

faextender.Base.registerTarget(faextender.Highlighter.BindJournals, "/msg/others/");
faextender.Base.registerTarget(faextender.Highlighter.BindSubmissions, "/msg/submissions/");