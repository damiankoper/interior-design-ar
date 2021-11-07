import { Service } from "typedi";
import { OverlayXRService } from "./services/OverlayXR.service";
import { SceneXRService } from "./services/SceneXR.service";
import { SessionXRService } from "./services/SessionXR.service";
import { Ref } from "vue";
import { SceneModeController } from "./domains/selectMode/controllers/SceneMode.controller";
import { ServiceLifecycle } from "./interfaces/ServiceLifecycle.interface";
@Service()
export class IdarXR implements ServiceLifecycle {
  constructor(
    public overlayService: OverlayXRService,
    public sceneService: SceneXRService,
    public sesionService: SessionXRService,
    private sceneModeController: SceneModeController
  ) {}

  public async init(toastMessage: Ref<string>): Promise<void> {
    this.overlayService.init(toastMessage);

    this.sceneService.addLifecycleObject(this.sceneModeController);
    this.sceneService.init();
  }

  public async start(): Promise<void> {
    await this.sesionService.init(
      this.sceneService.renderer,
      this.sceneService.scene,
      this.sceneService.camera
    );
  }

  public async destroy() {
    await this.sesionService.destroy();
  }
}
