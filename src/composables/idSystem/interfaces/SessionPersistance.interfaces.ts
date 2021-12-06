import * as THREE from "three";

export interface SessionObject {
  modelId: string;
  matrix: THREE.Matrix4Tuple;
}

export interface SessionPersistance {
  saveScene(group: THREE.Scene): void;

  getScene(): Promise<THREE.Group | null>;

  readonly isSceneSaved: boolean;
}
