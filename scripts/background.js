"use strict";

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.type == 'GET_URL') {
		getTabUrl();

		if (localStorage['tab_url'] !== undefined) sendResponse({url: localStorage['tab_url']});
	}
});

function getTabUrl() {
	chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
		if (tabs[0] !== undefined) localStorage['tab_url'] = tabs[0].url;
	});
}