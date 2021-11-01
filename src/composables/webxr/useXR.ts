import { ref, Ref } from "vue";
import { Navigator } from "webxr";
import { IdarXR } from "@/composables/webxr/IdarXR";

export function useXR() {
  const idar = new IdarXR();
  const isXrSupported = ref(false);

  return {
    isXrSupported,
    async getXRSupport() {
      const xr = (navigator as unknown as Navigator).xr;
      isXrSupported.value = await xr?.isSessionSupported("immersive-ar");
    },
    async startAR() {
      await idar.init();
      await idar.start();
    },
    async stopAR() {
      await idar.stop();
    },
  };
}
