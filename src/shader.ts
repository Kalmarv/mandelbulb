import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'
import vert from './shaders/vert.glsl?raw'
import frag from './shaders/frag.glsl?raw'

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
  vert,
  frag
)

extend({ MandelbulbMaterial })
