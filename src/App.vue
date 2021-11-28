<template>
  <router-view
    :isXrSupported="isXrSupported"
    :startAR="startAR"
    :onSessionEnd="onSessionEnd"
    :onSessionStart="onSessionStart"
  />
  <RootOverlay
    @close="stopAR"
    @delete="deleteModel"
    @select:model="selectModel"
    :toast="toast"
    :onSceneModeChange="onSceneModeChange"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  provide,
  reactive,
} from "vue";
import { IdModelsInjectKey } from "@/symbols";

import { IdModel } from "@/composables/idSystem/IdModel";
import RootOverlay from "./components/overlay/RootOverlay.vue";
import { useXR } from "./composables/webxr/composables/useXR";
import { Toast } from "./composables/webxr/interfaces/Toast.interface";

export default defineComponent({
  components: { RootOverlay: RootOverlay },
  setup() {
    const toast = reactive<Toast>({
      visible: false,
      message: "",
    });

    const {
      isXrSupported,
      getXRSupport,
      startAR,
      stopAR,
      selectModel,
      deleteModel,
      onSessionEnd,
      onSessionStart,
      onSceneModeChange,
    } = useXR(toast);

    onMounted(async () => {
      await getXRSupport();
    });

    onUnmounted(() => {
      stopAR();
    });

    const idModels: IdModel[] = ["SheenChair"].map((id) => new IdModel(id));
    provide(IdModelsInjectKey, idModels);

    return {
      stopAR,
      isXrSupported,
      startAR,
      toast,
      selectModel,
      deleteModel,
      onSessionEnd,
      onSessionStart,
      onSceneModeChange,
    };
  },
});
</script>

<style lang="scss">
html,
body {
  padding: 0;
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

  .el-main {
    --el-main-padding: 72px 12px 48px;
    @media only screen and (min-width: 1200px) {
      --el-main-padding: 72px 250px 48px;
    }
  }
}
</style>
