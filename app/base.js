/* FAExtender base */

const Logger = require("./logger");

/**
 * Base injector control
 */
class Base {
	constructor() {
		this.targets = [];
	}

	// 
	/**
	 * Determine if a page matches the location
	 * @param {Document} doc - Page document
	 * @param {Array<String>} allowed - Allowed paths
	 * @return {Boolean} Returns true if location matches, false if not
	 */
	checkLocation(doc, allowed) {
		const loc = doc.location;
		if (!loc) return false;
		
		// Check each allowed path
		for (let i = 0; i < allowed.length; i++) {
			const path = allowed[i];
			if (loc.pathname.indexOf(path) == 0) return true;
		}
		
		return false;
	}

	/**
	 * Register a function to call on page load
	 * @param {Function} callback - Callback to execute
	 * @param {Array<String>} locations - Locations to test against
	 */
	registerTarget(callback, locations) {
		if (!callback) {
			Logger.error("Callback registered was null");
			return;
		}
		
		this.targets.push({"callback": callback, "locations": locations});
	}

	/**
	 * Fired when an individual page/tab loads
	 * @param {Document} doc - Page document
	 */
	onPageLoad(doc) {
		this.targets.forEach((target) => {
			if (this.checkLocation(doc, target.locations)) {
				target.callback().Bind(doc).catch((err) => {
					Logger.error(err);
				});
			}
		});
	}
}


module.exports = Base;
