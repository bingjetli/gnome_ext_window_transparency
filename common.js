//Internal function to print log messages to journalctl.
//There are different `log_levels`--zero (0) being the top-
//level log message, and four (4) being the most nested-
//level--along with being able to specify a `namespace`
//to specify where these log messages are originating from.
//The default namespace is `generic`, meaning a generic log
//message.
var __log = (string, log_level=0, namespace='generic') => {
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

//Internal function to load .glsl shaders from ./effects/*.glsl.
//This function takes `shader_name` as a parameter--which is a
//string containing the name of the .glsl shader to load--and
//returns an array containing the `declarations` and `logic`
//of the shader.
var __importGlslShader = shader_name => {
    const shader_path = `${Me.path}/effects/${shader_name}`;
    const shader = Shell.get_file_contents_utf8_sync(shader_path);

    const [declarations, logic] = shader.split(/^.*?main\(\s?\)\s?/m);

    return [declarations.trim(), logic.trim().replace(/^[{}]/gm, '').trim()];
};