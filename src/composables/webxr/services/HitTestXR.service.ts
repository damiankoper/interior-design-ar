import { XRFrame, XRHitTestSource, XRReferenceSpace, XRSession } from "three";
import { Service } from "typedi";
import * as THREE from "three";
import { ServiceLifecycle } from "../interfaces/ServiceLifecycle.interface";
import { XRHitTestResult, XRAnchor, XRRigidTransform } from "webxr";

@Service()
export class HitTestXRService implements ServiceLifecycle {
  private sourceRequested = false;
  private hitTestSource: XRHitTestSource | null = null;
  private _lastHitTestResult: XRHitTestResult | null = null;

  private anchors = new Map<
    THREE.Object3D,
    { object: THREE.Object3D; anchor: XRAnchor; transform?: THREE.Matrix4 }
  >();

  public get lastHitTestResult() {
    return this._lastHitTestResult;
  }

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
        this._lastHitTestResult = hit as XRHitTestResult;
        const matrix = hit.getPose(referenceSpace)?.transform.matrix;
        if (matrix) return new THREE.Matrix4().fromArray(matrix);
      }
    }
    return null;
  }

  public async anchorObject(object: THREE.Object3D, transform?: THREE.Matrix4) {
    const hit = this.lastHitTestResult;
    if (hit && hit.createAnchor) {
      // Note: argument 0 is because of typings bug (no arguments requried)
      const anchor = await hit.createAnchor(0 as unknown as XRRigidTransform);

      this.anchors.set(object, {
        object,
        anchor,
        transform,
      });
    }
  }

  public removeAnchor(object: THREE.Object3D) {
    this.anchors.delete(object);
  }

  public updateAnchors(
    frame: XRFrame,
    referenceSpace: XRReferenceSpace,
    objectSelceted: THREE.Object3D | null
  ) {
    for (const [object, { anchor, transform }] of this.anchors) {
      if (frame.trackedAnchors?.has(anchor) && object !== objectSelceted) {
        const matrix = frame.getPose(anchor.anchorSpace, referenceSpace)
          ?.transform.matrix;
        if (matrix) {
          const matrixThree = new THREE.Matrix4().fromArray(matrix);
          if (transform) matrixThree.multiply(transform);
          object.matrix.copy(matrixThree);
          object.matrix.multiply(
            new THREE.Matrix4().makeRotationY(object.userData.panRotateY)
          );
        }
      } else {
        this.anchors.delete(object);
      }
    }
  }

  public async destroy() {
    this.hitTestSource = null;
    this.sourceRequested = false;
  }
}
