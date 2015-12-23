"use strict";

function volumeHud(volume) {
	var controls      = document.getElementsByClassName('ytp-chrome-controls');
	var controlsWidth = controls[0].offsetWidth;
	var width         = controlsWidth < 410 ? 0 : volume;

	var hud = '<span style="margin-right:10px;display:inline-block;background: rgba(255,255,255,0.75);color: transparent;width:' + width + 'px">.</span><span>' + volume + '%</span>';

	if (document.getElementById('volumeHud')) document.getElementById('volumeHud').innerHTML = hud;
	if (document.getElementById('secondaryVolume')) document.getElementById('secondaryVolume').innerHTML = volume + '%';
}

function setSecondaryVolume(value) {
	if (value.ymc_enable_style !== undefined && value.ymc_enable_style === true) {
		var color      = value.ymc_text_color ? 'color: ' + convertHex(value.ymc_text_color, value.ymc_reverse_transparent) : false;
		var background = value.ymc_background_color ? 'background: ' + convertHex(value.ymc_background_color, value.ymc_background_transparent) : false;
		var fontSize   = value.ymc_font_size ? 'font-size: ' + value.ymc_font_size + 'px' : false;
		var padding    = value.ymc_padding ? 'padding: ' + value.ymc_padding + 'px' : false;
		var margin     = value.ymc_margin ? 'margin: ' + value.ymc_margin + 'px' : false;

		var style = color + ';' + background + ';' + fontSize + ';' + padding + ';' + margin + ';';

		var secHud = '<div id="text_container" style="' + style + '"><span id="secondaryVolume"></span></div>';
		if (document.getElementById('secondVolumeHud')) document.getElementById('secondVolumeHud').innerHTML = secHud;
	}
}

function fadeOut(el) {
	el.style.opacity = 1;

	(function fade() {
		if ((el.style.opacity -= .1) < 0) {
			el.style.display = "none";
		} else {
			requestAnimationFrame(fade);
		}
	})();
}

function fadeIn(el, display) {
	el.style.opacity = 0;
	el.style.display = display || "block";

	(function fade() {
		var val = parseFloat(el.style.opacity);
		if (!((val += .1) > 1)) {
			el.style.opacity = val;
			requestAnimationFrame(fade);
		}
	})();
}

function convertHex(hex, opacity) {
	hex   = hex.replace('#', '');
	var r = parseInt(hex.substring(0, 2), 16);
	var g = parseInt(hex.substring(2, 4), 16);
	var b = parseInt(hex.substring(4, 6), 16);

	return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
}

/**
 * listen to events from contentscript
 * set the volume and seek
 */
var tabUrl = null;
window.addEventListener("message", function (event) {
	if (event.source != window) return;

	var playerId = document.getElementById("movie_player");
	var secHud   = document.getElementById('secondVolumeHud');

	if (event.data.type && (event.data.type == "FROM_OPTIONS")) {
		setSecondaryVolume(event.data.value);
	}

	if (event.data.type && (event.data.type == "FROM_CONTENTSCRIPT_SEEK")) {
		if (event.data.key === 'seek') {
			if (playerId.hasOwnProperty('seekTo')) playerId.seekTo(event.data.value);
		}
	}

	if (event.data.type && (event.data.type == "FROM_CONTENTSCRIPT_VOLUME")) {
		if (event.data.key === 'volume') {
			if (playerId.hasOwnProperty('unMute')) playerId.unMute();

			if (playerId.hasOwnProperty('setVolume')) {
				var time = new Date().getTime();
				localStorage.setItem('volumeTime', time);
				stateChange();
				volumeHud(event.data.value);

				if (secHud.style.display === "none") fadeIn(secHud);

				playerId.setVolume(event.data.value);
			}
		}
	}

	if (event.data.type && (event.data.type == "FROM_CONTENTSCRIPT_URL")) {
		tabUrl = event.data.url.toString();
	}
}, false);

function getVolume() {
	var playerId = document.getElementById("movie_player");
	var volume   = null;
	if (playerId) {
		if (playerId.hasOwnProperty('getVolume')) volume = parseInt(playerId.getVolume());
	}

	return volume;
}

window.setInterval(function () {
	stateChange();
}, 1500);

function stateChange() {
	var time       = new Date().getTime();
	var volumeTime = localStorage.getItem('volumeTime');
	var secHud     = document.getElementById('secondVolumeHud');

	if ((time - volumeTime) > 1500)  if (secHud.style.display === "block") fadeOut(secHud);
}

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

	if (document.getElementById('secondVolumeHud') === null) {
		document.getElementsByClassName('html5-video-container')[0].insertAdjacentHTML('afterend', '<div id="secondVolumeHud" style="display:none;position: absolute;z-index: 999;"></div>');
	}
}

// sometimes the url changes but does not reload the page
// and i have to resend the player stats
//setInterval(startInit, 5000);

function startInit() {
	if (tabUrl !== window.location.href) {
		window.postMessage({type: 'GET_URL'}, "*");
		main("FROM_PAGE");
	}
}
