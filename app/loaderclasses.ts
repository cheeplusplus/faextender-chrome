import browser from "webextension-polyfill";
import { SettingKeyKeys, SettingsKeyTypes } from "./common";

/** Standard injector */
export abstract class StandardLoader {
    /** Bind a document to the class */
    async bind(): Promise<void> {
        await this.init();
    }

    /** Initialize the binding. Override this */
    abstract init(): Promise<void> | void;
}


/** Storage injector */
export abstract class StorageLoader extends StandardLoader {
    protected storageVars: SettingKeyKeys[];
    protected options: SettingsKeyTypes;

    constructor(...storageVars: SettingKeyKeys[]) {
        super();
        this.storageVars = storageVars;
    }

    /** Bind a document to the class */
    async bind() {
        const obj = await browser.storage.sync.get(this.storageVars);
        this.options = (obj as SettingsKeyTypes);
        await this.init();
    }
}
