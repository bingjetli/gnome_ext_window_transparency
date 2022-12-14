'use strict';

const GObject = imports.gi.GObject;
const Shell = imports.gi.Shell;
const ExtensionUtils = imports.misc.extensionUtils;

const Me = ExtensionUtils.getCurrentExtension();

//Apparently, variables declared with `let` or `const` are not exported in GJS.
//functions defined with `function` and variables defined with `var` are exported in GJS.
var TranslucentEffect = GObject.registerClass(
    {},
    class TranslucentShader extends Shell.GLSLEffect {
        _init(){
            //call vfunc_build_pipeline()
            super._init();
        }

        vfunc_build_pipeline(){
            const shader_logic = `
                float color_rgb_squared = (cogl_color_out.r * cogl_color_out.r) +
                    (cogl_color_out.g * cogl_color_out.g) +
                    (cogl_color_out.b * cogl_color_out.b);
                float full_white_squared = 3.0;
                float color_rgb_proximity = color_rgb_squared / full_white_squared;
                float new_alpha = 1.0 - (color_rgb_proximity * 0.1);

                cogl_color_out = vec4(cogl_color_out.rgb, cogl_color_out.a * new_alpha);
            `;
            this.add_glsl_snippet(Shell.SnippetHook.FRAGMENT, '', shader_logic, false);
        }

        vfunc_paint_target(...params){
            //This line fixes that weird bug when taking screenshots.
            // Reset to default blend string.
            this.get_pipeline()?.set_blend ('RGBA = ADD(SRC_COLOR, DST_COLOR*(1-SRC_COLOR[A]))');
            super.vfunc_paint_target(...params);
        }
    }
);