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
const onWindowCreated = (meta_display, meta_window) => {
    /*
    log(`
        ============================================================\n
        meta_window_id = ${meta_window.get_id()}\n
        meta_window_type = ${meta_window.get_window_type()}\n
        meta_window_gtk_application_id = ${meta_window.get_gtk_application_id()}\n
        meta_window_title = ${meta_window.get_title()}\n
        meta_window_client_type = ${meta_window.get_client_type()}\n
        meta_window_compositor_private = ${meta_window.get_compositor_private()}\n
        ============================================================\n
    `);
    */
    const actor = meta_window.get_compositor_private();
    log('window-created');
    actor.get_children().forEach(a => {
        log(`\t${a}`);
    });
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
    log(`window_created_handler connected ${window_created_handler}`);
}

function disable() {
    //reset opacity
    setOpacityForAllWindows(255);

    //remove window-created event-listener
    global.display.disconnect(window_created_handler);
    log('window_created_handler disconnected');
}