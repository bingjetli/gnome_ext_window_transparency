'use strict';

const GObject = imports.gi.GObject;
const Shell = imports.gi.Shell;
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
}

//Apparently, variables declared with `let` or `const` are not exported in GJS.
//functions defined with `function` and variables defined with `var` are exported in GJS.
var BlurEffect = GObject.registerClass(
    {},
    class BlurShader extends Shell.GLSLEffect {
        _init(){
            log(`${new Date().toISOString()} : BlurShader._init()`);
            //call vfunc_build_pipeline()
            super._init();
            log(`|-super class initialized`);
        }

        vfunc_build_pipeline(){
            log(`${new Date().toISOString()} : BlurShader.vfunc_build_pipeline()`);
            log(`|-importing shader`);
            const [shader_declarations, shader_logic] = __importGlslShader('test.glsl');
            log(`|-import successful\n|--shader_declarations = '${shader_declarations}'\n|--shader_logic = '${shader_logic}'\n|-attempting to inject shader snippet`);
            this.add_glsl_snippet(Shell.SnippetHook.FRAGMENT, shader_declarations, shader_logic, false);
            log(`|-injected shader snippet`);
        }

        vfunc_pre_paint(...params){
            this.pre_paint_logged !== true && log(`${new Date().toISOString()} : BlurShader.vfunc_pre_paint()`);
            if(super.vfunc_pre_paint(...params)){
                this.pre_paint_logged !== true && log(`|-super.vfunc_pre_paint()`);
                const pipeline = this.get_pipeline();
                const texture = this.actor.get_texture().get_texture(); //MetaWindowActor.ShapedTexture.CoglTexture;
                this.pre_paint_logged !== true && log(`|-texture = ${texture}\n|-pipeline = ${pipeline}\n|-actor = ${this.actor}`);

                const pixel_step = [
                    1.0 / texture.get_width(),
                    1.0 / texture.get_height()
                ];
                this.pre_paint_logged !== true && log(`|-pixel step ${pixel_step}`);

                this.pre_paint_logged !== true && log(`|-preparing to set pixel_step uniform.`);
                const pixel_step_uniform = pipeline.get_uniform_location('pixel_step');
                if(pixel_step_uniform){
                    pipeline.set_uniform_float(
                        pixel_step_uniform,
                        2,
                        1,
                        pixel_step
                    );
                    this.pre_paint_logged !== true && log(`|--pixel_step uniform set successfully.`);
                }

                pipeline.set_layer_texture(0, texture);
                this.pre_paint_logged !== true && log(`|--layer texture set.`);
                this.pre_paint_logged !== true && log(`|--return true`);
                this.pre_paint_logged = true;
                return true;
            }
            this.pre_paint_logged !== true && log(`|--return false`);
            this.pre_paint_logged = true;
            return false;
        }

        vfunc_paint_target(...params){
            this.paint_target_logged !== true && log(`${new Date().toISOString()} : BlurShader.vfunc_paint_target()`);
            super.vfunc_paint_target(...params);
            this.paint_target_logged !== true && log(`|-super function called.`);
            this.paint_target_logged = true;
        }
    }
);