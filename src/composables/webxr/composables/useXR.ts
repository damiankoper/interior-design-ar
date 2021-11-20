import { ref, Ref } from "vue";
import { Navigator } from "webxr";
import { IdarXR } from "@/composables/webxr/IdarXR";
import Container from "typedi";

export function useXR(toastMessage: Ref<string>) {
  const idar = Container.get(IdarXR);
  const isXrSupported = ref(false);

  return {
    isXrSupported,
    async getXRSupport() {
      const xr = (navigator as unknown as Navigator).xr;
      isXrSupported.value = await xr?.isSessionSupported("immersive-ar");
    },
    // TODO: pass initial scene as startAR param
    async startAR() {
      await idar.init(toastMessage);
      await idar.start();
    },
    async stopAR() {
      await idar.destroy();
    },
  };
}
