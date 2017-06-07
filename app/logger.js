/* eslint no-console: "off"*/

/**
 * Logger
 */
class Logger {
    /**
     * Log an error message
     * @param {*} args
     */
    error(...args) {
        console.warn("FAExtender error", ...args);
    }

    /**
     * Log a debug message
     * @param {*} args
     */
    debug(...args) {
        console.log("FAExtender debug", ...args);
    }
}

module.exports = new Logger();
