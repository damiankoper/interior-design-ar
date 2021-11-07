import { WebGLRenderer, XRFrame, XRSession } from "three";
import { Service } from "typedi";
import { Navigator, XRSystem } from "webxr";
import { ServiceLifecycle } from "../interfaces/ServiceLifecycle.interface";
import { HitTestXRService } from "./HitTestXR.service";
import { OverlayXRService } from "./OverlayXR.service";
import { SceneXRService } from "./SceneXR.service";

@Service()
export class SessionXRService implements ServiceLifecycle {
  readonly xr: XRSystem = (window.navigator as unknown as Navigator).xr;
  readonly optionalFeatures: string[] = [
    "dom-overlay",
    "local",
    "anchors",
    "hit-test",
  ];

  private _session?: XRSession;
  public get session() {
    if (!this._session) throw new Error("XR Session not initiated!");
    return this._session;
  }

  constructor(
    public overlayService: OverlayXRService,
    public hitTestService: HitTestXRService,
    public sceneService: SceneXRService
  ) {}

  public async init(
    renderer: WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera
  ): Promise<void> {
    this.overlayService.show();

    this._session = (await this.xr.requestSession("immersive-ar", {
      optionalFeatures: this.optionalFeatures,
      domOverlay: { root: this.overlayService.root },
    })) as unknown as THREE.XRSession;
    await renderer.xr.setSession(this._session);

    renderer.setAnimationLoop((time, frame) =>
      this.renderLoop(time, frame, renderer, scene, camera)
    );

    this._session.addEventListener("end", async () => {
      this.overlayService.destroy();
      this.hitTestService.destroy();
      this.sceneService.destroy();
      renderer.setAnimationLoop(null);
    });
  }

  private renderLoop(
    time: number,
    frame: XRFrame | undefined = undefined,
    renderer: WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera
  ): void {
    if (frame) {
      const referenceSpace = renderer.xr.getReferenceSpace();
      this.hitTestService.requestSource(this.session);
      if (referenceSpace) {
        this.sceneService.update(frame, referenceSpace);
      }
    }

    renderer.render(scene, camera);
  }

  public async destroy(): Promise<void> {
    try {
      await this.session?.end();
    } catch (e) {
      /* ignore session not started exception */
    }
  }
}
