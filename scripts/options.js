"use strict";

// set defaults
function defaultSettings() {
	chrome.storage.local.get('ymc_volume_only', function () {
		var bool = document.getElementById("volume_only").checked === true;
		chrome.storage.local.set({ymc_volume_only: bool}, null);
	});

	chrome.storage.local.get('ymc_volume', function () {
		var bool = document.getElementById("volume_default").checked === true;
		chrome.storage.local.set({ymc_volume: bool}, null);
	});

	chrome.storage.local.get('ymc_seek', function () {
		var bool = document.getElementById("seek_default").checked === true;
		chrome.storage.local.set({ymc_seek: bool}, null);
	});
}

function jumpSettings() {
	var val = this.options.selectedIndex;

	if (this.id === 'volume_jump') chrome.storage.local.set({ymc_jump_volume: val}, null);
	if (this.id === 'jump_seek') chrome.storage.local.set({ymc_jump_seek: val}, null);
}

function initOptions() {
	var volume_only    = document.getElementById("volume_only");
	var volume_default = document.getElementById("volume_default");
	var seek_default   = document.getElementById("seek_default");
	var volume_jump    = document.getElementById("volume_jump");
	var jump_seek      = document.getElementById("jump_seek");

	volume_only.addEventListener('click', defaultSettings);
	volume_default.addEventListener('click', defaultSettings);
	seek_default.addEventListener('click', defaultSettings);
	volume_jump.addEventListener('change', jumpSettings);
	jump_seek.addEventListener('change', jumpSettings);

	// get defaults
	// Use Volume Controls only
	chrome.storage.local.get('ymc_volume_only', function (result) {
		volume_only.checked = result.ymc_volume_only;
	});

	// Use Volume Controls by default
	chrome.storage.local.get('ymc_volume', function (result) {
		volume_default.checked = result.ymc_volume;
	});

	// Use Seek Controls by default
	chrome.storage.local.get('ymc_seek', function (result) {
		seek_default.checked = result.ymc_seek;
	});

	// Volume sensitivity
	chrome.storage.local.get('ymc_jump_volume', function (result) {
		volume_jump.options[result.ymc_jump_volume].selected = true;
	});

	// Seek sensitivity
	chrome.storage.local.get('ymc_jump_seek', function (result) {
		jump_seek.options[result.ymc_jump_seek].selected = true;
	});
}

document.addEventListener('DOMContentLoaded', initOptions);