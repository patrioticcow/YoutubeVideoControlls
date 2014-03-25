'use strict';

function injectJs(link) {
    $('<script type="text/javascript" src="' + link + '"/>').appendTo($('head'));
}

function init(event) {
    var playerId = document.getElementById("movie_player");
    var $playerId = $(playerId);
    var volume = event.data.volume;
    var seek = event.data.currentTime;
    var seekState = 0;

    volume = parseFloat(volume);
    seek = parseFloat(seek);

    if (playerId) {

        $playerId.on('mousewheel', function (e) {

            if (seekState === 1) {

                if (e.deltaY === 1) {
                    seek = seek + 5;
                } else {
                    seek = seek - 5;
                }

                window.postMessage({ type: "FROM_CONTENTSCRIPT", key: 'seek', value: seek }, "*");
            } else {

                if (e.deltaY === 1) {
                    volume = volume >= 100 ? 100 : volume + 5;
                } else {
                    volume = volume <= 0 ? 0 : volume - 5;
                }

                window.postMessage({ type: "FROM_CONTENTSCRIPT", key: 'volume', value: volume }, "*");
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

$(function () {
    var playerId = document.getElementById("movie_player");
    if (playerId) {
        injectJs(chrome.extension.getURL('scripts/injected.js'));
    }
});

window.addEventListener("message", function (event) {
    if (event.source != window)
        return;

    if (event.data.type && (event.data.type == "FROM_PAGE")) {
        init(event);
    }

    if (event.data.type && (event.data.type == "FROM_CONTENTSCRIPT")) {
        //console.log(event);
    }
}, false);