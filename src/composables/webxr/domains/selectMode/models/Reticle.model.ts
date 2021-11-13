import * as THREE from "three";
import { HitTestXRService } from "../../../services/HitTestXR.service";
import { XRFrame, XRReferenceSpace } from "three";
import { SessionLifecycle } from "../../../interfaces/SessionLifecycle.interface";

export class Reticle implements SessionLifecycle {
  private model?: THREE.Mesh;

  public init(scene: THREE.Scene): void {
    const geometry = new THREE.CircleBufferGeometry(0.15, 32);
    geometry.rotateX(-Math.PI / 2);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      reflectivity: 0.75,
    });
    this.model = new THREE.Mesh(geometry, material);
    this.model.matrixAutoUpdate = false;
    scene.add(this.model);
  }

  public update(
    frame: XRFrame,
    referenceSpace: XRReferenceSpace,
    hitTestService: HitTestXRService
  ): void {
    if (!this.model) return;
    const matrix = hitTestService.getHitTransformMatrix(frame, referenceSpace);
    if (matrix) {
      this.model.visible = true;
      this.model.matrix = matrix;
    } else {
      this.model.visible = false;
    }
  }

  public destroy(scene: THREE.Scene): void {
    if (!this.model) return;

    if (this.model.material instanceof THREE.Material)
      this.model.material.dispose();

    if (this.model.geometry instanceof THREE.BufferGeometry)
      this.model.geometry.dispose();

    scene.remove(this.model);
  }
}
