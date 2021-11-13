import { Service } from "typedi";
import { ServiceLifecycle } from "../interfaces/ServiceLifecycle.interface";
import { XREstimatedLight } from "three/examples/jsm/webxr/XREstimatedLight.js";
import * as THREE from "three";

@Service()
export class LightXRService implements ServiceLifecycle {
  private xrLight?: XREstimatedLight;
  private defaultLight?: THREE.AmbientLight;

  async init(renderer: THREE.WebGLRenderer, scene: THREE.Scene): Promise<void> {
    const defaultLight = new THREE.AmbientLight(0xffffff);
    this.defaultLight = defaultLight;
    scene.add(this.defaultLight);

    const xrLight = new XREstimatedLight(renderer);
    this.xrLight = xrLight;

    xrLight.addEventListener("estimationstart", () => {
      scene.add(xrLight);
      scene.remove(defaultLight);
      if (xrLight.environment) {
        this.updateEnvironment(scene, xrLight.environment);
      }
    });
    xrLight.addEventListener("estimationend", () => {
      scene.add(defaultLight);
      scene.remove(xrLight);
      this.updateEnvironment(scene, null);
    });
  }

  public updateEnvironment(scene: THREE.Scene, map: THREE.Texture | null) {
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.material.envMap = map;
      }
    });
  }

  async destroy(): Promise<void> {
    this.defaultLight?.dispose();
    this.xrLight?.lightProbe.dispose();
    this.xrLight?.directionalLight.dispose();
    this.xrLight?.environment.dispose();
  }
}
