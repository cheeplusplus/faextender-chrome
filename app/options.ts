// FAExtender settings

import browser from "webextension-polyfill";
import {
    FetchedSettingsKeyTypes,
    HighlighterKey,
    HighlightTypes,
    HightlightFields,
    SettingsKeys,
    SettingsKeyTypes
} from "./common";
import { Logger } from "./logger";

async function loadOptions() {
    const keys = [
        SettingsKeys.openintabs.no_delay, SettingsKeys.openintabs.unreverse,
        SettingsKeys.hotkeys.enabled,
        SettingsKeys.highlighter.keys,
        SettingsKeys.downloader.subfolder, SettingsKeys.downloader.artist_subdirs
    ];

    const obj = (await browser.storage.sync.get(keys)) as FetchedSettingsKeyTypes;

    jQuery("#delaytabs").prop("checked", !obj.openintabs_nodelay);
    jQuery("#reversetabs").prop("checked", !obj.openintabs_unreverse);
    jQuery("#hotkeys").prop("checked", obj.hotkeys_enabled);
    jQuery("#savefolder").val(obj.save_folder);
    jQuery("#saveartistsubfolder").prop("checked", obj.save_subdirs);

    return loadHighlight(obj.highlighter_keys);
}

function setKey<T extends keyof SettingsKeyTypes>(key: T, value: SettingsKeyTypes[T]) {
    return browser.storage.sync.set({ [key]: value });
}

function bindOptions() {
    jQuery("#delaytabs").on("change", (e) => setKey(SettingsKeys.openintabs.no_delay, !jQuery(e.target).prop("checked")));
    jQuery("#reversetabs").on("change", (e) => setKey(SettingsKeys.openintabs.unreverse, !jQuery(e.target).prop("checked")));
    jQuery("#hotkeys").on("change", (e) => setKey(SettingsKeys.hotkeys.enabled, jQuery(e.target).prop("checked")));
    jQuery("#savefolder").on("change", (e) => setKey(SettingsKeys.downloader.subfolder, jQuery(e.target).val().toString()));
    jQuery("#saveartistsubfolder").on("change", (e) => setKey(SettingsKeys.downloader.artist_subdirs, jQuery(e.target).prop("checked")));
    jQuery("#highlight_add").on("click", addNewHighlight);
    jQuery("#reset").on("click", () => {
        browser.storage.sync.clear().then(() => {
            window.location.reload();
        });
    });
}

let highlightState: HighlighterKey[];
const highlightTranslate = { "submission": "Submission", "journal": "Journal", "title": "Title", "user": "Username" };

function loadHighlight(keys: HighlighterKey[]) {
    if (!keys) keys = [];
    highlightState = keys;

    // Get tbody
    const tableBody = jQuery("table#highlight_table tbody");

    // Clear tbody rows
    tableBody.empty();

    keys.forEach((item, i) => {
        const row = jQuery("<tr>");
        row.data("id", i + 1);

        jQuery("<td>").text(highlightTranslate[item.type]).appendTo(row);
        jQuery("<td>").text(highlightTranslate[item.field]).appendTo(row);
        jQuery("<td>").text(item.text).appendTo(row);
        jQuery("<td>").text(item.color).css("background-color", item.color).appendTo(row);
        const removeCol = jQuery("<td>").appendTo(row);
        jQuery("<input>").attr("type", "button").on("click", removeHighlight).appendTo(removeCol).val("-");

        tableBody.append(row);
    });
}

async function saveHighlight() {
    // Enforce data integrety
    if (!Array.isArray(highlightState)) return;

    // Save to storage
    await setKey(SettingsKeys.highlighter.keys, highlightState);
    loadHighlight(highlightState);
}

function addNewHighlight() {
    const tableFooter = jQuery("table#highlight_table tfoot");
    const type = jQuery("select#highlight_type option:selected", tableFooter).val() as HighlightTypes;
    const field = jQuery("select#highlight_field option:selected", tableFooter).val() as HightlightFields;
    const text = jQuery("input#highlight_text", tableFooter).val().toString();
    const color = jQuery("input#highlight_color", tableFooter).val().toString();

    highlightState.push({ type, field, text, color });
    return saveHighlight();
}

function removeHighlight(e: JQuery.ClickEvent<HTMLInputElement>) {
    const button = jQuery(e.target);
    const row = button.parents("tr");
    const id = row.data("id");
    if (id <= 0) return;

    highlightState.splice(id - 1, 1);
    return saveHighlight();
}

jQuery(document).on("ready", () => {
    (async function () {
        await loadOptions();
        bindOptions();
    })().catch((err) => {
        Logger.error("Got error processing options page", err);
    });
});
