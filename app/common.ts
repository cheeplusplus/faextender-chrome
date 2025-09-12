const StrictlySettings = <
    T extends { [k: string]: R },
    R extends keyof SettingsKeyTypes,
    Y
>(
    obj: T,
    x?: Y,
) => (x ? Object.assign(obj, x) : obj) as T & Y;

export interface SettingsKeyTypes {
    openintabs_nodelay: boolean;
    openintabs_unreverse: boolean;
    openintabs_delaytime: number;
    hotkeys_enabled: boolean;
    highlighter_keys: HighlighterKey[];
    save_folder: string;
    save_subdirs: boolean;
}

export type FetchedSettingsKeyTypes = { [key: string]: unknown } & SettingsKeyTypes;

export type SettingKeyKeys = keyof SettingsKeyTypes;

export const SettingsKeys = {
    "openintabs": StrictlySettings({
        "no_delay": "openintabs_nodelay",
        "unreverse": "openintabs_unreverse",
        "delay_time": "openintabs_delaytime"
    }),
    "hotkeys": StrictlySettings({
        "enabled": "hotkeys_enabled"
    }),
    "highlighter": StrictlySettings({
        "keys": "highlighter_keys"
    }),
    "downloader": StrictlySettings({
        "subfolder": "save_folder",
        "artist_subdirs": "save_subdirs"
    })
};

// Message actions

const StrictlyMessages = <
    T extends { [k: string]: R },
    R extends MessageTypes,
    Y
>(
    obj: T,
    x?: Y,
) => (x ? Object.assign(obj, x) : obj) as T & Y;

export type MessageTypes = "save_file" | "find_download_exists";

export const MessageActions = {
    "downloader": StrictlyMessages({
        "save": "save_file",
        "exists": "find_download_exists"
    })
};

export interface MessageTypeDownloaderSave {
    action: "save_file";
    options: {
        url: string;
        filename: string;
    };
}
export interface MessageTypeDownloaderSaveResponse {
    message: string;
    err?: string;
}

export interface MessageTypeDownloaderExists {
    action: "find_download_exists";
    options: string;
}
export type MessageTypeDownloaderExistsResponse = boolean;

export type MessageType = MessageTypeDownloaderSave | MessageTypeDownloaderExists;

// Highlight types

export type HighlightTypes = "submission" | "journal";
export type HightlightFields = "title" | "user";
export interface HighlighterKey {
    type: HighlightTypes;
    field: HightlightFields;
    text: string;
    color: string;
}
