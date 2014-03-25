"use strict";

window.addEventListener("message", function (event) {
    if (event.source != window)
        return;

    if (event.data.type && (event.data.type == "FROM_CONTENTSCRIPT")) {
        var playerId = document.getElementById("movie_player");

        if (event.data.key === 'volume') {
            if (playerId.hasOwnProperty('unMute')) {
                playerId.unMute();
            }
            if (playerId.hasOwnProperty('setVolume')) {
                playerId.setVolume(event.data.value);
            }
        }
        if (event.data.key === 'seek') {
            if (playerId.hasOwnProperty('seekTo')) {
                playerId.seekTo(event.data.value);
            }
        }
    }
}, false);

function main() {
    var playerId = document.getElementById("movie_player");
    if (playerId) {
        if (playerId.hasOwnProperty('getVolume')) {
            var volume = playerId.getVolume();
            var currentTime = playerId.getCurrentTime();

            window.postMessage({ type: "FROM_PAGE", volume: volume, currentTime: currentTime }, "*");
        }
    }
}

main();
