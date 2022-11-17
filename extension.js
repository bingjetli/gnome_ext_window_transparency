'use strict';

const Shell = imports.gi.Shell;
const Meta = imports.gi.Meta;
const Clutter = imports.gi.Clutter;

function init() {
}

function enable() {
    const window_actors = global.get_window_actors();
    window_actors.forEach(w => {
        const window_title = w.get_meta_window().get_title();
        if(window_title !== 'gnome-shell'){
            w.set_opacity(128);
        }
    });
}

function disable() {
}