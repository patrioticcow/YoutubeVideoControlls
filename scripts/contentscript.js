'use strict';

/**
 * init some vars
 */
var seek;
var volume;
var seekScale = 5;
var volumeScale = 5;
var seekState = 0;

function injectJs(link) {
    $('<script type="text/javascript" src="' + link + '"/>').appendTo($('head'));
}

function setVars(event) {
    if (event.data.volume !== 'not_needed') volume = parseFloat(event.data.volume);
    seek = parseFloat(event.data.currentTime);
}

function init() {
    var playerId = document.getElementById("movie_player");
    var $playerApi = $('#player-api');
    var $playerId = $(playerId);
    var pid = $playerApi.length ? $playerApi : $playerId;

    if (playerId) {

        pid.on('mousewheel', function (e) {
            if (seekState === 1) {

                if (e.deltaY === 1) {
                    seek = seek + seekScale;
                } else {
                    seek = seek - seekScale;
                }

                window.postMessage({type: "FROM_CONTENTSCRIPT_SEEK", key: 'seek', value: seek}, "*");
            } else {

                if (e.deltaY === 1) {
                    volume = volume >= 100 ? 100 : volume + volumeScale;
                } else {
                    volume = volume <= 0 ? 0 : volume - volumeScale;
                }

                window.postMessage({type: "FROM_CONTENTSCRIPT_VOLUME", key: 'volume', value: volume}, "*");
            }

            e.preventDefault();
            e.stopPropagation();
        });
    }

    $(document).mousedown(function (e) {
        switch (e.which) {
            case 1:
                //left Click
                break;
            case 2:
                // middle click and scroll
                seekState = seekState === 1 ? 0 : 1;
                break;
            case 3:
                //right Click
                break;
        }

        return true;
    });
}

/**
 * inject the script
 */
$(function () {
    var playerIdd = document.getElementById("movie_player");
    if (playerIdd) {
        injectJs(chrome.extension.getURL('scripts/injected.js'));
    }
});

chrome.storage.local.get('ymc_volume', function (result) {
    if (result.ymc_volume === true) {
        seekState = 0;
    }
});

chrome.storage.local.get('ymc_seek', function (result) {
    if (result.ymc_seek === true) {
        seekState = 1;
    }
});

chrome.storage.local.get('ymc_jump_volume', function (result) {
    seekScale = result.ymc_jump_volume;
});

chrome.storage.local.get('ymc_jump_seek', function (result) {
    volumeScale = result.ymc_jump_seek;
});

/**
 * listen for events form the injected script
 */
window.addEventListener("message", function (event) {
    if (event.source != window)
        return;

    if (event.data.type && (event.data.type == "FROM_PAGE")) {
        setVars(event);
        init();
    }

    if (event.data.type && (event.data.type == "SEEK_FROM_PAGE")) {
        setVars(event);
    }
}, false);