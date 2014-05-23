'use strict';

/**
 * init some vars
 */
var seek;
var volume;

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
    var seekState = 0;
    var pid = $playerApi.length ? $playerApi : $playerId;

    if (playerId) {

        pid.on('mousewheel', function (e) {

            if (seekState === 1) {

                if (e.deltaY === 1) {
                    seek = seek + 5;
                } else {
                    seek = seek - 5;
                }

                window.postMessage({type: "FROM_CONTENTSCRIPT_SEEK", key: 'seek', value: seek}, "*");
            } else {

                if (e.deltaY === 1) {
                    volume = volume >= 100 ? 100 : volume + 5;
                } else {
                    volume = volume <= 0 ? 0 : volume - 5;
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