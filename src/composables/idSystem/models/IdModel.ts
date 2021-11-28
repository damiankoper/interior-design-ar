import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ISimpleEvent, SimpleEventDispatcher } from "strongly-typed-events";
import axios from "axios";
import * as THREE from "three";
import { IdModelMeta } from "../interfaces/IdModelMeta.interface.";
import { reactive } from "vue";
const loader = new GLTFLoader();
export class IdModel {
  private model: THREE.Group | null = null;

  public meta: IdModelMeta;

  private _onLoadProgress = new SimpleEventDispatcher<ProgressEvent>();
  get onLoadProgress(): ISimpleEvent<ProgressEvent> {
    return this._onLoadProgress.asEvent();
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

  public isLoaded(): boolean {
    return !!this.model;
  }

  public async getModel(): Promise<THREE.Group> {
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
    return this.model.clone();
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
