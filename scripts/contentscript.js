'use strict';

/**
 * init some vars
 */
var seek;
var vol;
var volume;
var seekScale;
var volumeScale;
var seekState       = 0;
var volumeState     = 0;
var fix_annotations = 1;
var reverse_volume  = 1;
var reverse_seek    = 1;
var volumeOnly      = 0;
var seekOnly        = 0;
var noneOnly        = 0;
var log_volume      = 0;

function injectJs(link) {
    $('<script type="text/javascript" src="' + link + '"/>').appendTo($('head'));
}

function setVars(event) {
    if (event.data.volume !== 'not_needed') vol = parseFloat(event.data.volume);
    seek = parseFloat(event.data.currentTime);
}

function init() {
    var playerId   = document.getElementById("movie_player");
    var $playerApi = $('video'); //#player-api
    var $playerId  = $(playerId);
    var pid        = $playerApi.length ? $playerApi : $playerId;

    chrome.storage.local.get(null, function (result) {
        window.postMessage({type: "FROM_OPTIONS", key: 'options', value: result}, "*");
    });

    seekScale   = isNaN(seekScale) ? 5 : seekScale;
    volumeScale = isNaN(volumeScale) ? 5 : volumeScale;

    if (playerId) {
        pid.on('mousewheel', function (e) {
            scrollSeek(e);

            e.preventDefault();
            e.stopPropagation();

            return false;
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

function scrollSeek(e) {
    reverse_volume = reverse_volume === undefined ? 1 : reverse_volume;
    reverse_seek   = reverse_seek === undefined ? 1 : reverse_seek;
    log_volume     = log_volume === undefined ? 1 : log_volume;

    // if volume only option don't enable seek and viceversa
    if (noneOnly === 0) {
        if (volumeOnly === 1) {
            volumeState = 1;
            seekState   = 0;
        }

        if (seekOnly === 1) {
            volumeState = 0;
            seekState   = 1;
        }
    } else {
        if (volumeOnly === 0 && seekState === 0) {
            volumeState = 1;
            seekState   = 0;
        }

        if (seekState === 1) volumeState = 0;
        if (volumeOnly === 1) seekState = 0;
    }

    if (seekState === 1) {
        if (e.deltaY >= reverse_seek) {
            seek = seek + seekScale;
        } else if(e.deltaY <= -1) {
            seek = seek - seekScale;
        }

        window.postMessage({type: "FROM_CONTENTSCRIPT_SEEK", key: 'seek', value: seek, delta: e.deltaY}, "*");
    }

    if (volumeState === 1) {
        if (e.deltaY >= reverse_volume) {
            vol    = vol >= 100 ? 100 : vol + volumeScale;
            volume = logVolume(vol);

        } else if (e.deltaY <= -1) {
            vol    = vol <= 0 ? 0 : vol - volumeScale;
            volume = logVolume(vol);
        }

        //console.log(e.deltaX, e.deltaY, vol, volume, '---');

        window.postMessage({type: "FROM_CONTENTSCRIPT_VOLUME", key: 'volume', value: volume, delta: e.deltaY}, "*");
    }
}

function logVolume(vol) {
    if (log_volume === 1) {
        volume = logslider(vol);
    } else {
        volume = Math.round(vol);
    }

    return volume;
}

function logslider(position) {
    var num = Math.exp((Math.log(100) / 100) * position);

    num = Math.round(num * 10) / 10;

    if (num < 0) return 0;
    if (num > 100) return 100;
    if (isNaN(num)) return position;

    return num;
}

/**
 * inject the script
 */
var interval = setInterval(injectScript, 1000);

function injectScript() {
    var playerIdd = document.getElementById("movie_player");
    if (playerIdd) {
        injectJs(chrome.extension.getURL('scripts/injected.js'));

        //include jquery
        (function () {
            function l(u, i) {
                var d = document;
                if (!d.getElementById(i)) {
                    var s = d.createElement('script');
                    s.src = u;
                    s.id  = i;
                    d.body.appendChild(s);
                }
            }

            l('//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js', 'jquery')
        })();

        clearInterval(interval);
    }
}

chrome.storage.local.get('fix_annotations', function (result) {
    fix_annotations = result.fix_annotations ? -1 : 1;
});

chrome.storage.local.get('ymc_reverse_volume', function (result) {
    reverse_volume = result.ymc_reverse_volume ? -1 : 1;
});

chrome.storage.local.get('ymc_log_volume', function (result) {
    log_volume = result.ymc_log_volume ? 1 : 0;
});

chrome.storage.local.get('ymc_reverse_seek', function (result) {
    reverse_seek = result.ymc_reverse_seek ? -1 : 1;
});

chrome.storage.local.get('ymc_none_only', function (result) {
    if (result.ymc_none_only === true) noneOnly = 1;
});

chrome.storage.local.get('ymc_volume_only', function (result) {
    if (result.ymc_volume_only === true) volumeOnly = 1;
});

chrome.storage.local.get('ymc_seek_only', function (result) {
    if (result.ymc_seek_only === true) seekOnly = 1;
});

chrome.storage.local.get('ymc_volume', function (result) {
    if (result.ymc_volume === true) seekState = 0;
});

chrome.storage.local.get('ymc_seek', function (result) {
    if (result.ymc_seek === true) seekState = 1;
});

chrome.storage.local.get('ymc_jump_volume', function (result) {
    volumeScale = parseFloat(result.ymc_jump_volume);
});

chrome.storage.local.get('ymc_jump_seek', function (result) {
    seekScale = parseFloat(result.ymc_jump_seek);
});

/**
 * listen for events form the injected script
 */
window.addEventListener("message", function (event) {
    if (event.source !== window) return;

    if (event.data.type && (event.data.type === "FROM_PAGE")) {
        setVars(event);
        init();
    }

    if (event.data.type && (event.data.type === "SEEK_FROM_PAGE")) setVars(event);

    if (event.data.type && (event.data.type === "GET_URL")) {
        chrome.runtime.sendMessage({type: "GET_URL"}, function (response) {
            window.postMessage({type: "FROM_CONTENTSCRIPT_URL", url: response.url}, "*");
        });
    }

    if (event.data.type && (event.data.type === "UNMUTE_TAB")) {
        chrome.runtime.sendMessage({type: "UNMUTE_TAB"}, function (response) {

        });
    }
}, false);

// mute tab per settings
chrome.storage.local.get('ymc_wait_for_volume', function (result) {
    if (result.ymc_wait_for_volume === true) {
        chrome.runtime.sendMessage({type: "MUTE_TAB"}, function (response) {
            // muted
        });
    }
});