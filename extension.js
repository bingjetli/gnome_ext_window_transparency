'use strict';
const ExtensionUtils = imports.misc.extensionUtils;

const this_extension = ExtensionUtils.getCurrentExtension(); 


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

    const pointer = global.get_pointer();
    log(`pointer x : ${pointer.x} pointer y : ${pointer.y}`);
}

function disable() {
    log(`disabling ${this_extension.metadata.name}`);


    //remove event-listeners
    //current_display.disconnect(window_created_handler);
}