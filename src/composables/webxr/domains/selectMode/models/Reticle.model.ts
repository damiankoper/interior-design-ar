import * as THREE from "three";
import { HitTestXRService } from "../../../services/HitTestXR.service";
import { XRFrame, XRReferenceSpace } from "three";
import { SessionLifecycle } from "../../../interfaces/SessionLifecycle.interface";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const loader = new GLTFLoader();

export class Reticle implements SessionLifecycle {
  private model?: THREE.Group;
  private rotationY = 0;

  public async init(scene: THREE.Scene): Promise<void> {
    this.model = (await loader.loadAsync("/reticle.glb")).scene;
    this.model.matrixAutoUpdate = false;
    scene.add(this.model);
  }

  public show() {
    if (this.model) this.model.visible = true;
  }
  public hide() {
    if (this.model) this.model.visible = false;
  }

  public update(
    frame: XRFrame,
    referenceSpace: XRReferenceSpace,
    hitTestService: HitTestXRService
  ): void {
    if (!this.model) return;
    const matrix = hitTestService.getHitTransformMatrix(frame, referenceSpace);
    if (matrix) {
      this.rotationY = (this.rotationY + 0.05) % (Math.PI * 2);
      this.model.visible = true;
      this.model.matrix.copy(matrix);
      this.model.matrix.multiply(
        new THREE.Matrix4().makeRotationY(this.rotationY)
      );
    } else {
      this.model.visible = false;
    }
  }

  public destroy(scene: THREE.Scene): void {
    if (!this.model) return;
    scene.remove(this.model);
    this.model.traverse((sceneObject) => {
      if (sceneObject instanceof THREE.Mesh) {
        sceneObject.material.dispose();
        sceneObject.geometry.dispose();
      }
    });
  }
}
