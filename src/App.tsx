import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas, extend, MaterialNode, useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { useEffect, useRef } from 'react'
import { Matrix4, Vector2, Vector3 } from 'three'
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
  // const { color } = useControls({ color: '#ff0000' })
  const mRef = useRef<any>()
  const gRef = useRef<THREE.PlaneBufferGeometry>(null!)
  const { camera } = useThree()

  useFrame((state) => {
    if (mRef.current) {
      mRef.current.u_time = state.clock.getElapsedTime()
      mRef.current.camPosition = camera.position
      mRef.current.camViewMatrix = camera.matrixWorldInverse.elements
      mRef.current.camProjectionMatrix = camera.projectionMatrix.elements
    }
  })

  useEffect(() => {
    camera.lookAt(new Vector3(0, 0, 2))
  }, [camera])

  return (
    <mesh position={[0, 0, 0]} scale={1.0}>
      <planeBufferGeometry ref={gRef} args={[2, 2, 2]} />
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
        focus={new Vector3(0, 0, 0)}
        camPosition={new Vector3(0, 0, 2)}
        camViewMatrix={[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
        camProjectionMatrix={[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
      />
    </mesh>
  )
}

const App = () => {
  return (
    <>
      <Canvas style={{ width: '100%', height: '100vh' }} camera={{ position: [0, 0, 0] }}>
        <OrbitControls makeDefault />
        <Fragment />
      </Canvas>
    </>
  )
}

export default App
