function loadOptions() {
	chrome.storage.sync.get(["openintabs_nodelay", "openintabs_unreverse", "hotkeys_enabled"], optionsLoaded);
}

function optionsLoaded(obj) {
	$("#delaytabs").prop("checked", !obj.openintabs_nodelay);
	$("#reversetabs").prop("checked", !obj.openintabs_unreverse);
	$("#hotkeys").prop("checked", obj.hotkeys_enabled);
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
	
	jQuery("#reset").click(function() {
		chrome.storage.sync.clear(function() {
			window.location.reload();
		});
	});
}

jQuery(document).ready(function() {
	loadOptions();
	bindOptions();
});