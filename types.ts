import { Vector3, Color } from 'three';

export enum TreeMorphState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE'
}

export interface ParticleData {
  id: number;
  // Position in the scattered cloud
  scatterPosition: Vector3;
  // Position in the ordered cake/tree shape
  treePosition: Vector3;
  // Base color of the particle
  color: Color;
  // Individual scale variance
  scale: number;
  // Random rotation speed
  rotationSpeed: Vector3;
}

export interface AppState {
  currentState: TreeMorphState;
  setAppState: (state: TreeMorphState) => void;
}

// Augment JSX namespace to fix intrinsic element errors in R3F components
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      spotLight: any;
      pointLight: any;
      instancedMesh: any;
      icosahedronGeometry: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      meshPhysicalMaterial: any;
      color: any;
      fog: any;
      group: any;
      mesh: any;
      torusGeometry: any;
      cylinderGeometry: any;
      tubeGeometry: any;
      sphereGeometry: any;
      primitive: any;
    }
  }
}