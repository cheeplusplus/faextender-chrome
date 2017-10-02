// FAExtender settings

const browser = require("webextension-polyfill");
const settings_keys = require("./common").settings_keys;


function loadOptions() {
    const keys = [
        settings_keys.openintabs.no_delay, settings_keys.openintabs.unreverse,
        settings_keys.hotkeys.enabled,
        settings_keys.highlighter.keys,
        settings_keys.downloader.subfolder, settings_keys.downloader.artist_subdirs
    ];

    return browser.storage.sync.get(keys).then((obj) => {
        jQuery("#delaytabs").prop("checked", !obj.openintabs_nodelay);
        jQuery("#reversetabs").prop("checked", !obj.openintabs_unreverse);
        jQuery("#hotkeys").prop("checked", obj.hotkeys_enabled);
        jQuery("#savefolder").val(obj.save_folder);
        jQuery("#saveartistsubfolder").prop("checked", obj.save_subdirs);
        return loadHighlight(obj.highlighter_keys);
    });
}

function setKey(key, value) {
    return browser.storage.sync.set({[key]: value});
}

function bindOptions() {
    jQuery("#delaytabs").change((e) => setKey(settings_keys.openintabs.no_delay, !jQuery(e.target).prop("checked")));
    jQuery("#reversetabs").change((e) => setKey(settings_keys.openintabs.unreverse, !jQuery(e.target).prop("checked")));
    jQuery("#hotkeys").change((e) => setKey(settings_keys.hotkeys.enabled, jQuery(e.target).prop("checked")));
    jQuery("#savefolder").change((e) => setKey(settings_keys.downloader.subfolder, jQuery(e.target).val()));
    jQuery("#saveartistsubfolder").change((e) => setKey(settings_keys.downloader.artist_subdirs, jQuery(e.target).prop("checked")));
    jQuery("#highlight_add").click(addNewHighlight);
    jQuery("#reset").click(() => {
        browser.storage.sync.clear().then(() => {
            window.location.reload();
        });
    });
}

let highlightState;
const highlightTranslate = {"submission": "Submission", "journal": "Journal", "title": "Title", "user": "Username"};

function loadHighlight(keys) {
    if (!keys) keys = [];
    highlightState = keys;

    // Get tbody
    const tableBody = jQuery("table#highlight_table tbody");

    // Clear tbody rows
    tableBody.empty();

    keys.forEach((item, i) => {
        const row = jQuery("<tr>");
        row.data("id", i+1);

        jQuery("<td>").text(highlightTranslate[item.type]).appendTo(row);
        jQuery("<td>").text(highlightTranslate[item.field]).appendTo(row);
        jQuery("<td>").text(item.text).appendTo(row);
        jQuery("<td>").text(item.color).css("background-color", item.color).appendTo(row);
        const removeCol = jQuery("<td>").appendTo(row);
        jQuery("<input>").attr("type", "button").click(removeHighlight).appendTo(removeCol).val("-");

        tableBody.append(row);
    });
}

function saveHighlight() {
    // Enforce data integrety
    if (!Array.isArray(highlightState)) return Promise.resolve();

    // Save to storage
    return setKey(settings_keys.highlighter.keys, highlightState).then(() => loadHighlight(highlightState));
}

function addNewHighlight() {
    const tableFooter = jQuery("table#highlight_table tfoot");
    const type = jQuery("select#highlight_type option:selected", tableFooter).val();
    const field = jQuery("select#highlight_field option:selected", tableFooter).val();
    const text = jQuery("input#highlight_text", tableFooter).val();
    const color = jQuery("input#highlight_color", tableFooter).val();

    highlightState.push({type, field, text, color});
    return saveHighlight();
}

function removeHighlight(e) {
    const button = jQuery(e.target);
    const row = button.parents("tr");
    const id = row.data("id");
    if (id <= 0) return;

    highlightState.splice(id-1, 1);
    return saveHighlight();
}

jQuery(document).ready(() => {
    loadOptions();
    bindOptions();
});
