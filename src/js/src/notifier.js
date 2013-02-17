/* Notifier icon */

if (!faextender) { var faextender = {}; }

faextender.Notifier = {
	Start: function() {
		chrome.browserAction.onClicked.addListener(faextender.Notifier.OnClick);
		chrome.storage.sync.get("notifier_delay", faextender.Notifier.VarCheck);
		chrome.storage.onChanged.addListener(faextender.Notifier.VarChanged);
	},
	
	VarCheck: function(obj) {
		faextender.Notifier.Options = obj;
		faextender.Notifier.Init();
	},
	
	VarChanged: function(changes, namespace) {
		if (namespace == "sync") {
			var delayChange = changes["notifier_delay"];
			if (delayChange) {
				faextender.Notifier.Options.notifier_delay = delayChange.newValue;
				faextender.Notifier.ChangeAlarmDuration();
			}
		}
	},

	Options: null,
	MatchRegex: new RegExp("<li class=\"noblock\"><a href=\"/controls/messages/\">(\\d+) messages</a>"),

	Init: function() {
		chrome.alarms.onAlarm.addListener(faextender.Notifier.OnAlarm);
		faextender.Notifier.ChangeAlarmDuration();
	},

	ChangeAlarmDuration: function() {
		try {
			chrome.alarms.clear("notifier_check");
		}
		catch (e) { /* No way to avoid an exception */ }

		var delay = faextender.Notifier.Options.notifier_delay;
		if ((!delay) || (delay < 1)) {
			faextender.Notifier.UpdateBadge("");
			return;
		};

		chrome.alarms.create("notifier_check", { periodInMinutes: delay });
		faextender.Notifier.UpdateCheck();
	},

	OnAlarm: function(alarm) {
		if (alarm.name == "notifier_check") {
			faextender.Notifier.UpdateCheck();
		}
	},

	UpdateCheck: function() {
		$.get("https://www.furaffinity.net/controls/messages/", function(data) {
			var result = data.match(faextender.Notifier.MatchRegex);
			if (result[1]) {
				faextender.Notifier.UpdateBadge(result[1]);
			}
		});
	},

	UpdateBadge: function(val) {
		chrome.browserAction.setBadgeText({ "text": val });
	},

	OnClick: function(tab) {
		window.open("https://www.furaffinity.net/");
	}
}

faextender.Notifier.Start();