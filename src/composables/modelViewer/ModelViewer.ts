import { Service } from "typedi";
import * as THREE from "three";
import { ServiceLifecycle } from "../webxr/interfaces/ServiceLifecycle.interface";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { IdSystem } from "../idSystem/IdSystem";

@Service()
export class ModelViewer implements ServiceLifecycle {
  private _renderer!: THREE.WebGLRenderer;
  private _scene!: THREE.Scene;
  private _camera!: THREE.PerspectiveCamera;
  private _controls!: OrbitControls;

  public async init(container: HTMLDivElement, model: IdSystem): Promise<void> {
    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color(0xcccccc);

    this.setupRenderer();

    container.append(this._renderer.domElement);

    this.setupCamera();

    this.setupControls(container);

    this._scene.add(await model.load());

    this.setupLights();

    window.addEventListener("resize", this.onWindowResize, false);
  }

  public get renderer() {
    if (!this._renderer) throw new Error("Renderer not initiated!");
    return this._renderer;
  }

  public async destroy(): Promise<void> {
    this._scene.clear();
  }

  private onWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight; //TODO: when resizing the page, camera is undefined :(
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private setupControls(container: HTMLDivElement) {
    this._controls = new OrbitControls(this._camera, this._renderer.domElement);
    this._controls.listenToKeyEvents(container); //TODO: Check if this is valid
    this._controls.enableDamping = true;
    this._controls.dampingFactor = 0.05;
    this._controls.screenSpacePanning = false;
    this._controls.minDistance = 100;
    this._controls.maxDistance = 500;
    this._controls.maxPolarAngle = Math.PI / 2;
  }

  private setupRenderer() {
    this._renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private setupCamera() {
    this._camera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    //this._camera.position.set(10, 10, 0);
  }

  private setupLights() {
    const dirLight1 = new THREE.DirectionalLight(0xffffff);
    dirLight1.position.set(1, 1, 1);
    this._scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x002288);
    dirLight2.position.set(-1, -1, -1);
    this._scene.add(dirLight2);

    const ambientLight = new THREE.AmbientLight(0x222222);
    this._scene.add(ambientLight);
  }

  public animate() {
    requestAnimationFrame(this.animate.bind(this)); //TODO: We sure about binding this? https://stackoverflow.com/questions/46130737/three-js-uncaught-typeerror-cannot-read-property-render-of-undefined-error
    this._controls.update();
    this._renderer.render(this._scene, this._camera);
  }
}
