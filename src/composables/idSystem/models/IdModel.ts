import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ISimpleEvent, SimpleEventDispatcher } from "strongly-typed-events";
import axios from "axios";
import * as THREE from "three";
import { IdModelMeta } from "../interfaces/IdModelMeta.interface.";
import { reactive } from "vue";
import { IdModelShadow } from "../interfaces/IdModelShadow.interface";

const loader = new GLTFLoader();

export class IdModel {
  private model: THREE.Group | null = null;
  private shadowMesh: THREE.Mesh | null = null;

  public meta: IdModelMeta;

  private _onLoadProgress = new SimpleEventDispatcher<ProgressEvent>();
  get onLoadProgress(): ISimpleEvent<ProgressEvent> {
    return this._onLoadProgress.asEvent();
  }

  constructor(id: string, private shadow?: IdModelShadow) {
    this.meta = reactive({
      id,
      extendedMetaPath: `/models/${id}/${id}.json`,
      thumbnailPath: `/models/${id}/${id}.png`,
      webGlModelPath: `/models/${id}/${id}.glb`,
      name: null,
      description: null,
      castsShadow: false,
      vertical: false,
    });
    this.initExtendedMeta();
  }

  public async initExtendedMeta() {
    const response = await axios.get(this.meta.extendedMetaPath);
    this.meta.name = response.data.name;
    this.meta.description = response.data.description;
    this.meta.castsShadow = response.data.castsShadow;
    this.meta.vertical = response.data.vertical;
  }

  public isLoaded(): boolean {
    return !!this.model;
  }

  public async getModel(
    shadow: "simple" | "real" = "simple"
  ): Promise<THREE.Group> {
    if (!this.model) {
      const modelGltf = await loader.loadAsync(
        this.meta.webGlModelPath,
        (progressEvent: ProgressEvent) =>
          this._onLoadProgress.dispatch(progressEvent)
      );
      this.model = modelGltf.scene;
      this.model.matrixAutoUpdate = false;
      this.model.userData.meta = this.meta;
      this.model.userData.panRotateY = 0;
    }
    const model = this.model.clone();
    if (shadow === "real")
      model.traverse((obj) => {
        obj.castShadow = true;
      });
    if (shadow === "simple" && this.meta.castsShadow && shadow)
      this.addShadow(model);

    model.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        if (obj.userData.castShadows) obj.castShadow = true;
        if (obj.userData.receiveShadow) obj.receiveShadow = true;
      }
    });

    return model;
  }

  public destroy(): void {
    if (!this.model) return;

    this.model.traverse((sceneObject) => {
      if (
        sceneObject instanceof THREE.Mesh &&
        sceneObject !== this.shadowMesh
      ) {
        sceneObject.material.dispose();
        sceneObject.geometry.dispose();
      }
    });

    this.model = null;
  }

  private addShadow(model: THREE.Group) {
    if (this.shadow) {
      this.shadowMesh = new THREE.Mesh(
        this.shadow.geometry,
        this.shadow.material
      );
      this.shadowMesh.position.y = 0.001;
      const boundingBox = new THREE.Box3().setFromObject(model);
      boundingBox.getSize(this.shadowMesh.scale);
      this.shadowMesh.scale.addScalar(0.4);
      this.shadow.material.opacity = 0.8;

      model.add(this.shadowMesh);
    }
  }
}
