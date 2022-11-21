'use strict';
const PanelMenu = imports.ui.panelMenu;
const Main = imports.ui.main;
const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Meta = imports.gi.Meta;
const GLib = imports.gi.GLib;
const Shell = imports.gi.Shell;
const Clutter = imports.gi.Clutter;
const GObject = imports.gi.GObject;
const ExtensionUtils = imports.misc.extensionUtils;

const Me = ExtensionUtils.getCurrentExtension();
const TranslucentEffect = Me.imports.effects.translucent_effect.TranslucentEffect;
const TestEffect = Me.imports.effects.test_effect.TestEffect;
const BlurEffect = Me.imports.effects.blur_effect.BlurEffect;
const BlurEffect2 = Me.imports.effects.blur_effect2.BlurEffect;
const {__log} = Me.imports.common;

//=========================================================
// Global Variables (immutable)
//=========================================================
const NAMESPACE = 'extension.js';
const OPACITY = 255 * 0.9;
const BLUR_STRENGTH = 10;
const EFFECT_NAME_PREFIX = 'com.baileyliang@window-transparency';
const window_actors = {}; //dictionary containing all active meta_window.ids and their corresponding actors;

//=========================================================
// Global Variables (mutable)
//=========================================================
let window_entered_monitor_handler = null;
let window_created_handler = null;
let window_left_monitor_handler = null;
//let ext_button = null;


//=========================================================
// Helper Functions
//=========================================================
function onWindowCreated(meta_display, meta_window){
    __log(`onWindowCreate(${arguments.length}) called.`, 0, NAMESPACE);
    switch(meta_window.get_window_type()){
        case Meta.WindowType.NORMAL:
        case Meta.WindowType.DIALOG:
        case Meta.WindowType.MODAL_DIALOG:
            //register a new window in the `window_actors` list;
            const window_id = meta_window.get_id();
            window_actors[window_id] = meta_window.get_compositor_private();
            window_actor_children = window_actors[window_id].get_children();
            __log(`meta_window_actor.children = ${window_actor_children}`, 1);

            if(window_actor_children.length > 0){
                //It seems that Wayland window actors have a child
                //actor that we should apply the effects to instead.
                window_actor_children[0].set_opacity(OPACITY);
                __log('effects applied to window actor\'s first child', 1);
            }
            else{
                //WaylandX11 window actors don't have any children
                //therefore, we apply the effects to the main window actor.
                window_actors[window_id].set_opacity(OPACITY);
                __log('effects applied to window actor', 1);
            }
            
            //apply translucent effect;
            //window_actors[window_id].add_effect_with_name(EFFECT_NAME_PREFIX + '.translucent', new TranslucentEffect());
            //window_actors[window_id].add_effect_with_name(EFFECT_NAME_PREFIX + '.translucent', new TestEffect());
            //window_actors[window_id].add_effect_with_name(EFFECT_NAME_PREFIX + '.blur', new BlurEffect());
            //const blur_effect = new BlurEffect2({shader_type:Clutter.ShaderType.FRAGMENT_SHADER});
            //blur_effect.loadShader('test.glsl');
        default: return;
    }
}

function onWindowEnteredMonitor(meta_display, arg1, meta_window){
    log(`${new Date().toISOString()} : onWindowEnteredMonitor(${arguments.length})`);
    log(`|-meta_window.title = ${meta_window.get_title()}
|-meta_window.clientType = ${meta_window.get_client_type()}
|-meta_window.windowType = ${meta_window.get_window_type()}`);
};

function onWindowLeftMonitor(meta_display, arg1, meta_window){
    log(`${new Date().toISOString()} : onWindowLeftMonitor(${arguments.length})`);
    //let string = '';
    //for(let i = 0; i < arguments.length; i++){
    //    string += `    |-arg${i} = ${arguments[i]}`;
    //    if(i < arguments.length - 1) string += '\n';
    //}
    //log(string);
    log(`|-meta_window.title = ${meta_window.get_title()}
|-meta_window.clientType = ${meta_window.get_client_type()}
|-meta_window.windowType = ${meta_window.get_window_type()}`);
    

    switch(meta_window.get_window_type()){
        case Meta.WindowType.NORMAL:
        case Meta.WindowType.DIALOG:
        case Meta.WindowType.MODAL_DIALOG:
            const window_id = meta_window.get_id();

            //remove blur effect from the window
            //window_actors[window_id].remove_effect_by_name(EFFECT_NAME_PREFIX + '.translucent');
            //window_actors[window_id].remove_effect_by_name(EFFECT_NAME_PREFIX + '.blur');
            //window_actors[window_id].remove_effect_by_name(EFFECT_NAME_PREFIX + '.test');

            //unregister window from the `window_actors` list
            delete window_actors[window_id];
        default: return;
    }
};

const setOpacityForAllWindows = opacity => {
    const window_actors = global.get_window_actors();
    window_actors.forEach(w => {
        const window_title = w.get_meta_window().get_title();
        if(window_title !== 'gnome-shell'){
            w.get_first_child().set_opacity(opacity);
        }
    });
};

const setBlurEffectForAllWindows = is_enabled => {
    global.get_window_actors().forEach(w => {
        const window_title = w.get_meta_window().get_title();
        if(window_title !== 'gnome-shell'){
            if(is_enabled === true){
                w.get_first_child().add_effect_with_name(
                    EFFECT_NAME_PREFIX + '.blur',
                    createBlurEffect(null, Shell.BlurMode.BACKGROUND, BLUR_STRENGTH)
                );
            }
            else{
                w.get_first_child().remove_effect_by_name(EFFECT_NAME_PREFIX + '.blur');
            }
        }
    });
};

const createBlurEffect = (brightness=null, mode=null, sigma=null) => {
    const effect = Shell.BlurEffect.new();
    if(brightness !== null) effect.brightness = brightness;
    if(mode !== null) effect.mode = mode;
    if(sigma !== null) effect.sigma = sigma;
    return effect;
};

const parseGIName = gi_object => {
    const to_string = `${gi_object}`;
    return to_string.match(/GIName:[A-z0-9\.]+/)[0];
};

//=========================================================
// Extension Entry Points
//=========================================================
function init() {
}

function enable() {
    //set opacity for existing windows
    //setOpacityForAllWindows(OPACITY);

    //set blur effect for existing windows
    //setBlurEffectForAllWindows(true);

    //setup event-handlers
    window_created_handler = global.display.connect('window-created', onWindowCreated);
    window_entered_monitor_handler = global.display.connect('window-entered-monitor', onWindowEnteredMonitor);
    window_left_monitor_handler = global.display.connect('window-left-monitor', onWindowLeftMonitor);

    ////create panel button
    //ext_button = new PanelMenu.Button(0.0, 'Window-Transparency', false);

    ////Add an icon.
    //let icon = new St.Icon({
    //    gicon: new Gio.ThemedIcon({name: 'face-laugh-symbolic'}),
    //    style_class: 'system-status-icon'
    //});
    //ext_button.add_child(icon);

    ////Main.panel is the actual panel you see at the top of the screen
    //Main.panel.addToStatusArea('Window-Transparency', ext_button);
}

function disable() {
    //reset opacity
    //setOpacityForAllWindows(255);

    //remove blur effect
    //setBlurEffectForAllWindows(false);

    //remove window-created event-listener
    global.display.disconnect(window_created_handler);
    global.display.disconnect(window_entered_monitor_handler);
    global.display.disconnect(window_left_monitor_handler);

    ////remove indicator button
    //ext_button.destroy();
    //ext_button = null;
}