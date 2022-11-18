'use strict';
const PanelMenu = imports.ui.panelMenu;
const Main = imports.ui.main;
const St = imports.gi.St;
const Gio = imports.gi.Gio;

//=========================================================
// Global Variables (immutable)
//=========================================================
const OPACITY = 255 * 0.85;

//=========================================================
// Global Variables (mutable)
//=========================================================
let window_created_handler = null;
let ext_button = null;

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
    if(meta_window.get_title() !== 'gnome-shell'){
        const actor = meta_window.get_compositor_private();
        actor.get_children()[0].set_opacity(OPACITY);
    }
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

    //create panel button
    ext_button = new PanelMenu.Button(0.0, 'Window-Transparency', false);

    //Add an icon.
    let icon = new St.Icon({
        gicon: new Gio.ThemedIcon({name: 'face-laugh-symbolic'}),
        style_class: 'system-status-icon'
    });
    ext_button.add_child(icon);

    //Main.panel is the actual panel you see at the top of the screen
    Main.panel.addToStatusArea('Window-Transparency', ext_button);
}

function disable() {
    //reset opacity
    setOpacityForAllWindows(255);

    //remove window-created event-listener
    global.display.disconnect(window_created_handler);
    log('window_created_handler disconnected');

    //remove indicator button
    ext_button.destroy();
    ext_button = null;
}