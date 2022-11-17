'use strict';

const Shell = imports.gi.Shell;
const Meta = imports.gi.Meta;
const Clutter = imports.gi.Clutter;

function init() {
}

function enable() {
    const window_actors = global.get_window_actors();
    log(window_actors);
}

function disable() {
}