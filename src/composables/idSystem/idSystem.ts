import { ModelMetaData } from "./interfaces/ModelMetaData.interface";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class IdSystem {
  private _metaData: ModelMetaData;
  private _model: THREE.Group | null = null;

  constructor(modelMetaData: ModelMetaData) {
    this._metaData = modelMetaData;
  }

  public getModel(): THREE.Group | null {
    return this._model;
  }

  public getModelMetaData(): ModelMetaData {
    return this._metaData;
  }

  public async load(): Promise<void> {
    const loader = new GLTFLoader();
    const modelGltf = await loader.loadAsync(this._metaData.webGlModelPath);
    this._model = modelGltf.scene;
  }

  public purge(): void {
    //TODO: Here utilize scene.traverse(this goes through each object and returns it)
    // check for all of neccessary stuff from https://threejsfundamentals.org/threejs/lessons/threejs-cleanup.html and dispose them
    // https://dustinpfister.github.io/2021/06/03/threejs-object3d-traverse/index.html
  }
}
