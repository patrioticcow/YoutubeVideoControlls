"use strict";

function volumeHud(volume) {
	var width = volume;
	var hud   = '<span style="margin-right:10px;display:inline-block;background: rgba(255, 255, 255, 0.75);color: transparent;width:' + width + 'px">.</span><span>' + volume + '%</span>';

	if (document.getElementById('volumeHud')) document.getElementById('volumeHud').innerHTML = hud;
}

function setSecondaryVolume(){

}

/**
 * listen to events from contentscript
 * set the volume and seek
 */
var tabUrl = null;
window.addEventListener("message", function (event) {
	if (event.source != window) return;

	var playerId = document.getElementById("movie_player");

	if (event.data.type && (event.data.type == "FROM_OPTIONS")) {
		setSecondaryVolume(event.data.value);
	}

	if (event.data.type && (event.data.type == "FROM_CONTENTSCRIPT_SEEK")) {
		if (event.data.key === 'seek') {
			if (playerId.hasOwnProperty('seekTo')) {
				playerId.seekTo(event.data.value);
			}
		}
	}

	if (event.data.type && (event.data.type == "FROM_CONTENTSCRIPT_VOLUME")) {
		if (event.data.key === 'volume') {
			if (playerId.hasOwnProperty('unMute')) {
				playerId.unMute();
			}
			if (playerId.hasOwnProperty('setVolume')) {
				volumeHud(event.data.value);
				playerId.setVolume(event.data.value);
			}
		}
	}

	if (event.data.type && (event.data.type == "FROM_CONTENTSCRIPT_URL")) {
		tabUrl = event.data.url.toString();
	}
}, false);

/**
 * for some reason i can't get the current seek time in the main() function
 * so i send it to the contentscript here
 * this pisses me the fuck off
 */

window.setInterval(function () {
	var playerId = document.getElementById("movie_player");
	if (playerId) {
		if (playerId.hasOwnProperty('getCurrentTime')) {
			window.postMessage({type: 'SEEK_FROM_PAGE', volume: 'not_needed', currentTime: playerId.getCurrentTime()}, "*");
		}
	}
}, 1000);

/**
 * get the initial volume and seek and send it to the content script
 * @param typeName
 */
function main(typeName) {
	var playerId = document.getElementById("movie_player");
	if (playerId) {
		if (playerId.hasOwnProperty('getVolume')) {
			var volume      = playerId.getVolume();
			var currentTime = playerId.getCurrentTime();

			addHud();
			volumeHud(volume);

			window.postMessage({type: typeName, volume: volume, currentTime: currentTime}, "*");
		}
	}
}

main("FROM_PAGE");

function addHud() {
	if (document.getElementById('volumeHud') === null) {
		document.getElementsByClassName('ytp-time-display')[0].insertAdjacentHTML('afterend', '<div class="ytp-time-display" id="volumeHud"></div>');
	}
}

// sometimes the url changes but does not reload the page
// and i have to resend the player stats
//setInterval(startInit, 5000);

function startInit() {
	if (tabUrl !== window.location.href) {
		console.log('startInit');
		window.postMessage({type: 'GET_URL'}, "*");
		main("FROM_PAGE");
	}
}
