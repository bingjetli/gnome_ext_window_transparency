'use strict';

//=========================================================
// Global Variables (immutable)
//=========================================================
const OPACITY = 255 * 0.85;

//=========================================================
// Global Variables (mutable)
//=========================================================
let window_created_handler = null;

//=========================================================
// Helper Functions
//=========================================================
const onWindowCreated = meta_window => {
    log(meta_window);
    //const actor = meta_window.get_compositor_private();
    //actor.get_children()[0].set_opacity(OPACITY);
};

const setOpacityForAllWindows = opacity => {
    const window_actors = global.get_window_actors();
    window_actors.forEach(w => {
        const window_title = w.get_meta_window().get_title();
        if(window_title !== 'gnome-shell'){
            w.get_children()[0].set_opacity(opacity);
        }
    });
};

//=========================================================
// Extension Entry Points
//=========================================================
function init() {
}

function enable() {
    //set opacity for existing windows
    setOpacityForAllWindows(OPACITY);

    //setup window-created event-listener
    window_created_handler = global.display.connect('window-created', onWindowCreated);
}

function disable() {
    //reset opacity
    setOpacityForAllWindows(255);

    //remove window-created event-listener
    global.display.disconnect(window_created_handler);
}