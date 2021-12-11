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
    :models="models"
    :toast="toast"
    :onSceneModeChange="onSceneModeChange"
    :progress="progress"
    :progressVisible="progressVisible"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, reactive } from "vue";

import { IdModelsService } from "@/composables/idSystem/services/IdModels.service";
import RootOverlay from "./components/overlay/RootOverlay.vue";
import { useXR } from "./composables/webxr/composables/useXR";
import { Toast } from "./composables/webxr/interfaces/Toast.interface";
import Container from "typedi";
import { useModelsProgress } from "./composables/idSystem/composables/useModelsProgress";

export default defineComponent({
  components: { RootOverlay: RootOverlay },
  setup() {
    const { progress, progressVisible } = useModelsProgress(true);

    const idModelsService = Container.get(IdModelsService);
    idModelsService.init([
      // "SheenChair",
      "BigSofa",
      "SmallSofa",
      "Chair",
      "CoffeeTable",
      "Commode",
      "Wardrobe",
      "Rug",
      "Painting",
      "Lamp",
      "LampDown",
      "Mirror",
      "HangingMirror"
    ]);

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

    return {
      models: idModelsService.getIdModels(),
      stopAR,
      isXrSupported,
      startAR,
      toast,
      selectModel,
      deleteModel,
      onSessionEnd,
      onSessionStart,
      onSceneModeChange,
      progress,
      progressVisible,
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
