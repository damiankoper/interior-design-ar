import { Service } from "typedi";
import * as THREE from "three";
import { ServiceLifecycle } from "../webxr/interfaces/ServiceLifecycle.interface";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { IdModel } from "../idSystem/IdModel";

@Service()
export class ModelViewer implements ServiceLifecycle {
  private container?: HTMLDivElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private model?: THREE.Group;

  private destroyed = false;

  constructor() {
    this.scene = new THREE.Scene();
    this.renderer = this.initRenderer();
    this.camera = this.initCamera();
    this.controls = this.initControls(this.camera, this.renderer);
    this.initLights(this.scene);
    // init fake shadow and add to scene (plane with texture): radial gradient (black to transparent)
  }

  public async init(container: HTMLDivElement, model: IdModel): Promise<void> {
    this.destroyed = false;
    this.container = container;
    this.setSize();

    this.model = await model.getModel();
    this.adjustScene(this.model);
    this.scene.add(this.model);

    container.appendChild(this.renderer.domElement);
    window.addEventListener("resize", this.setSize.bind(this), false);
  }

  public async destroy(): Promise<void> {
    this.destroyed = true;
    if (this.model) this.scene.remove(this.model);
  }

  public adjustScene(model: THREE.Group) {
    const size = new THREE.Vector3();
    const box = new THREE.Box3().setFromObject(model);
    box.getSize(size);
    model.position.setY(-size.y / 2);

    //TODO: the bigger the bounding box the further camera is
    this.camera.position.set(1, 0.8, 1).multiplyScalar(0.7);
  }

  private setSize() {
    const width = this.container?.offsetWidth || 0;
    const height = this.container?.offsetHeight || 0;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private initControls(camera: THREE.Camera, renderer: THREE.Renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.center = new THREE.Vector3(1, 1, 1);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 5;
    controls.autoRotate = true;
    controls.maxPolarAngle = Math.PI / 2;
    return controls;
  }

  private initRenderer() {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    return renderer;
  }

  private initCamera() {
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    return camera;
  }

  private initLights(scene: THREE.Scene) {
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight1.position.set(1, 1, 1);
    scene.add(dirLight1);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
  }

  public animate() {
    if (!this.destroyed) requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
