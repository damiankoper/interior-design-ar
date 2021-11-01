import * as THREE from "three";
import { XRSession } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Navigator, XRSystem } from "webxr";

export class IdarXR {
  readonly optionalFeatures: string[] = ["dom-overlay", "local-floor"];
  readonly xr: XRSystem = (window.navigator as unknown as Navigator).xr;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private overlay!: HTMLDivElement;
  private session?: XRSession;

  async init(): Promise<void> {
    await this.initOverlay();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.xr.enabled = true;
    this.renderer.xr.setReferenceSpaceType("local");
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const light = new THREE.AmbientLight("white");
    this.scene.add(light);
  }

  private initiated(): boolean {
    return this.renderer && !!this.scene && !!this.camera && !!this.overlay;
  }

  async start(): Promise<void> {
    if (!this.initiated()) throw new Error("Invalid IdarXR state!");

    this.overlay.style.display = "flex";
    this.session = (await this.xr.requestSession("immersive-ar", {
      optionalFeatures: this.optionalFeatures,
      domOverlay: { root: this.overlay },
    })) as unknown as THREE.XRSession;
    await this.renderer.xr.setSession(this.session);

    this.session.addEventListener("end", async () => {
      this.overlay.style.display = "none";
      this.renderer.setAnimationLoop(null);
    });

    this.renderer.setAnimationLoop((time: number) => {
      this.renderer.render(this.scene, this.camera);
    });

    // ############################################ TEST START
    // TODO: implement loading in IdObject entity
    // Instantiate a loader
    const loader = new GLTFLoader();

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    // Load a glTF resource
    loader.load(
      // resource URL
      "models/SheenChair.glb",
      // called when the resource is loaded
      (gltf) => {
        console.log(gltf.scene);

        this.scene.add(gltf.scene);
        gltf.scene.position.set(0, 0, 0);
      },
      // called while loading is progressing
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log("An error happened");
      }
    );
    // ############################################ TEST END
  }

  async stop() {
    await this.session?.end();
  }

  private async initOverlay(): Promise<void> {
    const overlay = document.querySelector("#overlay") as HTMLDivElement;
    if (!overlay) {
      this.overlay = document.createElement("div");
      document.body.appendChild(this.overlay);
    } else {
      this.overlay = overlay;
    }
  }
}
