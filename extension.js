'use strict';
const ExtensionUtils = imports.misc.extensionUtils;

const this_extension = ExtensionUtils.getCurrentExtension(); 
const current_display = global.get_display();
let window_created_handler = null;
let window_list = [];


const onWindowCreate = window => {
    //set transparency
    window.set_opacity(128);
};

function init() {
    log(`initializing ${this_extension.metadata.name}`);
}

function enable() {
    log(`enabling ${this_extension.metadata.name}`);

    //setup event-listeners
    //window_created_handler = current_display.connect('window-created', onWindowCreate);

    let display_size = current_display.get_size();
    log(`height ${display_size.height} width ${display_size.width}`);
}

function disable() {
    log(`disabling ${this_extension.metadata.name}`);


    //remove event-listeners
    //current_display.disconnect(window_created_handler);
}