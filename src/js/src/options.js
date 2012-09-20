function loadOptions() {
	chrome.storage.sync.get(["openintabs_nodelay", "openintabs_unreverse", "hotkeys_enabled", "highlighter_keys"], optionsLoaded);
}

function optionsLoaded(obj) {
	$("#delaytabs").prop("checked", !obj.openintabs_nodelay);
	$("#reversetabs").prop("checked", !obj.openintabs_unreverse);
	$("#hotkeys").prop("checked", obj.hotkeys_enabled);
	loadHighlight(obj.highlighter_keys);
}

function bindOptions() {
	jQuery("#delaytabs").change(function(e) {
		chrome.storage.sync.set( { "openintabs_nodelay": !$(e.target).prop("checked") } );
	});
	
	jQuery("#reversetabs").change(function(e) {
		chrome.storage.sync.set( { "openintabs_unreverse": !$(e.target).prop("checked") } );
	});
	
	jQuery("#hotkeys").change(function(e) {
		chrome.storage.sync.set( { "hotkeys_enabled": $(e.target).prop("checked") } );
	});
	
	jQuery("#highlight_add").click(addNewHighlight);

	jQuery("#reset").click(function() {
		chrome.storage.sync.clear(function() {
			window.location.reload();
		});
	});
}

var highlight_state;
var highlight_translate = { "submission": "Submission", "journal": "Journal", "title": "Title", "username": "Username" };

function loadHighlight(keys) {
	if (!keys) keys = [];
	highlight_state = keys;

	// Get tbody
	var tableBody = jQuery("table#highlight_table tbody");

	// Clear tbody rows
	tableBody.empty();

	jQuery.each(keys, function(i, item) {
		var row = jQuery("<tr>");
		row.data("id", i+1);

		jQuery("<td>").text(highlight_translate[item.type]).appendTo(row);
		jQuery("<td>").text(highlight_translate[item.field]).appendTo(row);
		jQuery("<td>").text(item.text).appendTo(row);
		var colorCol = jQuery("<td>").text(item.color).css("background-color", item.color).appendTo(row);
		var removeCol = jQuery("<td>").appendTo(row);
		jQuery("<input>").attr("type", "button").click(removeHighlight).appendTo(removeCol).val("-");

		tableBody.append(row);
	});
}

function saveHighlight() {
	// Enforce data integrety
	if (!(highlight_state instanceof Array)) return;

	// Save to storage
	chrome.storage.sync.set( { "highlighter_keys": highlight_state }, function() {
		loadHighlight(highlight_state);
	});
}

function addNewHighlight() {
	var tableFooter = jQuery("table#highlight_table tfoot");
	var type = jQuery("select#highlight_type option:selected", tableFooter).val();
	var field = jQuery("select#highlight_field option:selected", tableFooter).val();
	var text = jQuery("input#highlight_text", tableFooter).val();
	var color = jQuery("input#highlight_color", tableFooter).val();

	var newObj = { "type": type, "field": field, "text": text, "color": color };

	highlight_state.push(newObj);
	saveHighlight();
}

function removeHighlight(e) {
	var button = jQuery(e.target);
	var row = button.parents("tr");
	var id = row.data("id");
	if (id <= 0) return;

	highlight_state.splice(id-1, 1);
	saveHighlight();
}

jQuery(document).ready(function() {
	loadOptions();
	bindOptions();
});