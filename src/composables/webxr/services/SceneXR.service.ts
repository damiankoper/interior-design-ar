import { Service } from "typedi";
import * as THREE from "three";
import { OverlayXRService } from "./OverlayXR.service";
import { SessionLifecycle } from "../interfaces/SessionLifecycle.interface";
import { HitTestXRService } from "./HitTestXR.service";
import { ServiceLifecycle } from "../interfaces/ServiceLifecycle.interface";

@Service()
export class SceneXRService implements ServiceLifecycle {
  private _renderer!: THREE.WebGLRenderer;
  private _scene!: THREE.Scene;
  private _camera!: THREE.PerspectiveCamera;
  private _controller!: THREE.Group;
  private lifecycleObjects: SessionLifecycle[] = [];

  public get camera() {
    if (!this._camera) throw new Error("Camera not initiated!");
    return this._camera;
  }

  public get controller() {
    if (!this._controller) throw new Error("Controller not initiated!");
    return this._controller;
  }

  public get scene() {
    if (!this._scene) throw new Error("Scene not initiated!");
    return this._scene;
  }

  public get renderer() {
    if (!this._renderer) throw new Error("Renderer not initiated!");
    return this._renderer;
  }

  constructor(
    public overlayService: OverlayXRService,
    public hitTestService: HitTestXRService
  ) {}

  public addLifecycleObject(object: SessionLifecycle) {
    this.lifecycleObjects.push(object);
  }

  public async init(): Promise<void> {
    this._renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: "high-performance",
    });
    this._renderer.xr.enabled = true;
    this._renderer.xr.setReferenceSpaceType("local");
    this._scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const light = new THREE.AmbientLight("white");
    this._scene.add(light);

    this._controller = this._renderer.xr.getController(0);
    this.scene.add(this._controller);

    this.lifecycleObjects.forEach((o) => o.init(this.scene));
  }

  public update(
    frame: THREE.XRFrame,
    referenceSpace: THREE.XRReferenceSpace
  ): void {
    this.lifecycleObjects.forEach((o) =>
      o.update(frame, referenceSpace, this.hitTestService)
    );
  }

  public async destroy(): Promise<void> {
    this.lifecycleObjects.forEach((o) => o.destroy(this.scene));
    this.scene.clear();
  }
}
