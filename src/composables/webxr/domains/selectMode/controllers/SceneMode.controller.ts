import { IdModel } from "@/composables/idSystem/IdModel";
import { SessionLifecycle } from "@/composables/webxr/interfaces/SessionLifecycle.interface";
import { HitTestXRService } from "@/composables/webxr/services/HitTestXR.service";
import { OverlayXRService } from "@/composables/webxr/services/OverlayXR.service";
import { SceneXRService } from "@/composables/webxr/services/SceneXR.service";
import { SessionXRService } from "@/composables/webxr/services/SessionXR.service";
import { XRFrame, XRReferenceSpace } from "three";
import * as THREE from "three";
import { Service } from "typedi";
import { Reticle } from "../models/Reticle.model";

export enum SceneMode {
  SELECT,
  VIEW,
}

/**
 * TODO: this is PoC WIP
 */
@Service()
export class SceneModeController implements SessionLifecycle {
  private mode: SceneMode = SceneMode.VIEW;
  private selectIdSystem: IdModel | null = null;
  private selectObject: THREE.Object3D | null = null;
  private reticle = new Reticle();
  private helper?: THREE.ArrowHelper;
  private controller?: THREE.Group;

  constructor(
    public overlayService: OverlayXRService,
    public sesionService: SessionXRService,
    public sceneService: SceneXRService
  ) {}

  public getMode() {
    return this.mode;
  }

  public setSelectMode(idSystem: IdModel, object: THREE.Object3D) {
    this.mode = SceneMode.SELECT;
    this.selectIdSystem = idSystem;
    this.selectObject = object;
  }

  public setViewMode() {
    this.mode = SceneMode.VIEW;
    this.selectIdSystem = null;
    this.selectObject = null;
  }

  public init(scene: THREE.Scene): void {
    this.helper = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 0, 0),
      0.25,
      new THREE.Color("red")
    );
    scene.add(this.helper);
    scene.add(new THREE.AxesHelper(2));

    const controller = this.sceneService.controller;
    controller.addEventListener("select", () => {
      if (controller && this.helper) {
        /**
         * !IMPORTANT 1: Z = -1 is default look direction
         * !IMPORTANT 2 (TODO): Use this ray(origin, direction) to detect object select
         */
        const c = controller.matrixWorld;
        this.helper.position.copy(
          new THREE.Vector3().applyMatrix4(new THREE.Matrix4().copyPosition(c))
        );
        this.helper.setDirection(
          new THREE.Vector3(0, 0, -1).applyMatrix4(
            new THREE.Matrix4().extractRotation(c)
          )
        );
      }
    });

    this.reticle.init(scene);
    this.overlayService.showToast(
      "Open menu and select desired furniture to set it in the real world."
    );
  }

  public update(
    frame: XRFrame,
    referenceSpace: XRReferenceSpace,
    hitTestService: HitTestXRService
  ): void {
    // TODO: reticle or model - depends on select mode
    this.reticle.update(frame, referenceSpace, hitTestService);
  }

  public destroy(scene: THREE.Scene): void {
    this.reticle.destroy(scene);
    if (this.helper && this.controller) {
      this.sceneService.scene.remove(this.helper);
      this.sceneService.scene.remove(this.controller);
    }
    this.setViewMode();
  }
}
