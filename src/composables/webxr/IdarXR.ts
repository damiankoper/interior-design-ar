import { Service } from "typedi";
import { OverlayXRService } from "./services/OverlayXR.service";
import { SceneXRService } from "./services/SceneXR.service";
import { SessionXRService } from "./services/SessionXR.service";
import { SceneModeController } from "./domains/selectMode/controllers/SceneMode.controller";
import { ServiceLifecycle } from "./interfaces/ServiceLifecycle.interface";
import * as THREE from "three";
import { Toast } from "./interfaces/Toast.interface";

@Service()
export class IdarXR implements ServiceLifecycle {
  constructor(
    public overlayService: OverlayXRService,
    public sceneService: SceneXRService,
    public sessionService: SessionXRService,
    public sceneModeController: SceneModeController
  ) {}

  public async init(toast: Toast): Promise<void> {
    this.overlayService.init(toast);

    this.sceneService.addLifecycleObject(this.sceneModeController);
    this.sceneService.init();
  }

  public async start(initialSelectGroup?: THREE.Group): Promise<void> {
    await this.sessionService.init(
      this.sceneService.renderer,
      this.sceneService.scene,
      this.sceneService.camera
    );

    if (initialSelectGroup) {
      this.sceneModeController.setSelectMode(initialSelectGroup);
      this.overlayService.showToast(
        // TODO: swipe
        "Tap screen to place model. Swipe right/left to rotate it"
      );
    } else {
      this.sceneModeController.setViewMode();
      this.overlayService.showToast(
        "Open menu and select desired furniture to set it in the real world"
      );
    }
  }

  public async destroy() {
    await this.sessionService.destroy();
  }
}
