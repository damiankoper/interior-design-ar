import { ServiceLifecycle } from "@/composables/webxr/interfaces/ServiceLifecycle.interface";
import { SimpleEventDispatcher } from "ste-simple-events";
import { Service } from "typedi";
import { IdModel } from "../models/IdModel";
import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();

@Service()
export class IdModelsService implements ServiceLifecycle {
  private idModels: Map<string, IdModel> = new Map();
  private progress: Map<EventTarget, ProgressEvent> = new Map();
  private events: (() => void)[] = [];

  private _onLoadProgress = new SimpleEventDispatcher<number>();
  public get onLoadProgress() {
    return this._onLoadProgress.asEvent();
  }

  public async init(ids: string[]): Promise<void> {
    const shadowTexture = textureLoader.load("/roundshadow.png");
    const shadowMaterial = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    });
    const shadowGeometry = new THREE.PlaneBufferGeometry(1, 1);
    shadowGeometry.rotateX(-Math.PI / 2);

    ids.forEach((id) => {
      const model = new IdModel(id, {
        material: shadowMaterial,
        geometry: shadowGeometry,
      });
      this.idModels.set(id, model);
      this.events.push(
        model.onLoadProgress.sub(this.dispatchProgress.bind(this))
      );
    });
  }

  public async destroy(): Promise<void> {
    this.events.forEach((e) => e());
    for (const model of this.idModels.values()) {
      await model.destroy();
    }
  }

  public getIdModel(id: string): IdModel {
    const model = this.idModels.get(id);
    if (!model) throw new Error(`Model ${id} not found`);
    return model;
  }

  public getIdModels(): IdModel[] {
    return [...this.idModels.values()];
  }

  private dispatchProgress(progress: ProgressEvent) {
    if (progress.target) {
      this.progress.set(progress.target, progress);
      let loaded = 0;
      let total = 0;
      for (const progress of this.progress.values()) {
        loaded += progress.loaded;
        total += progress.total;
      }
      this._onLoadProgress.dispatch(loaded / total);
    }

    if (progress.loaded === progress.total)
      this.progress.delete(progress.target as XMLHttpRequest);
  }
}
