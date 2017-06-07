const browser = require("webextension-polyfill");
const Logger = require("./logger");

/**
 * Standard injector
 */
class StandardLoader {
    /**
     * Bind a document to the class
     * @param {Document} doc - Page document
     */
    Bind(doc) {
        return Promise.resolve().then(() => {
            this.Init(doc);
        });
    }

    /**
     * Initialize the binding. Override this
     * @param {Document} doc - Page document
     */
    Init(doc) {
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
     * @param {Document} doc - Page document
     */
    Bind(doc) {
        return browser.storage.sync.get(this.storageVars).then((obj) => {
            this.Options = obj;
            this.Init(doc);
        });
    }
}


module.exports = {StandardLoader, StorageLoader};
