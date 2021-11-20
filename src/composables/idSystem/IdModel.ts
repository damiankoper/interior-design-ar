import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ISimpleEvent, SimpleEventDispatcher } from "strongly-typed-events";
import axios from "axios";
import * as THREE from "three";
import { IdModelMeta } from "./interfaces/IdModelMeta.interface.";
import { reactive } from "vue";
const loader = new GLTFLoader();
export class IdModel {
  private model: THREE.Group | null = null;

  public meta: IdModelMeta;

  private _modelLoadProgress = new SimpleEventDispatcher<ProgressEvent>();
  get modelLoadProgress(): ISimpleEvent<ProgressEvent> {
    return this._modelLoadProgress.asEvent();
  }

  constructor(id: string) {
    this.meta = reactive({
      id,
      extendedMetaPath: `/models/${id}/${id}.json`,
      thumbnailPath: `/models/${id}/${id}.png`,
      webGlModelPath: `/models/${id}/${id}.glb`,
      name: null,
      description: null,
    });
    this.initExtendedMeta();
  }

  public async initExtendedMeta() {
    const response = await axios.get(this.meta.extendedMetaPath);
    this.meta.name = response.data.name;
    this.meta.description = response.data.description;
  }

  public async getModel(): Promise<THREE.Group> {
    if (!this.model) {
      const modelGltf = await loader.loadAsync(
        this.meta.webGlModelPath,
        (progressEvent) => this._modelLoadProgress.dispatch(progressEvent)
      );
      this.model = modelGltf.scene;
    }
    return this.model;
  }

  public destroy(): void {
    if (!this.model) return;

    this.model.traverse((sceneObject) => {
      if (sceneObject instanceof THREE.Mesh) {
        sceneObject.material.dispose();
        sceneObject.geometry.dispose();
      }
    });

    this.model = null;
  }
}
