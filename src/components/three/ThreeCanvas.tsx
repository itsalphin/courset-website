'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import JewelryModel from './JewelryModel';
import type { CustomizationState } from '@/lib/types';

interface ThreeCanvasProps {
  state: CustomizationState;
}

export default function ThreeCanvas({ state }: ThreeCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop="demand"
      camera={{ position: [0, 0, 4], fov: 45 }}
      style={{ background: 'transparent' }}
    >
      <Environment preset="studio" />
      <ambientLight intensity={0.3} />
      <JewelryModel state={state} />
      <ContactShadows position={[0, -1.2, 0]} opacity={0.3} blur={2} />
      <OrbitControls
        autoRotate
        autoRotateSpeed={1}
        enablePan={false}
        maxDistance={8}
        minDistance={2}
      />
    </Canvas>
  );
}
