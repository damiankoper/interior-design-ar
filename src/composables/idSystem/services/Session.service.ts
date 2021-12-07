import { Service } from "typedi";
import {
  SessionObject,
  SessionPersistance,
} from "../interfaces/SessionPersistance.interfaces";
import * as THREE from "three";
import { IdModelsService } from "./IdModels.service";
import { IdModelMeta } from "../interfaces/IdModelMeta.interface.";

@Service()
export class SessionService implements SessionPersistance {
  constructor(private modelsService: IdModelsService) {}

  private readonly storageKey: string = "sceneModels";

  saveScene(scene: THREE.Scene): void {
    const loadedModels = scene.children.filter((c) => c.userData.meta);

    const gravityCenter = loadedModels.reduce((prev, next) => {
      const position = new THREE.Vector3();
      position.setFromMatrixPosition(next.matrix);
      prev.add(position);
      return prev;
    }, new THREE.Vector3());

    gravityCenter.setY(0);
    gravityCenter.divideScalar(loadedModels.length);

    const loadedObjects: SessionObject[] = loadedModels.map((model) => {
      const position = new THREE.Vector3();
      position.setFromMatrixPosition(model.matrix);
      position.sub(gravityCenter);
      const realtiveMatrix = model.matrix.clone().setPosition(position);
      return {
        modelId: model.userData.meta.id,
        matrix: realtiveMatrix.toArray(),
      };
    });

    localStorage.setItem(this.storageKey, JSON.stringify(loadedObjects));
  }

  async getScene(): Promise<THREE.Group | null> {
    const objectsJSON = localStorage.getItem(this.storageKey);
    if (!objectsJSON) {
      return null;
    }
    const objectsToLoad: SessionObject[] = JSON.parse(objectsJSON);
    const scene = new THREE.Group();
    scene.userData.meta = { name: "Saved session" } as Partial<IdModelMeta>;
    scene.userData.panRotateY = 0;
    scene.userData.isSavedGroup = true;
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
    const objectsJSON = localStorage.getItem(this.storageKey);
    if (!objectsJSON) {
      return false;
    }
    const objectsToLoad: SessionObject[] = JSON.parse(objectsJSON);
    return !!objectsToLoad.length;
  }
}
