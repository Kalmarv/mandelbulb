import { OrbitControls } from '@react-three/drei'
import { Canvas, extend, MaterialNode, useFrame, useThree } from '@react-three/fiber'
import { button, useControls } from 'leva'
import { useEffect, useMemo, useRef } from 'react'
import { Vector2, Vector3 } from 'three'
import { MandelbulbMaterial } from './shader'
import { CanvasCapture } from 'canvas-capture'
import { Github, Logo } from './logo'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mandelbulbMaterial: MaterialNode<any, typeof MandelbulbMaterial>
    }
  }
}

extend({ MandelbulbMaterial })

const Fragment: React.FC<{ dpr: number }> = ({ dpr }) => {
  const [{
    animSpeed,
    maxRaySteps,
    iterations,
    bailout,
    power,
    minStepDistance,
    rotate,
    animate,
    rotSpeed,
  }, set] = useControls(() => ({
    maxRaySteps: { value: 75, min: 1, max: 150, step: 1, label: 'Max Ray Steps' },
    iterations: { value: 16, min: 1, max: 100, step: 1, label: 'Iterations' },
    bailout: { value: 8, min: 0, max: 100, label: 'Bailout' },
    power: { value: 8, min: 0, max: 20, label: 'Progress' },
    minStepDistance: { value: 3.0, min: 0, max: 10, label: 'Min Step Distance' },
    rotate: true,
    rotSpeed: { value: 1, min: -10, max: 10, label: 'Rotation Speed' },
    animate: true,
    animSpeed: { value: 1, min: -10, max: 10, label: 'Animation Speed' },
  }))
  const { colors, color1, color2, color3, color4, color5, color6, color7, color8, color9 } =
    useControls(
      'Color Stuff',
      {
        colors: { value: 16, min: 1, max: 50, label: 'Color Depth' },
        color1: { value: 1.0, min: 0, max: 10, label: 'Color Stuff' },
        color2: { value: 2.0, min: 0, max: 10, label: 'Color Stuff' },
        color3: { value: 3.0, min: 0, max: 10, label: 'Color Stuff' },
        color4: { value: 1.0, min: 0, max: 10, label: 'Color Stuff' },
        color5: { value: 3.0, min: 0, max: 10, label: 'Color Stuff' },
        color6: { value: 3.0, min: 0, max: 10, label: 'Color Stuff' },
        color7: { value: 6.0, min: 0, max: 10, label: 'Color Stuff' },
        color8: { value: 0.0, min: 0, max: 10, label: 'Color Stuff' },
        color9: { value: 1.0, min: 0, max: 10, label: 'Color Stuff' },
      },
      {
        collapsed: true,
      }
    )
    const randomValues = useControls('Randomize', {
    'Random Values': button(() => {
      set({
        maxRaySteps: Math.random() * (100 - 50) + 50,
        iterations: Math.floor(Math.random() * 100),
        bailout: Math.random() * (30 - 2) + 2,
        power: Math.random() * (20 - 1) + 1,
        minStepDistance: Math.random() * (5 - 2) + 2,
      })
    })
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
      if (animate) mRef.current.power += 0.0001 * animSpeed
    }
  })

  useEffect(() => {
    camera.lookAt(new Vector3(0, 0, 2))
  }, [camera])

  return (
    <>
      <OrbitControls makeDefault autoRotate={rotate} autoRotateSpeed={0.1 * rotSpeed} />
      <mesh position={[0, 0, 0]} scale={1.0}>
        <planeBufferGeometry ref={gRef} args={[2, 2, 2]} />
        <mandelbulbMaterial
          ref={mRef}
          u_resolution={new Vector2(window.innerWidth * dpr, window.innerHeight * dpr)}
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
          color1={color1}
          color2={color2}
          color3={color3}
          color4={color4}
          color5={color5}
          color6={color6}
          color7={color7}
          color8={color8}
          color9={color9}
        />
      </mesh>
    </>
  )
}

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { dpr } = useControls({
    'Take Screenshot': button(() => CanvasCapture.takePNGSnapshot()),
    dpr: {
      value: 1,
      min: 0.1,
      max: 5,
      label: 'Resolution',
    },
  })

  /*
  If you see Uncaught ReferenceError: remaining is not defined in the console,
  it's caused by an extension. The capture will still work though. Try it out
  in incognito and you should see the error go away.

  SEE: https://github.com/amandaghassaei/canvas-capture/issues/10
   */

  useEffect(() => {
    if (canvasRef.current) CanvasCapture.init(canvasRef.current)
  }, [canvasRef])

  return (
    <>
      <Canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100vh' }}
        camera={{ position: [0, 0, 2] }}
        dpr={dpr}
        gl={{ preserveDrawingBuffer: true }}>
        <Fragment dpr={dpr} />
      </Canvas>
      <Logo />
      <Github />
    </>
  )
}

export default App
