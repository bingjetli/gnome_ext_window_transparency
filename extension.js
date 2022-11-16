'use strict';
function init() {
}

function enable() {
    const window_actors = global.get_window_actors();
    window_actors.forEach(actor => {
        actor.set_opacity(128);
    });
}

function disable() {
}