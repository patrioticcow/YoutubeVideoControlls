"use strict";

function defaultSettings() {
    if (this.id === 'volume_default') setDefaultSettings(true, false);
    if (this.id === 'seek_default') setDefaultSettings(false, true);
}

function jumpSettings() {
    var val = this.options.selectedIndex;

    if (this.id === 'volume_jump') chrome.storage.local.set({ymc_jump_volume: val}, null);
    if (this.id === 'seek_jump') chrome.storage.local.set({ymc_jump_seek: val}, null);
}

function setDefaultSettings(volume, seek) {
    chrome.storage.local.set({ymc_volume: volume}, null);
    chrome.storage.local.set({ymc_seek: seek}, null);
}

function initOptions() {
    var volume_default = document.getElementById("volume_default");
    var seek_default = document.getElementById("seek_default");
    var volume_jump = document.getElementById("volume_jump");
    var seek_jump = document.getElementById("seek_jump");

    volume_default.addEventListener('click', defaultSettings);
    seek_default.addEventListener('click', defaultSettings);
    volume_jump.addEventListener('change', jumpSettings);
    seek_jump.addEventListener('change', jumpSettings);

    // get defaults
    chrome.storage.local.get('ymc_volume', function (result) {
        volume_default.checked = result.ymc_volume;
    });

    chrome.storage.local.get('ymc_seek', function (result) {
        seek_default.checked = result.ymc_seek;
    });

    chrome.storage.local.get('ymc_jump_volume', function (result) {
        volume_jump.options[result.ymc_jump_volume].selected  = true;
    });

    chrome.storage.local.get('ymc_jump_seek', function (result) {
        seek_jump.options[result.ymc_jump_seek].selected  = true;
    });
}

document.addEventListener('DOMContentLoaded', initOptions);