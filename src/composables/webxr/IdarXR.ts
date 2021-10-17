import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
import * as THREE from "three";

/**
 * Tylko taka kupa, żeby sprawdzić czy działa
 */
export class IdarXR {
  init(): void {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const material = new THREE.MeshPhongMaterial({
      color: "gray",
      side: THREE.DoubleSide,
    });

    const renderer = new THREE.WebGLRenderer();
    document.body.appendChild(ARButton.createButton(renderer));
    renderer.xr.enabled = true;

    const object = new THREE.Mesh(
      new THREE.TorusKnotGeometry(100, 10, 50, 20),
      material
    );
    object.position.set(0, 0, 0);
    scene.add(object);

    const light = new THREE.PointLight("white");
    light.position.set(0, 0, 0);
    scene.add(light);

    renderer.setAnimationLoop(function () {
      renderer.render(scene, camera);
    });
  }
}
