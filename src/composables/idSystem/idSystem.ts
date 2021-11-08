import { IdObject, ModelMetaData } from "./interfaces/IdObject.interface";

export class IdSystem implements IdObject {
  private _modelMetaData: ModelMetaData;
  private _model: THREE.Group | null = null;

  constructor(modelMetaData: ModelMetaData) {
    this._modelMetaData = modelMetaData;
  }

  public getModel(): THREE.Group | null {
    return this._model;
  }

  public getModelMetaData(): ModelMetaData {
    return this._modelMetaData;
  }

  public load(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public purge(): void {
    throw new Error("Method not implemented.");
  }
}
