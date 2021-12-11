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
import { EventDispatcher } from "ste-events";
import { LightXRService } from "@/composables/webxr/services/LightXR.service";
import { SessionService } from "@/composables/idSystem/services/Session.service";

export enum SceneMode {
  SELECT,
  VIEW,
}

const invalidHittest = "Move around to detect your surroundings";

@Service()
export class SceneModeController implements SessionLifecycle {
  private readonly raycaster = new THREE.Raycaster();
  private reticle = new Reticle();
  private _mode: SceneMode = SceneMode.VIEW;

  readonly tapMaxTime = 150;
  private isGesture = false;
  private isInitialized = false;
  private gestureLastDirection = new THREE.Vector3();
  private gestureStartTime = 0;
  private tipShown = false;

  private selectStartHandler?: () => Promise<void>;
  private selectEndHandler?: () => Promise<void>;

  private objectSelected: THREE.Object3D | null = null;
  public get selectedIdModelMeta(): IdModelMeta | null {
    return this.objectSelected?.userData?.meta || null;
  }

  private _onSceneModeChange = new EventDispatcher<
    SceneMode,
    SceneModeController
  >();
  public get onSceneModeChange() {
    return this._onSceneModeChange.asEvent();
  }

  constructor(
    public overlayService: OverlayXRService,
    public sesionService: SessionXRService,
    public sceneService: SceneXRService,
    public hitTestService: HitTestXRService,
    public lightService: LightXRService,
    public sessionService: SessionService
  ) {}

  public get mode() {
    return this._mode;
  }

  public setSelectMode(object: THREE.Group, addToScene = true) {
    this._mode = SceneMode.SELECT;
    this.objectSelected = object;
    this.hitTestService.removeAnchor(this.objectSelected);
    if (addToScene) {
      this.sceneService.scene.add(object);
    }
    this._onSceneModeChange.dispatch(this._mode, this);
  }

  public setViewMode(removeFromScene = true) {
    if (this.objectSelected) {
      if (this.objectSelected.userData.isSavedGroup) {
        this.sceneService.scene.remove(this.objectSelected);
        if (!removeFromScene) {
          for (const loadedModel of [...this.objectSelected.children]) {
            //TODO: When placing group from saved session, marker is not visible and objects are placed on each other (also they are a little bit further and way smaller)
            loadedModel.matrix.multiply(this.objectSelected.matrix);
            this.hitTestService.anchorObject(loadedModel);
            this.sceneService.scene.add(loadedModel);
          }
        }
      } else {
        if (removeFromScene) {
          this.hitTestService.removeAnchor(this.objectSelected);
          this.sceneService.scene.remove(this.objectSelected);
        } else {
          this.hitTestService.anchorObject(this.objectSelected);
        }
      }
      this.sessionService.saveScene(this.sceneService.scene);
    }

    this.objectSelected = null;
    this._mode = SceneMode.VIEW;
    this._onSceneModeChange.dispatch(this._mode, this);
  }

  public init(scene: THREE.Scene): void {
    const controller = this.sceneService.controller;

    this.selectStartHandler = async () => {
      this.gestureStartTime = performance.now();
      this.isGesture = true;
    };
    controller.addEventListener("selectstart", this.selectStartHandler);

    this.selectEndHandler = async () => {
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
    };
    controller.addEventListener("selectend", this.selectEndHandler);

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
          ...this.raycaster.intersectObject(m, true).map((i) => i.distance)
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
    hitTestService.updateAnchors(frame, referenceSpace, this.objectSelected);
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
          this.updateRotation(this.objectSelected, gestureTime);

          const matrix = hitTestService.getHitTransformMatrix(
            frame,
            referenceSpace
          );
          if (matrix) {
            this.updateSelectedObject(this.objectSelected, matrix);
          } else {
            this.objectSelected.visible = false;
            this.overlayService.showToast(invalidHittest, 1000);
          }
        }
        break;
    }
  }

  private updateRotation(objectSelected: THREE.Object3D, gestureTime: number) {
    const controller = this.sceneService.controller;
    if (this.isGesture && gestureTime >= this.tapMaxTime) {
      const c = controller.matrixWorld;
      const direction = new THREE.Vector3(0, 0, -1)
        .applyMatrix4(new THREE.Matrix4().extractRotation(c))
        .setY(0)
        .normalize();

      if (this.isInitialized) {
        const angle = Math.acos(direction.dot(this.gestureLastDirection));
        const cross = new THREE.Vector3().crossVectors(
          direction,
          this.gestureLastDirection
        );
        const angleSigned =
          angle * Math.sign(new THREE.Vector3(0, 1, 0).dot(cross));
        objectSelected.userData.panRotateY += angleSigned * 10;
      }
      this.gestureLastDirection.copy(direction);
      this.isInitialized = true;
    }
  }

  private updateSelectedObject(
    objectSelected: THREE.Object3D,
    matrix: THREE.Matrix4
  ) {
    objectSelected.visible = true;
    objectSelected.matrix.copy(matrix);
    objectSelected.matrix.multiply(
      new THREE.Matrix4().makeRotationY(objectSelected.userData.panRotateY)
    );

    if (!this.tipShown) {
      this.tipShown = true;
      this.overlayService.showToast(
        "Tap screen to place model. Pan right/left to rotate it"
      );
    }
  }

  public destroy(scene: THREE.Scene): void {
    this.reticle.destroy(scene);
    this.setViewMode();
    if (this.selectStartHandler)
      this.sceneService.controller.removeEventListener(
        "selectstart",
        this.selectStartHandler
      );
    if (this.selectEndHandler)
      this.sceneService.controller.removeEventListener(
        "selectend",
        this.selectEndHandler
      );
  }
}
