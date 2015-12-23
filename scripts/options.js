"use strict";

// set defaults
function defaultSettings() {
	chrome.storage.local.get('ymc_font_size', function () {
		var el  = document.getElementById("font_size");
		var val = el.options[el.selectedIndex].value;

		chrome.storage.local.set({ymc_font_size: val}, null);
		setPercentColor();
	});

	chrome.storage.local.get('ymc_margin', function () {
		var el  = document.getElementById("margin");
		var val = el.options[el.selectedIndex].value;

		chrome.storage.local.set({ymc_margin: val}, null);
		setPercentColor();
	});

	chrome.storage.local.get('ymc_padding', function () {
		var el  = document.getElementById("padding");
		var val = el.options[el.selectedIndex].value;

		chrome.storage.local.set({ymc_padding: val}, null);
		setPercentColor();
	});

	chrome.storage.local.get('ymc_text_color', function () {
		var color = document.getElementById("text_color");

		setPercentColor();
		chrome.storage.local.set({ymc_text_color: color.value}, null);
	});

	chrome.storage.local.get('ymc_background_color', function () {
		var color = document.getElementById("background_color");

		chrome.storage.local.set({ymc_background_color: color.value}, null);
		setPercentColor();
	});

	chrome.storage.local.get('ymc_background_transparent', function () {
		var el  = document.getElementById("background_transparent");
		var val = el.options[el.selectedIndex].value;

		chrome.storage.local.set({ymc_background_transparent: val}, null);
		setPercentColor();
	});

	chrome.storage.local.get('ymc_reverse_transparent', function () {
		var el  = document.getElementById("reverse_transparent");
		var val = el.options[el.selectedIndex].value;

		chrome.storage.local.set({ymc_reverse_transparent: val}, null);
		setPercentColor();
	});
	/**/

	chrome.storage.local.get('ymc_none_only', function () {
		var bool = document.getElementById("none_only").checked === true;
		chrome.storage.local.set({ymc_none_only: bool}, null);
	});

	chrome.storage.local.get('ymc_volume_only', function () {
		var bool = document.getElementById("volume_only").checked === true;
		chrome.storage.local.set({ymc_volume_only: bool}, null);
	});

	chrome.storage.local.get('ymc_seek_only', function () {
		var bool = document.getElementById("seek_only").checked === true;
		chrome.storage.local.set({ymc_seek_only: bool}, null);
	});

	chrome.storage.local.get('ymc_enable_style', function () {
		var bool = document.getElementById("enable_style").checked === true;
		chrome.storage.local.set({ymc_enable_style: bool}, null);

		setPercentColor();
	});

	chrome.storage.local.get('ymc_reverse_volume', function () {
		var bool = document.getElementById("reverse_volume").checked === true;
		chrome.storage.local.set({ymc_reverse_volume: bool}, null);
	});

	chrome.storage.local.get('ymc_reverse_seek', function () {
		var bool = document.getElementById("reverse_seek").checked === true;
		chrome.storage.local.set({ymc_reverse_seek: bool}, null);
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

function setPercentColor() {
	var player_container = document.getElementById("player_container");
	var text_container   = document.getElementById("text_container");

	//chrome.storage.local.clear();

	chrome.storage.local.get(null, function (result) {
		if (isEmpty(result)) {
			result = {
				ymc_background_color      : "#000000",
				ymc_background_transparent: "0.6",
				ymc_enable_style          : false,
				ymc_font_size             : "12",
				ymc_jump_seek             : 5,
				ymc_jump_volume           : 1,
				ymc_margin                : "10",
				ymc_none_only             : true,
				ymc_padding               : "10",
				ymc_reverse_seek          : false,
				ymc_reverse_transparent   : "0.1",
				ymc_reverse_volume        : false,
				ymc_seek                  : false,
				ymc_seek_only             : false,
				ymc_volume                : true,
				ymc_volume_only           : false
			};

			chrome.storage.local.set(result, null);
		}

		if (result.ymc_text_color !== undefined && result.ymc_background_transparent !== undefined) {
			text_container.style.color = convertHex(result.ymc_text_color, result.ymc_background_transparent);
		}

		if (result.ymc_background_color !== undefined && result.ymc_reverse_transparent !== undefined) {
			text_container.style.background = convertHex(result.ymc_background_color, result.ymc_reverse_transparent);
		}

		if (result.ymc_font_size !== undefined) text_container.style.fontSize = result.ymc_font_size + 'px';
		if (result.ymc_padding !== undefined) text_container.style.padding = result.ymc_padding + 'px';
		if (result.ymc_margin !== undefined) text_container.style.margin = result.ymc_margin + 'px';

		if (result.ymc_enable_style === undefined || result.ymc_enable_style === false) {
			player_container.style.display = "none";
		} else {
			player_container.style.display = "block";
		}
	});
}

function initOptions() {
	setPercentColor();

	var enable_style   = document.getElementById("enable_style");
	var reverse_volume = document.getElementById("reverse_volume");
	var reverse_seek   = document.getElementById("reverse_seek");
	var none_only      = document.getElementById("none_only");
	var volume_only    = document.getElementById("volume_only");
	var seek_only      = document.getElementById("seek_only");
	var volume_default = document.getElementById("volume_default");
	var seek_default   = document.getElementById("seek_default");
	var volume_jump    = document.getElementById("volume_jump");
	var jump_seek      = document.getElementById("jump_seek");

	enable_style.addEventListener('click', defaultSettings);
	reverse_volume.addEventListener('click', defaultSettings);
	reverse_seek.addEventListener('click', defaultSettings);
	none_only.addEventListener('click', defaultSettings);
	volume_only.addEventListener('click', defaultSettings);
	seek_only.addEventListener('click', defaultSettings);
	volume_default.addEventListener('click', defaultSettings);
	seek_default.addEventListener('click', defaultSettings);
	volume_jump.addEventListener('change', jumpSettings);
	jump_seek.addEventListener('change', jumpSettings);

	var text_color = document.getElementById("text_color");
	text_color.addEventListener('change', defaultSettings);

	var background_color = document.getElementById("background_color");
	background_color.addEventListener('change', defaultSettings);

	var reverse_transparent = document.getElementById("reverse_transparent");
	reverse_transparent.addEventListener('change', defaultSettings);

	var background_transparent = document.getElementById("background_transparent");
	background_transparent.addEventListener('change', defaultSettings);

	var font_size = document.getElementById("font_size");
	font_size.addEventListener('change', defaultSettings);

	var padding = document.getElementById("padding");
	padding.addEventListener('change', defaultSettings);

	var margin = document.getElementById("margin");
	margin.addEventListener('change', defaultSettings);

	// get defaults
	chrome.storage.local.get('ymc_font_size', function (result) {
		if (result.ymc_font_size !== undefined) setOption(font_size, result.ymc_font_size);
	});

	chrome.storage.local.get('ymc_margin', function (result) {
		if (result.ymc_margin !== undefined) setOption(margin, result.ymc_margin);
	});

	chrome.storage.local.get('ymc_padding', function (result) {
		if (result.ymc_padding !== undefined) setOption(padding, result.ymc_padding);
	});

	chrome.storage.local.get('ymc_text_color', function (result) {
		if (result.ymc_text_color) {
			document.getElementById("text_color").value = result.ymc_text_color;
		}
	});

	chrome.storage.local.get('ymc_background_color', function (result) {
		if (result.ymc_background_color) {
			document.getElementById("background_color").value = result.ymc_background_color;
		}
	});

	chrome.storage.local.get('ymc_background_transparent', function (result) {
		if (result.ymc_background_transparent !== undefined) setOption(background_transparent, result.ymc_background_transparent);
	});

	chrome.storage.local.get('ymc_reverse_transparent', function (result) {
		if (result.ymc_reverse_transparent !== undefined) setOption(reverse_transparent, result.ymc_reverse_transparent);
	});
	/**/

	chrome.storage.local.get('ymc_enable_style', function (result) {
		if (result.ymc_enable_style) {
			enable_style.checked = true;
			enable_style.checked = result.ymc_enable_style;
		}
	});

	chrome.storage.local.get('ymc_reverse_volume', function (result) {
		if (result.ymc_reverse_volume) {
			reverse_volume.checked = true;
			reverse_volume.checked = result.ymc_reverse_volume;
		}
	});

	// Use Reverse Volume Controls only
	chrome.storage.local.get('ymc_reverse_seek', function (result) {
		if (result.ymc_reverse_seek) {
			reverse_seek.checked = true;
			reverse_seek.checked = result.ymc_reverse_seek;
		}
	});

	// Use None Controls only
	chrome.storage.local.get('ymc_none_only', function (result) {
		if (result.ymc_none_only) {
			none_only.checked = true;
			result.checked    = result.ymc_none_only;
		}
	});

	// Use Volume Controls only
	chrome.storage.local.get('ymc_volume_only', function (result) {
		if (result.ymc_volume_only) {
			volume_only.checked = true;
			volume_only.checked = result.ymc_none_only;
		}
	});

	// Use Volume Controls only
	chrome.storage.local.get('ymc_seek_only', function (result) {
		if (result.ymc_seek_only) {
			seek_only.checked = true;
			seek_only.checked = result.ymc_seek_only;
		}
	});

	// Use Volume Controls by default
	chrome.storage.local.get('ymc_volume', function (result) {
		if (result.ymc_volume) {
			volume_default.checked = true;
			volume_default.checked = result.ymc_volume;
		}
	});

	// Use Seek Controls by default
	chrome.storage.local.get('ymc_seek', function (result) {
		if (result.ymc_seek) {
			seek_default.checked = true;
			seek_default.checked = result.ymc_seek;
		}
	});

	// Volume sensitivity
	chrome.storage.local.get('ymc_jump_volume', function (result) {
		if (result.ymc_jump_volume !== undefined) volume_jump.options[result.ymc_jump_volume].selected = true;
	});

	// Seek sensitivity
	chrome.storage.local.get('ymc_jump_seek', function (result) {
		if (result.ymc_jump_seek !== undefined) jump_seek.options[result.ymc_jump_seek].selected = true;
	});
}

function setOption(selectElement, value) {
	var options = selectElement.options;
	for (var i = 0, optionsLength = options.length; i < optionsLength; i++) {
		if (options[i].value == value) {
			selectElement.selectedIndex = i;
			return true;
		}
	}
	return false;
}

function convertHex(hex, opacity) {
	hex   = hex.replace('#', '');
	var r = parseInt(hex.substring(0, 2), 16);
	var g = parseInt(hex.substring(2, 4), 16);
	var b = parseInt(hex.substring(4, 6), 16);

	return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
}

function isEmpty(obj) {
	if (obj == null) return true;
	if (obj.length > 0)    return false;
	if (obj.length === 0)  return true;
	for (var key in obj) {
		if (hasOwnProperty.call(obj, key)) return false;
	}

	return true;
}

document.addEventListener('DOMContentLoaded', initOptions);
