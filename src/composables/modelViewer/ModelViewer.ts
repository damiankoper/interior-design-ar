import { Service } from "typedi";
import * as THREE from "three";
import { ServiceLifecycle } from "../webxr/interfaces/ServiceLifecycle.interface";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { IdModel } from "../idSystem/models/IdModel";
import { LightProbeGenerator } from "three/examples/jsm/lights/LightProbeGenerator.js";

const r = "https://threejs.org/examples/textures/cube/Bridge2/";
const mapUrls = [
  r + "posx.jpg",
  r + "negx.jpg",
  r + "posy.jpg",
  r + "negy.jpg",
  r + "posz.jpg",
  r + "negz.jpg",
];

const textureCube = new Promise<THREE.CubeTexture>((resolve, reject) => {
  new THREE.CubeTextureLoader().load(mapUrls, resolve, undefined, reject);
});

@Service()
export class ModelViewer implements ServiceLifecycle {
  private container?: HTMLDivElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private model?: THREE.Group;
  private floorMesh?: THREE.Mesh;
  private requestId = 0;

  private destroyed = false;

  constructor() {
    this.scene = new THREE.Scene();
    this.renderer = this.initRenderer();
    this.camera = this.initCamera();
    this.controls = this.initControls(this.camera, this.renderer);
    this.initLights(this.scene);
    this.initFloor(this.scene);
  }

  public async init(container: HTMLDivElement, model: IdModel): Promise<void> {
    this.destroyed = false;
    this.container = container;
    this.setSize();

    this.model = await model.getModel("real");

    this.adjustScene(this.model, model.meta.vertical);
    this.scene.add(this.model);

    container.appendChild(this.renderer.domElement);
    window.addEventListener("resize", this.setSize.bind(this), false);
    this.scene.environment = await textureCube;
  }

  public async destroy(): Promise<void> {
    this.destroyed = true;
    cancelAnimationFrame(this.requestId);
    if (this.model) this.scene.remove(this.model);
  }

  public adjustScene(model: THREE.Group, vertical: boolean) {
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const sphere = new THREE.Sphere();
    box.getSize(size);
    box.getBoundingSphere(sphere);
    const r = sphere.radius;
    const targetTranslation = new THREE.Matrix4()
      .makeRotationX(Math.PI / 2)
      .multiply(new THREE.Matrix4().makeTranslation(0, 0, -r));

    const offsetY = size.y / 2;
    this.controls.target.set(0, offsetY, 0);
    this.controls.minDistance = r;
    this.camera.position.set(r, r, r).setLength(r * 3);
    this.floorMesh?.scale.copy(new THREE.Vector3(r * 2, r * 2, r * 2));

    if (vertical) {
      model.matrix.multiply(targetTranslation);
      this.controls.target.applyMatrix4(targetTranslation);
    }
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
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 0;
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
    renderer.shadowMap.enabled = true;
    renderer.physicallyCorrectLights = true;
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

  private async initLights(scene: THREE.Scene) {
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
    dirLight1.castShadow = true;
    dirLight1.position.set(3, 3, 3);
    dirLight1.target.position.set(0, 0, 0);
    dirLight1.shadow.mapSize.set(2048 * 2, 2048 * 2);
    scene.add(dirLight1);

    const lightProbe = new THREE.LightProbe();
    lightProbe.copy(LightProbeGenerator.fromCubeTexture(await textureCube));
    lightProbe.intensity = 1;
    scene.add(lightProbe);
  }

  private initFloor(scene: THREE.Scene) {
    const floorGeometry = new THREE.CylinderBufferGeometry(0.5, 0.5, 0.05, 128);
    floorGeometry.translate(0, -0.025, 0);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: "#0d84ff",
      roughness: 0.5,
      metalness: 0,
    });
    this.floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    this.floorMesh.receiveShadow = true;
    scene.add(this.floorMesh);
  }

  public animate() {
    if (!this.destroyed)
      this.requestId = requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
