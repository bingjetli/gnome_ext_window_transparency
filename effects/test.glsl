uniform vec2 pixel_step;

void main(){
    cogl_color_out = vec4(
        cogl_color_out.rgb,
        cogl_color_out.a * 0.9
    );
}