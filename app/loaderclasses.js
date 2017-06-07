const browser = require("webextension-polyfill");
const Logger = require("./logger");

/**
 * Standard injector
 */
class StandardLoader {
    /**
     * Bind a document to the class
     * @return {Promise}
     */
    bind() {
        return Promise.resolve().then(() => {
            this.init();
        });
    }

    /**
     * Initialize the binding. Override this
     */
    init() {
        Logger.error("Base init called in loader");
    }
}


/**
 * Storage injector
 */
class StorageLoader extends StandardLoader {
    constructor(...storageVars) {
        super();
        this.storageVars = storageVars;
    }

    /**
     * Bind a document to the class
     * @return {Promise}
     */
    bind() {
        return browser.storage.sync.get(this.storageVars).then((obj) => {
            this.options = obj;
            this.init();
        });
    }
}


module.exports = {StandardLoader, StorageLoader};
