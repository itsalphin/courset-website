'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { CustomizationState } from '@/lib/types';

interface JewelryModelProps {
  state: CustomizationState;
}

const METAL_COLORS: Record<string, string> = {
  'yellow-gold-10': '#E8D5A3',
  'yellow-gold-14': '#E6C87E',
  'yellow-gold-18': '#DAA520',
  'yellow-gold-24': '#FFD700',
  'white-gold': '#E8E8E8',
  'rose-gold': '#E8B4A0',
  'platinum': '#D4D4D8',
};

const METAL_PROPS: Record<string, { metalness: number; roughness: number }> = {
  'yellow-gold-10': { metalness: 0.9, roughness: 0.2 },
  'yellow-gold-14': { metalness: 0.92, roughness: 0.15 },
  'yellow-gold-18': { metalness: 0.95, roughness: 0.1 },
  'yellow-gold-24': { metalness: 0.98, roughness: 0.05 },
  'white-gold': { metalness: 0.95, roughness: 0.1 },
  'rose-gold': { metalness: 0.92, roughness: 0.12 },
  'platinum': { metalness: 0.97, roughness: 0.08 },
};

function getMetalKey(state: CustomizationState): string {
  if (state.metalType === 'yellow-gold') return `yellow-gold-${state.karat}`;
  return state.metalType;
}

export default function JewelryModel({ state }: JewelryModelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const targetColor = useRef(new THREE.Color());

  const metalKey = getMetalKey(state);
  const color = METAL_COLORS[metalKey] || '#E6C87E';
  const props = METAL_PROPS[metalKey] || METAL_PROPS['yellow-gold-14'];

  targetColor.current.set(color);

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.color.lerp(targetColor.current, 0.08);
    }
  });

  const diamondScale = state.diamond.enabled ? 0.5 + state.diamond.size * 0.5 : 0;

  return (
    <group>
      {/* Jewelry base */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        {state.shape === 'ball' ? (
          <sphereGeometry args={[0.8, 64, 64]} />
        ) : state.shape === 'court' ? (
          <boxGeometry args={[1.4, 0.15, 1]} />
        ) : (
          <torusGeometry args={[0.8, 0.25, 32, 64]} />
        )}
        <meshPhysicalMaterial
          ref={materialRef}
          color={color}
          metalness={props.metalness}
          roughness={props.roughness}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Diamond */}
      {state.diamond.enabled && diamondScale > 0 && (
        <mesh position={[0, 0.4, 0]} scale={diamondScale}>
          <icosahedronGeometry args={[0.2, 2]} />
          <meshPhysicalMaterial
            transmission={0.95}
            thickness={0.5}
            roughness={0}
            ior={2.42}
            color="#F0F8FF"
            envMapIntensity={2}
          />
        </mesh>
      )}
    </group>
  );
}
