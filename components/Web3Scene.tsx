"use client"

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Float, Text3D } from '@react-three/drei'
import { Suspense } from 'react'

function Cube({ position = [0, 0, 0], color = "#6366f1" }) {
  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh position={position} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </Float>
  )
}

function Sphere({ position = [0, 0, 0], color = "#8b5cf6" }) {
  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh position={position} castShadow receiveShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </Float>
  )
}

export default function Web3Scene() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 10], fov: 45 }}>
      <Suspense fallback={null}>
        <Environment preset="city" />
        
        <group position={[0, 0, 0]}>
          <Cube position={[-2, 0, 0]} color="#6366f1" />
          <Sphere position={[0, 1, 0]} color="#8b5cf6" />
          <Cube position={[2, 0, 0]} color="#ec4899" />
          
          <Text3D
            font="/fonts/Inter_Bold.json"
            position={[-2, -2, 0]}
            scale={0.5}
          >
            Web3
            <meshStandardMaterial color="#6366f1" />
          </Text3D>
        </group>

        <OrbitControls enableZoom={false} />
      </Suspense>
    </Canvas>
  )
}

