uniform vec2 pixel_step;

void main(){
    cogl_texel = texture2D(cogl_sampler, cogl_tex_coord.st);
    cogl_texel += texture2D(cogl_sampler, cogl_tex_coord.st + pixel_step * vec2(-1.0, -1.0));
    cogl_texel += texture2D(cogl_sampler, cogl_tex_coord.st + pixel_step * vec2(0.0, -1.0));
    cogl_texel += texture2D(cogl_sampler, cogl_tex_coord.st + pixel_step * vec2(1.0, -1.0));
    cogl_texel += texture2D(cogl_sampler, cogl_tex_coord.st + pixel_step * vec2(1.0, 0.0));
    cogl_texel += texture2D(cogl_sampler, cogl_tex_coord.st + pixel_step * vec2(1.0, 1.0));
    cogl_texel += texture2D(cogl_sampler, cogl_tex_coord.st + pixel_step * vec2(0.0, 1.0));
    cogl_texel += texture2D(cogl_sampler, cogl_tex_coord.st + pixel_step * vec2(-1.0, 1.0));
    cogl_texel += texture2D(cogl_sampler, cogl_tex_coord.st + pixel_step * vec2(-1.0, 0.0));
    cogl_texel /= 9.0;
    cogl_texel.a = 1.0;
}