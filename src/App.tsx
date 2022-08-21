import { OrbitControls } from '@react-three/drei'
import { Canvas, extend, MaterialNode, useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { useEffect, useRef, useState } from 'react'
import { Vector2, Vector3 } from 'three'
import { MandelbulbMaterial } from './shader'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mandelbulbMaterial: MaterialNode<any, typeof MandelbulbMaterial>
    }
  }
}

extend({ MandelbulbMaterial })

const Fragment = () => {
  const { maxRaySteps, colors, iterations, bailout, power, minStepDistance, rotate, animate } =
    useControls({
      maxRaySteps: {
        value: 75,
        min: 1,
        max: 100,
        step: 1,
        label: 'Max Ray Steps',
      },
      colors: {
        value: 16,
        min: 1,
        max: 50,
        step: 1,
        label: 'Color Range',
      },
      iterations: {
        value: 16,
        min: 1,
        max: 100,
        step: 1,
        label: 'Iterations',
      },
      bailout: {
        value: 8,
        min: 0,
        max: 100,
        label: 'Bailout',
      },
      power: {
        value: 8,
        min: 0,
        max: 20,
        label: 'Power',
      },
      minStepDistance: {
        value: 3.0,
        min: 0,
        max: 10,
        label: 'Min Step Distance',
      },
      rotate: true,
      animate: true,
    })
  const mRef = useRef<any>()
  const gRef = useRef<THREE.PlaneBufferGeometry>(null!)
  const { camera } = useThree()

  useFrame((state) => {
    if (mRef.current) {
      mRef.current.u_time = state.clock.getElapsedTime()
      mRef.current.camPosition = camera.position
      mRef.current.camViewMatrix = camera.matrixWorldInverse.elements
      mRef.current.camProjectionMatrix = camera.projectionMatrix.elements
      if (animate) mRef.current.power += 0.0001
    }
  })

  useEffect(() => {
    camera.lookAt(new Vector3(0, 0, 2))
  }, [camera])

  return (
    <>
      <OrbitControls makeDefault autoRotate={rotate} autoRotateSpeed={0.1} />
      <mesh position={[0, 0, 0]} scale={1.0}>
        <planeBufferGeometry ref={gRef} args={[2, 2, 2]} />
        <mandelbulbMaterial
          ref={mRef}
          u_resolution={new Vector2(window.innerWidth, window.innerHeight)}
          minimumStepDistance={Math.pow(10, -1 * minStepDistance)}
          maxRaySteps={maxRaySteps}
          colors={colors}
          d_est_u={1}
          iterations={iterations}
          power={power}
          bailout={bailout}
          camPosition={camera.position}
          camViewMatrix={[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
          camProjectionMatrix={[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
        />
      </mesh>
    </>
  )
}

const App = () => {
  return (
    <>
      <Canvas style={{ width: '100%', height: '100vh' }} camera={{ position: [0, 0, 2] }}>
        <Fragment />
      </Canvas>
    </>
  )
}

export default App
