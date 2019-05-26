/* FAExtender base */

import { Logger } from "./logger";
import { StandardLoader } from "./loaderclasses";

/**
 * Base injector control
 */
export class Base {
    private targets: { callback: () => StandardLoader; locations: string[] }[] = [];

    /**
     * Determine if a page matches the location
     * @param allowed Allowed paths
     * @return Returns true if location matches, false if not
     */
    checkLocation(allowed: string[]): boolean {
        const loc = document.location;
        if (!loc) return false;

        // Check each allowed path
        for (let i = 0; i < allowed.length; i++) {
            const path = allowed[i];
            if (loc.pathname.indexOf(path) === 0) return true;
        }

        return false;
    }

    /**
     * Register a function to call on page load
     * @param callback Callback to execute
     * @param locations Locations to test against
     */
    registerTarget(callback: () => StandardLoader, locations: string[]): void {
        if (!callback) {
            Logger.error("Callback registered was null");
            return;
        }

        this.targets.push({ "callback": callback, "locations": locations });
    }

    /**
     * Fired when an individual page/tab loads
     */
    onPageLoad(): void {
        this.targets.forEach((target) => {
            if (this.checkLocation(target.locations)) {
                target.callback().bind().catch((err) => {
                    Logger.error(err);
                });
            }
        });
    }
}
