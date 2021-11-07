import { XRFrame, XRReferenceSpace } from "three";
import * as THREE from "three";
import { HitTestXRService } from "../services/HitTestXR.service";

export interface SessionLifecycle {
  init(scene: THREE.Scene): void;
  update(
    frame: XRFrame,
    referenceSpace: XRReferenceSpace,
    hitTestService: HitTestXRService
  ): void;
  destroy(scene: THREE.Scene): void;
}
