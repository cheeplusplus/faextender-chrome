/* FAExtender base */

if (!faextender) { var faextender = {}; }

faextender.Base = {
	// Determine if a page matches the location
	checkLocation: function(doc, allowed) {
		var loc = doc.location;
		if (!loc) return false;
		
		if (!(allowed instanceof Array)) {
			allowed = [allowed];
		}
		
		// Check each allowed path
		for (var i = 0; i < allowed.length; i++) {
			var path = allowed[i];
			if (loc.pathname.indexOf(path) == 0) return true;
		}
		
		return false;
	},

	// Wrap xpath handling
	getXPath: function(doc, path) {
		return doc.evaluate(path, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	},

	// Log an error
	logError: function(msg) {
		console.log("FAExtender error: " + msg);
	},
	logException: function(err) {
		faextender.Base.logError(err.name + " error @ line " + err.lineNumber + ":\r\n" + err.message);
	},
	debugMsg: function(msg, obj) {
		console.log("FAExtender debug: " + msg);
		
		if (obj) console.log(obj);
	},

	// List of functions to call
	targets: [],
	
	// Register a function to call on page load
	registerTarget: function(callback, locations) {
		if (callback == null) {
			faextender.Base.logError("Callback registered was null");
			return;
		}
		
		faextender.Base.targets.push({ "callback": callback, "locations": locations });
	},

	// Fired when an individual page/tab loads
	onPageLoad: function(doc) {
		var targets = faextender.Base.targets;
			
		for (var i = 0; i < targets.length; i++) {
			if (faextender.Base.checkLocation(doc, targets[i].locations)) {
				targets[i].callback(doc);
			}
		}
	}
}

$(document).bind("DOMContentLoaded", function() {
	faextender.Base.onPageLoad(document);
});