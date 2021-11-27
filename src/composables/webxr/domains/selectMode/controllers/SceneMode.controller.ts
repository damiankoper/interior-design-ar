import { SessionLifecycle } from "@/composables/webxr/interfaces/SessionLifecycle.interface";
import { HitTestXRService } from "@/composables/webxr/services/HitTestXR.service";
import { OverlayXRService } from "@/composables/webxr/services/OverlayXR.service";
import { SceneXRService } from "@/composables/webxr/services/SceneXR.service";
import { SessionXRService } from "@/composables/webxr/services/SessionXR.service";
import { XRFrame, XRReferenceSpace } from "three";
import * as THREE from "three";
import { Service } from "typedi";
import { Reticle } from "../models/Reticle.model";
import { IdModelMeta } from "@/composables/idSystem/interfaces/IdModelMeta.interface.";
import { SimpleEventDispatcher } from "ste-simple-events";

export enum SceneMode {
  SELECT,
  VIEW,
}

@Service()
export class SceneModeController implements SessionLifecycle {
  private readonly raycaster = new THREE.Raycaster();
  private _mode: SceneMode = SceneMode.VIEW;
  private reticle = new Reticle();

  private panRotateY = 0;
  private objectSelected: THREE.Object3D | null = null;
  private get selectedIdModelMeta(): IdModelMeta | null {
    return this.objectSelected?.userData?.meta || null;
  }

  private _onSceneModeChange = new SimpleEventDispatcher<SceneMode>();
  public get onSceneModeChange() {
    return this._onSceneModeChange.asEvent();
  }

  private isGesture = false;
  private isInitialized = false;
  private gestureLastEuler = new THREE.Euler();
  private gestureStartTime = 0;
  readonly tapMaxTime = 100;

  constructor(
    public overlayService: OverlayXRService,
    public sesionService: SessionXRService,
    public sceneService: SceneXRService
  ) {}

  public get mode() {
    return this._mode;
  }

  public setSelectMode(object: THREE.Group, addToScene = true) {
    this._mode = SceneMode.SELECT;
    this.objectSelected = object;
    if (addToScene) this.sceneService.scene.add(object);

    this._onSceneModeChange.dispatch(this._mode);
  }

  public setViewMode(removeFromScene = true) {
    this._mode = SceneMode.VIEW;
    if (removeFromScene && this.objectSelected)
      this.sceneService.scene.remove(this.objectSelected);
    this.objectSelected = null;

    this._onSceneModeChange.dispatch(this._mode);
  }

  public init(scene: THREE.Scene): void {
    const controller = this.sceneService.controller;

    controller.addEventListener("selectstart", () => {
      this.gestureStartTime = performance.now();
      this.isGesture = true;
    });

    controller.addEventListener("selectend", async () => {
      const gestureTime = performance.now() - this.gestureStartTime;
      this.isGesture = false;
      this.isInitialized = false;

      switch (this._mode) {
        case SceneMode.VIEW: {
          const object = await this.getSelectedObject();
          if (object) this.setSelectMode(object);
          break;
        }
        case SceneMode.SELECT:
          if (gestureTime < this.tapMaxTime && this.objectSelected?.visible)
            this.setViewMode(false);
      }
    });

    this.reticle.init(scene);
  }

  private async getSelectedObject(): Promise<THREE.Group | null> {
    const scene = this.sceneService.scene;
    const controller = this.sceneService.controller;
    const c = controller.matrixWorld;
    const position = new THREE.Vector3().applyMatrix4(
      new THREE.Matrix4().copyPosition(c)
    );
    const direction = new THREE.Vector3(0, 0, -1).applyMatrix4(
      new THREE.Matrix4().extractRotation(c)
    );
    this.raycaster.set(position, direction);
    const intersects = scene.children
      .filter((m) => !!m.userData.meta)
      .map((m) => ({
        model: m as THREE.Group,
        minDistance: Math.max(
          ...this.raycaster.intersectObject(m).map((i) => i.distance)
        ),
      }))
      .filter((m) => isFinite(m.minDistance))
      .sort((a, b) => a.minDistance - b.minDistance);

    return intersects.length ? intersects[0].model : null;
  }

  public update(
    frame: XRFrame,
    referenceSpace: XRReferenceSpace,
    hitTestService: HitTestXRService
  ): void {
    const gestureTime = performance.now() - this.gestureStartTime;

    switch (this._mode) {
      case SceneMode.VIEW:
        this.reticle.show();
        this.reticle.update(frame, referenceSpace, hitTestService);
        break;

      case SceneMode.SELECT:
        {
          if (!this.objectSelected) return;
          this.reticle.hide();

          const controller = this.sceneService.controller;
          if (this.isGesture && gestureTime >= this.tapMaxTime) {
            if (this.isInitialized) {
              this.panRotateY +=
                (this.gestureLastEuler.y - controller.rotation.y) * 10;
            }
            this.gestureLastEuler.copy(controller.rotation);
            this.isInitialized = true;
          }

          const matrix = hitTestService.getHitTransformMatrix(
            frame,
            referenceSpace
          );
          if (matrix) {
            this.objectSelected.visible = true;
            this.objectSelected.matrix.copy(matrix);
            this.objectSelected.matrix.multiply(
              new THREE.Matrix4().makeRotationY(this.panRotateY)
            );
          } else {
            this.objectSelected.visible = false;
            // TODO: better toasts
            this.overlayService.showToast(
              "Move around to let us detect your surroundings"
            );
          }
        }
        break;
    }
  }

  public destroy(scene: THREE.Scene): void {
    this.reticle.destroy(scene);
    this.setViewMode();
  }
}
