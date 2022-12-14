precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float minimumStepDistance;
uniform int maxRaySteps;
uniform float colors;
uniform float d_est_u;
uniform int iterations;
uniform float power;
uniform float bailout;
uniform vec3 camPosition;
uniform mat4 camViewMatrix;
uniform mat4 camProjectionMatrix;
uniform vec3 focus;

uniform float color1;
uniform float color2;
uniform float color3;
uniform float color4;
uniform float color5;
uniform float color6;
uniform float color7;
uniform float color8;
uniform float color9;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(color1, color2 / color3, color4 / color5, color6);
  vec3 p = abs(fract(c.xxx + K.xyz) * color7 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, color8, color9), c.y);
}

float escape(vec3 position) {
  vec3 z = position;
  float trap = 0.0;
  float r = 0.0;
  float theta, phi, zr;
  int ii;
  for (int i = 0; i < 129; i++) {
    ii = i;
    if (float(i) >= colors)
      return 1.0;
    r = length(z);
    if (r > bailout)
      break;
    trap += r;

    theta = power * atan(sqrt(z.x * z.x + z.y * z.y), z.z);
    phi = power * atan(z.y, z.x);
    zr = pow(r, power);
    z = vec3(zr * sin(theta) * cos(phi) + position.x,
             zr * sin(phi) * sin(theta) + position.y,
             zr * cos(theta) + position.z);
  }
  return 0.25 * ((trap * log(minimumStepDistance)) / (10.0 * float(ii)));
}

float DE(vec3 position) {
  vec3 z = position;
  float dr = 1.0;
  float r = 0.0;
  float theta, phi, zr;
  for (int i = 0; i < 64; ++i) {
    if (i > iterations)
      break;
    r = length(z);
    if (r > bailout)
      break;

    theta = power * atan(sqrt(z.x * z.x + z.y * z.y), z.z);
    phi = power * atan(z.y, z.x);
    zr = pow(r, power);
    z = vec3(zr * sin(theta) * cos(phi) + position.x,
             zr * sin(phi) * sin(theta) + position.y,
             zr * cos(theta) + position.z);
    dr = (pow(r, power - 1.0) * power * dr) + 1.0;
  }
  return 0.5 * log(r) * r / dr;
}

vec3 normalOf(vec3 pos) {
  float eps = abs(d_est_u / 100.0);
  return normalize(
      vec3(DE((pos + vec3(eps, 0, 0))) - DE((pos - vec3(eps, 0, 0))),
           DE((pos + vec3(0, eps, 0))) - DE(pos - vec3(0, eps, 0)),
           DE(pos + vec3(0, 0, eps)) - DE(pos - vec3(0, 0, eps))));
}

vec3 march(vec3 from, vec3 direction) {
  float totalDistance = 0.0;
  float dist;
  vec3 position;
  int steps;
  for (int steps = 0; steps < 100; steps++) {
    if (steps >= maxRaySteps)
      break;
    position = vec3(from.x + (direction.x * totalDistance),
                    from.y + (direction.y * totalDistance),
                    from.z + (direction.z * totalDistance));
    dist = DE(position);
    totalDistance += dist;
    if (totalDistance > max(d_est_u * 2.0, 4.0))
      return vec3(0.0, 0.0, 0.0);
    if (dist < minimumStepDistance) {
      return vec3(escape(position), 0.55,
                  (1.0 - float(steps) / float(maxRaySteps)));
    }
  }
}

vec2 linmap(vec2 in_val, vec2 in_min, vec2 in_max, vec2 out_min, vec2 out_max) {
  return (in_val - in_min) / (in_max - in_min) * (out_max - out_min) + out_min;
}

void main(void) {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 fragCoord = linmap(gl_FragCoord.xy, vec2(0, 0), u_resolution,
                          vec2(-1.0, -1.0), vec2(1.0, 1.0));
  vec3 rayDirection =
      normalize(inverse(mat3(camProjectionMatrix) * mat3(camViewMatrix)) *
                vec3(fragCoord, 1.0));

  gl_FragColor = vec4(hsv2rgb(march(camPosition, rayDirection)), 1.0);
}