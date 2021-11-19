import type { ModelMetaData } from "./interfaces/ModelMetaData.interface";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ISimpleEvent, SimpleEventDispatcher } from "strongly-typed-events";

export class IdSystem {
  private _metaData: ModelMetaData;
  private _model: THREE.Group | null = null;
  private _modelLoadProgress = new SimpleEventDispatcher<
    ProgressEvent<EventTarget>
  >(); //TODO: Fix this crap

  constructor(modelMetaData: ModelMetaData) {
    this._metaData = modelMetaData;
  }

  public getModel(): THREE.Group | null {
    return this._model;
  }

  get modelLoadProgress(): ISimpleEvent<ProgressEvent<EventTarget>> {
    return this._modelLoadProgress.asEvent();
  }

  public getModelMetaData(): ModelMetaData {
    return this._metaData;
  }

  public async load(): Promise<THREE.Group> {
    const loader = new GLTFLoader();
    const modelGltf = await loader.loadAsync(
      this._metaData.webGlModelPath,
      (progressEvent) => this._modelLoadProgress.dispatch(progressEvent)
    );
    this._model = modelGltf.scene;
    return this._model;
  }

  public purge(): void {
    //TODO: Here utilize scene.traverse(this goes through each object and returns it)
    // check for all of neccessary stuff from https://threejsfundamentals.org/threejs/lessons/threejs-cleanup.html and dispose them
    // https://dustinpfister.github.io/2021/06/03/threejs-object3d-traverse/index.html
    if (!this._model) return;

    this._model.traverse((sceneObject) => {
      console.log(sceneObject);
    });
  }
}
