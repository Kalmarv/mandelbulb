import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

export const MandelbulbMaterial = shaderMaterial(
  // Uniforms
  {
    u_resolution: new THREE.Vector2(0, 0),
    u_time: 0,
    minimumStepDistance: 3.0,
    maxRaySteps: 75,
    colors: 16,
    d_est_u: 0,
    iterations: 16,
    power: 8.0,
    bailout: 8.0,
    focus: new THREE.Vector3(0, 0, 0),
    camPosition: new THREE.Vector3(0, 0, 0),
    camViewMatrix: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    camProjectionMatrix: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  // Vertex Shader
  // "uv" is accessible globally inside the Vertex Shader
  `
  void main(){
    gl_Position = vec4(position, 1.0);
}
  `,
  // Fragment Shader
  `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  
  uniform float minimumStepDistance;
  uniform int maxRaySteps;
  uniform int colors;
  uniform float d_est_u;
  uniform int iterations;
  uniform float power;
  uniform float bailout;
  float zoom = 2.0;
  uniform vec3 camPosition;
  uniform mat4 camViewMatrix;
  uniform mat4 camProjectionMatrix;
  uniform vec3 focus;
  
  vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  vec3 toRectangular(vec3 sph) {
      return vec3(sph.x*sin(sph.z)*cos(sph.y),
                  sph.x*sin(sph.z)*sin(sph.y),
                  sph.x*cos(sph.z));
  }

  vec3 toSpherical(vec3 rec) {
      return vec3(length(rec),
                  atan(rec.y,rec.x),
                  atan(sqrt(rec.x*rec.x+rec.y*rec.y),
                  rec.z));
  }

  float escape(vec3 position) {
      vec3 z = position;
      float trap = 0.0;
      float r = 0.0;
      float theta,phi,zr;
      int ii;
      for(int i=0;i<129;i++) {
        ii = i;
        if (i>=colors) return 1.0;//-trap/float(colors);
        r = length(z);
        if (r>bailout) break;
        trap+=r;

        theta = power*atan(sqrt(z.x*z.x+z.y*z.y),z.z);
        phi = power*atan(z.y,z.x);
        zr = pow(r,power);
        z = vec3( zr*sin(theta)*cos(phi) + position.x,
                  zr*sin(phi)*sin(theta) + position.y,
                  zr*cos(theta) + position.z     );
      }
      return 0.25*((trap*log(minimumStepDistance))/(10.0*float(ii)));
}

  float DE(vec3 position) {
    vec3 z = position;
      float dr = 1.0;
      float r = 0.0;
      float theta,phi,zr;
      for(int i=0;i<64;++i) {
          if(i>iterations) break;
          r = length(z);
          if(r>bailout) break;
          
          theta = power*atan(sqrt(z.x*z.x+z.y*z.y),z.z);
          phi = power*atan(z.y,z.x);
          zr = pow(r,power);
      z = vec3(     zr*sin(theta)*cos(phi) + position.x,
                    zr*sin(phi)*sin(theta) + position.y,
                    zr*cos(theta) + position.z     );
        dr = ( pow(r, power-1.0)*power*dr ) + 1.0;        
      }
      return 0.5*log(r)*r/dr;
      // return (0.85 - length(position)) + 0.5*log(r)*r/dr;
  }
  
vec3 normalOf(vec3 pos) {
  float eps = abs(d_est_u/100.0);
  return normalize(vec3(DE( (pos + vec3(eps,0,0)) )-DE( (pos-vec3(eps,0,0)) ),
                  DE( (pos+vec3(0,eps,0)))-DE(pos-vec3(0,eps,0)),
                  DE(pos+vec3(0,0,eps))-DE(pos-vec3(0,0,eps))));     
}

vec3 march(vec3 from, vec3 direction) {
    float totalDistance = 0.0;
      float dist;
      vec3 position;
      int steps;
      for (int steps=0;steps<100;steps++) {
          if (steps>=maxRaySteps) break;
          position = vec3(from.x + (direction.x*totalDistance),
                          from.y + (direction.y*totalDistance),
                          from.z + (direction.z*totalDistance));
          dist=DE(position);
          totalDistance+=dist;
      // if(totalDistance>9.0) return vec3(0.533,1.0,0.21);
    if(totalDistance>max(d_est_u*2.0,4.0)) return vec3(0.0,0.0,0.0);
          if(dist<minimumStepDistance) {
            return vec3(escape(position),0.55,(1.0-float(steps)/float(maxRaySteps)));
          }
    }
  }

  vec2 linmap(vec2 in_val, vec2 in_min, vec2 in_max, vec2 out_min, vec2 out_max)
  {
      return (in_val - in_min) / (in_max - in_min) * (out_max - out_min) + out_min;
  }

  void main(void) {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      vec2 fragCoord = linmap(gl_FragCoord.xy, vec2(0, 0), u_resolution, vec2(-1.0, -1.0), vec2(1.0, 1.0));
      vec3 rayDirection = normalize(inverse(mat3(camProjectionMatrix) * mat3(camViewMatrix)) * vec3(fragCoord, 1.0));

      gl_FragColor = vec4(hsv2rgb(march(camPosition,rayDirection)),1.0);
  }
  `
)

extend({ MandelbulbMaterial })
