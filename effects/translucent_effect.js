const GObject = imports.gi.GObject;
const Shell = imports.gi.Shell;

const TranslucentEffect = GObject.registerClass(
    {},
    class extends Shell.GLSLEffect {
        vfunc_build_pipeline(){
            this.add_glsl_snippet(
                Shell.SnippetHook.FRAGMENT,
                ``,
                `cogl_color_out = vec4(1.0, 0.0, 0.0, 0.5);`,
                false
            );
        }

        vfunc_paint_target(paint_node, paint_context){
            super.vfunc_paint_target(paint_node, paint_context);
        }
    }
);