"use strict";

/**
 * listen to events from contentscript
 * set the volume and seek
 */
window.addEventListener("message", function (event) {
    if (event.source != window)
        return;

    var playerId = document.getElementById("movie_player");

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
                playerId.setVolume(event.data.value);
            }
        }
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
            var volume = playerId.getVolume();
            var currentTime = playerId.getCurrentTime();

            window.postMessage({type: typeName, volume: volume, currentTime: currentTime}, "*");
        }
    }
}

main("FROM_PAGE");
