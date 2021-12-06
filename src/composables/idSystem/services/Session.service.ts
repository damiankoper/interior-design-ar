import { Service } from "typedi";
import {
  SessionObject,
  SessionPersistance,
} from "../interfaces/SessionPersistance.interfaces";
import * as THREE from "three";
import { IdModelsService } from "./IdModels.service";

@Service()
export class SessionService implements SessionPersistance {
  constructor(private modelsService: IdModelsService) {}

  private readonly storageKey: string = "sceneModels";

  saveScene(scene: THREE.Scene): void {
    //TODO: 1. Dla naszych modeli ustawiamy matrix względem środka cięzkości całej sceny, modyfikujemy tylko X i Y i ustawiamy je tak jakby 0.0 byłoby w środku pomiędyz wszystkimi modelami.

    const loadedObjects: SessionObject[] = [];
    scene.children.forEach((object) => {
      const objectId = object.userData.meta?.id;
      if (objectId) {
        loadedObjects.push({
          modelId: objectId,
          matrix: object.matrix.toArray(),
        });
      }
    });
    if (loadedObjects.length)
      localStorage.setItem(this.storageKey, JSON.stringify(loadedObjects));
  }

  async getScene(): Promise<THREE.Group | null> {
    const objectsJSON = localStorage.getItem(this.storageKey);
    if (!objectsJSON) {
      return null;
    }
    const objectsToLoad: SessionObject[] = JSON.parse(objectsJSON);
    const scene = new THREE.Group();
    //TODO: Dodać metadane do scene tak jak dodawane do modelu w getModel (jako name Saved session, reszta empty (Partial interface))
    scene.matrixAutoUpdate = false;

    const models = await Promise.all(
      objectsToLoad.map((object) =>
        (async () => {
          const model = this.modelsService.getIdModel(object.modelId);
          const modelGroup = await model.getModel();
          modelGroup.matrix = new THREE.Matrix4().fromArray(object.matrix);
          return modelGroup;
        })()
      )
    );
    scene.add(...models);
    return scene;
  }

  get isSceneSaved(): boolean {
    return !!localStorage.getItem(this.storageKey);
  }
}
