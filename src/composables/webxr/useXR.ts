import { ref } from "vue";
import type { Ref } from "vue";
import type { Navigator } from "webxr";
import { IdarXR } from "@/composables/webxr/IdarXR";

export function useXR(): {
  isXrSupported: Ref<boolean>;
  getXRSupport(): Promise<void>;
  startAR(): void;
} {
  const isXrSupported = ref(false);

  return {
    isXrSupported,
    async getXRSupport() {
      const xr = (navigator as unknown as Navigator).xr;
      isXrSupported.value = await xr?.isSessionSupported("immersive-ar");
    },
    startAR() {
      new IdarXR().init();
    },
  };
}
