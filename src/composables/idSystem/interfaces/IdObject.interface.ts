import { ModelMetaData } from "./modelMetaData.interface";

export interface IdObject {
  load(): Promise<void>;
  purge(): void;
  getModel(): THREE.Group | null;
  getModelMetaData(): ModelMetaData;
}
