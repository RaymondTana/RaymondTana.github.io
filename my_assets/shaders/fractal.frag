#version 300 es
precision highp float;

in  vec2 v_uv; // mapped [0,1] across screen
out vec4 outColor;

uniform int u_fractalType; // 0, 1, 2, 3, 4, 5
uniform vec2 u_c; // parameter
uniform int u_maxIter; 
uniform float u_B; // bound to exceed
uniform vec2 u_center; // complex plane center
uniform float u_scale; // half-width of view

uniform vec2 u_resolution; 

// Helper: HSV → RGB  (from iq/Book of Shaders)
vec3 hsv2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 newtonRootColor(vec2 z) { // map each root to a color
  if (distance(z, vec2(1.0, 0.0)) < 0.001) return vec3(1.0, 0.2, 0.2); // red
  if (distance(z, vec2(-0.5, 0.8660254)) < 0.001) return vec3(0.2, 1.0, 0.4); // green
  return vec3(0.2, 0.4, 1.0); // blue
}
// |z³-1|
float newtonF(vec2 z) { 
  return length(vec2(
    z.x * z.x * z.x - 3.0 * z.x * z.y * z.y - 1.0,
    3.0 * z.x * z.x * z.y - z.y * z.y * z.y
  )); 
}

void main() {
  // Map the fragment/pixel to the complex plane
  // [-scale, scale] + center
  vec2 uv = (v_uv - 0.5) * u_scale * 2.0 + u_center; 

  vec2 z0, C;
  if(u_fractalType == 0) {
    z0 = vec2(0.0);
    C  = uv;
  } else {
    z0 = uv;
    C  = u_c;
  }

  // The fractal membership calculation...
  int it = u_maxIter;
  vec2 z = z0;

  if (u_fractalType == 3) { // Burning Ship
    for(int i = 0; i < u_maxIter; i++){
      z = vec2(abs(z.x), abs(z.y)); // abs before squaring
      z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + C;
      if(dot(z, z) > u_B){ it = i; break; }
    }
  }
  else if (u_fractalType == 4) { // Tricorn
    for(int i = 0; i < u_maxIter; i++){
      z = vec2(z.x, -z.y); // conjugate
      z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + C;
      if(dot(z,z) > u_B){ it = i; break; }
    }
  }
  else if (u_fractalType == 5) { // Newton z^3-1
    float eps = 1e-4;
    for(int i = 0; i < u_maxIter; i++){
      float r2 = dot(z,z);
      vec2 z2 = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
      vec2 z3 = vec2(z2.x * z.x - z2.y * z.y, z2.x * z.y + z2.y * z.x);
      vec2 f = z3 - vec2(1.0, 0.0); // f = z³-1
      if(length(f) < eps){ it = i; break; }
      vec2 fPrime = 3.0 * z2; // 3 z²
      // complex division f/f'
      float denom = dot(fPrime, fPrime);
      vec2 frac = vec2(
        f.x * fPrime.x + f.y * fPrime.y,
        f.y * fPrime.x - f.x * fPrime.y) / denom;
      z = z - frac;
    }
  }
  else { // Mandelbrot / Julia / Fatou paths
    for(int i = 0; i < u_maxIter; i++){
      z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + C;
      if(dot(z, z) > u_B){ it = i; break; }
    }
  }

  bool escaped = (it < u_maxIter);
  float smoothVal = 0.0;
  if(escaped) {
    float mu = float(it);
    float log_zn = log(dot(z, z)) / 2.0;
    float nu = log(log_zn / log(2.0)) / log(2.0);
    smoothVal = (mu + 1.0 - nu) / float(u_maxIter); 
  }
  smoothVal = clamp(smoothVal, 0.0, 1.0);

  float hue = mod(smoothVal * 0.8, 1.0); // cycles through palette
  float sat = 0.8; // constant saturation
  float val = escaped ? 1.0 : 0.0; // interior = black

  vec3 baseColor = hsv2rgb(vec3(hue, sat, val));

  // Alterations for the sets
  // Mandelbrot
  if (u_fractalType == 0) { 
    baseColor = hsv2rgb(vec3(hue, 0.8, val));
  }
  // Julia
  else if (u_fractalType == 1) { 
      baseColor = hsv2rgb(vec3(hue + 0.33, 0.9, val));
  }
  // Fatou
  else if (u_fractalType == 2) { 
      baseColor = escaped
          ? hsv2rgb(vec3(hue, 0.8, 1.0))
          : vec3(1.0, 0.95, 0.6);
  }
  // Burning Ship: fire palette
  else if (u_fractalType == 3) { 
    baseColor = hsv2rgb(vec3(0.04 + 0.96 * smoothVal, 1.0, escaped ? 1.0 : 0.0));
  }
  // Tricorn: icy palette
  else if (u_fractalType == 4) { 
    baseColor = hsv2rgb(vec3(0.55 + 0.45 * smoothVal, 0.6, escaped ? 1.0 : 0.0));
  }
  // Newton: root–basin coloring
  else if (u_fractalType == 5) { 
    bool converged = (it < u_maxIter);
    baseColor = converged
        ? newtonRootColor(z) * (0.5 + 0.5 * float(it) / float(u_maxIter))
        : vec3(0.0);
  }

  // baseColor *= vec3(val);
  
  outColor = vec4(baseColor, 1.0);
}