"use strict";

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.type === 'GET_URL') {
		getTabUrl();

		if (localStorage['tab_url'] !== undefined) sendResponse({url: localStorage['tab_url']});
	}

	if (message.type === 'UNMUTE_TAB') {
		console.log('UNMUTE_TAB');
		muteCurrentTab(false);
	}

	if (message.type === 'MUTE_TAB') {
		console.log('MUTE_TAB');
		muteCurrentTab(true);
	}
});

function getTabUrl() {
	chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
		if (tabs[0] !== undefined) {
			localStorage['tab_url'] = tabs[0].url;
		}
	});
}

function muteCurrentTab(value) {
	chrome.tabs.query({active: true}, function (tabs) {
		if (tabs[0] !== undefined) {
			var tab = tabs[0];

			console.log('muted: ' + value);

			if (tab.url.indexOf('youtube.com') !== -1) {
				chrome.tabs.update(tab.id, {muted: value});
			}
		}
	});
}

