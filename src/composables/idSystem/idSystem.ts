import { ModelMetaData } from "./interfaces/ModelMetaData.interface";

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

  public load(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public purge(): void {
    throw new Error("Method not implemented.");
  }
}
