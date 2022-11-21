'use strict';
const GObject = imports.gi.GObject;
const Shell = imports.gi.Shell;
const Clutter = imports.gi.Clutter;
const ExtensionUtils = imports.misc.extensionUtils;


const Me = ExtensionUtils.getCurrentExtension();

//Internal function to load .glsl shaders from ./effects/*.glsl.
//This function takes `shader_name` as a parameter--which is a
//string containing the name of the .glsl shader to load--and
//returns an array containing the `declarations` and `logic`
//of the shader.
const __importGlslShader = shader_name => {
    const shader_path = `${Me.path}/effects/${shader_name}`;
    const shader = Shell.get_file_contents_utf8_sync(shader_path);

    const [declarations, logic] = shader.split(/^.*?main\(\s?\)\s?/m);

    return [declarations.trim(), logic.trim().replace(/^[{}]/gm, '').trim()];
};

//Internal function to print log messages to journalctl.
//There are different `log_levels`--zero (0) being the top-
//level log message, and four (4) being the most nested-
//level--along with being able to specify a `namespace`
//to specify where these log messages are originating from.
//The default namespace is `generic`, meaning a generic log
//message.
const __log = (string, log_level=0, namespace='generic') => {
    switch(log_level){
        case 4: 
            log(`|--------${string}`);
            break;
        case 3:
            log(`|------${string}`);
            break;
        case 2:
            log(`|----${string}`);
            break;
        case 1:
            log(`|--${string}`);
            break;
        default:
            log(`[${new Date().toISOString()}]::${namespace}->${string}`);
    }
};

//Apparently, variables declared with `let` or `const` are not exported in GJS.
//functions defined with `function` and variables defined with `var` are exported in GJS.
var BlurEffect = GObject.registerClass(
    {},
    class BlurShader extends Clutter.ShaderEffect {
        _init(...params){
            __log('_init() called', 0, 'blur_effect2.js');
            super._init(...params);
            __log('super function called', 1);
        }

        loadShader(shader_name){
            const shader_path = `${Me.path}/effects/${shader_name}`;
            const shader = Shell.get_file_contents_utf8_sync(shader_path);
            this.set_shader_source(shader);
        }

        vfunc_paint_target(...params){
            this.paint_target_logged !== true && __log('vfunc_paint_target() called', 0, 'blur_effect2.js');
            super.vfunc_paint_target(...params);
            this.paint_target_logged !== true && __log('super function called', 1);
            this.paint_target_logged = true; //set this to prevent flooding the journal
        }
    }
);