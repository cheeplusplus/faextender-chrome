/* eslint no-console: "off", @typescript-eslint/no-explicit-any: "off" */

/** Logger */
class LoggerWrapper {
    /** Log an error message */
    error(...args: any[]) {
        console.warn("FAExtender error", ...args);
    }

    /** Log a debug message */
    debug(...args: any[]) {
        console.log("FAExtender debug", ...args);
    }
}

export const Logger = new LoggerWrapper();
