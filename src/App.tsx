import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas, extend, MaterialNode, useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { useRef } from 'react'
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
  const { color } = useControls({ color: '#ff0000' })
  const mRef = useRef<any>()
  const gRef = useRef<THREE.PlaneBufferGeometry>(null!)

  useFrame((state) => {
    if (mRef.current) {
      mRef.current.u_time = state.clock.getElapsedTime()
    }
  })

  return (
    <mesh position={[0, 0, 0]} scale={1.0}>
      <planeBufferGeometry ref={gRef} args={[1, 1, 1]} />
      <mandelbulbMaterial
        ref={mRef}
        u_resolution={new Vector2(window.innerWidth, window.innerHeight)}
        minimumStepDistance={Math.pow(10, -1 * 3.0)}
        maxRaySteps={75}
        colors={16}
        d_est_u={0}
        iterations={16}
        power={8.0}
        bailout={8.0}
        camera={new Vector3(2, 2, 2)}
        focus={new Vector3(0, 0, 0)}
      />
    </mesh>
  )
}

const App = () => {
  return (
    <>
      <Canvas style={{ width: '100%', height: '100vh' }}>
        <ambientLight />
        <OrbitControls makeDefault />
        <Environment preset='sunset' />
        <pointLight position={[10, 10, 10]} />
        <Fragment />
      </Canvas>
    </>
  )
}

export default App
