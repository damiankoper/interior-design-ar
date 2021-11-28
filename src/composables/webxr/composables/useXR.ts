import { ref } from "vue";
import { Navigator } from "webxr";
import { IdarXR } from "@/composables/webxr/IdarXR";
import Container from "typedi";
import * as THREE from "three";
import { IdModel } from "@/composables/idSystem/IdModel";
import { Toast } from "../interfaces/Toast.interface";

export function useXR(toast: Toast) {
  const idar = Container.get(IdarXR);
  const isXrSupported = ref(false);

  return {
    isXrSupported,
    onSessionEnd: idar.sessionService.onSessionEnd,
    onSessionStart: idar.sessionService.onSessionStart,
    onSceneModeChange: idar.sceneModeController.onSceneModeChange,

    async getXRSupport() {
      const xr = (navigator as unknown as Navigator).xr;
      isXrSupported.value = await xr?.isSessionSupported("immersive-ar");
    },
    async startAR(initialSelectGroup?: THREE.Group) {
      await idar.init(toast);
      await idar.start(initialSelectGroup);
    },
    async stopAR() {
      await idar.destroy();
    },
    async selectModel(idModel: IdModel) {
      idar.sceneModeController.setSelectMode(await idModel.getModel());
    },
    async deleteModel() {
      idar.sceneModeController.setViewMode(true);
    },
  };
}
