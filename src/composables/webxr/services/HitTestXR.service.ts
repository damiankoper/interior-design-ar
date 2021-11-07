import { XRFrame, XRHitTestSource, XRReferenceSpace, XRSession } from "three";
import { Service } from "typedi";
import * as THREE from "three";
import { ServiceLifecycle } from "../interfaces/ServiceLifecycle.interface";

@Service()
export class HitTestXRService implements ServiceLifecycle {
  private sourceRequested = false;
  private hitTestSource: XRHitTestSource | null = null;

  public async init(): Promise<void> {
    //
  }

  public async requestSource(session: XRSession) {
    if (!this.sourceRequested) this.sourceRequested = true;
    const referenceSpace = await session.requestReferenceSpace("viewer");
    this.hitTestSource = await session.requestHitTestSource({
      space: referenceSpace,
    });
  }

  public getHitTransformMatrix(
    frame: XRFrame,
    referenceSpace: XRReferenceSpace
  ): THREE.Matrix4 | null {
    if (this.hitTestSource) {
      const hitTestResults = frame.getHitTestResults(this.hitTestSource);
      if (hitTestResults.length) {
        const hit = hitTestResults[0];
        const matrix = hit.getPose(referenceSpace)?.transform.matrix;
        if (matrix) return new THREE.Matrix4().fromArray(matrix);
      }
    }
    return null;
  }

  public async destroy() {
    this.hitTestSource = null;
    this.sourceRequested = false;
  }
}
