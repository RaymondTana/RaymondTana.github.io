// Creates an API for the GL code 
export default async function initFractalRenderer(canvas) {
    // Entry point to the GPU (the context)
    // Included the `preserveDrawingBuffer` for saving to PNG
    const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true });
    // Hope WebGL2 is supported!
    if(!gl) throw new Error('WebGL2 not supported');

    // Declare the relevant shaders
    const [vertSrc, fragSrc] = await Promise.all([
        fetch('/my_assets/shaders/fractal.vert').then(r => r.text()),
        fetch('/my_assets/shaders/fractal.frag').then(r => r.text())
    ]);

    // Helper function for compiling a shader
    function compile(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        // Check for compilation errors
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
          throw new Error(gl.getShaderInfoLog(s));
        }
        return s;
    }

    // Create and link the program
    const vertShader = compile(gl.VERTEX_SHADER, vertSrc);
    const fragShader = compile(gl.FRAGMENT_SHADER, fragSrc);
    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program));
    }
  
    // get all the uniform locations
    const uFractalTypeLoc = gl.getUniformLocation(program, 'u_fractalType');
    const uCLoc = gl.getUniformLocation(program, 'u_c');
    const uMaxIterLoc = gl.getUniformLocation(program, 'u_maxIter');
    const uBLoc = gl.getUniformLocation(program, 'u_B');
    const uCenterLoc = gl.getUniformLocation(program, 'u_center');
    const uScaleLoc = gl.getUniformLocation(program, 'u_scale');
    const uResolutionLoc = gl.getUniformLocation(program, 'u_resolution');

  
    // set up VAO 
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const positions = new Float32Array([
        -1, -1,
        1, -1,
        -1,  1,
        1,  1
    ]);
    // upload data to a buffer
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    // tell the GPU how to pull those numbers into the `a_position` attribute
    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    // unbind the VAO to avoid accidental changes
    gl.bindVertexArray(null);
    // set the viewport to match the canvas size
    // gl.viewport(0, 0, canvas.width, canvas.height);
  
    function resize() {
        const dpr  = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width  = rect.width  * dpr;
        canvas.height = rect.height * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
      
        // only upload if the shader actually has the uniform
        if (uResolutionLoc) {
          gl.useProgram(program);
          gl.uniform2fv(uResolutionLoc, new Float32Array([canvas.width, canvas.height]));
        }
      }

    resize();

    return {
      draw({ fractalType, c, maxIter, B, center, scale }) {
        gl.useProgram(program);
        gl.bindVertexArray(vao);
  
        // upload uniforms
        gl.uniform1i(uFractalTypeLoc, fractalType);
        gl.uniform2fv(uCLoc, c);
        gl.uniform1i(uMaxIterLoc, maxIter);
        gl.uniform1f(uBLoc, B);
        gl.uniform2fv(uCenterLoc, center);
        gl.uniform1f(uScaleLoc, scale);
  
        // draw the geometry
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.bindVertexArray(null);
      }, resize
    }
  }
  