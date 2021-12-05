import { Service } from "typedi";
import { ServiceLifecycle } from "../interfaces/ServiceLifecycle.interface";
import { XREstimatedLight } from "three/examples/jsm/webxr/XREstimatedLight.js";
import * as THREE from "three";

const r = "https://threejs.org/examples/textures/cube/Bridge2/";
const mapUrls = [
  r + "posx.jpg",
  r + "negx.jpg",
  r + "posy.jpg",
  r + "negy.jpg",
  r + "posz.jpg",
  r + "negz.jpg",
];

const textureCube = new THREE.CubeTextureLoader().load(mapUrls);
textureCube.format = THREE.RGBFormat;

@Service()
export class LightXRService implements ServiceLifecycle {
  private xrLight?: XREstimatedLight;
  private defaultLight?: THREE.AmbientLight;

  async init(renderer: THREE.WebGLRenderer, scene: THREE.Scene): Promise<void> {
    const defaultLight = new THREE.AmbientLight(0xffffff);
    this.defaultLight = defaultLight;
    scene.add(this.defaultLight);

    const xrLight = new XREstimatedLight(renderer, true);
    this.xrLight = xrLight;

    xrLight.addEventListener("estimationstart", () => {
      scene.add(xrLight);
      scene.remove(defaultLight);
      if (xrLight.environment) {
        /**
         * ! IMPORTANT: Three.js has to be locked at r130 because of a bug with
         * ! the PMREM and renderTargetTexture not being converted to CubeUV map
         * ! See: https://github.com/mrdoob/three.js/issues/22236
         */
        scene.environment = xrLight.environment;
      }
    });
    xrLight.addEventListener("estimationend", () => {
      scene.add(defaultLight);
      scene.remove(xrLight);
      scene.environment = null;
    });
  }

  async destroy(): Promise<void> {
    this.defaultLight?.dispose();
    this.xrLight?.lightProbe.dispose();
    this.xrLight?.directionalLight.dispose();
    this.xrLight?.environment.dispose();
  }
}
