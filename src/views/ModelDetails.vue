<template>
  <el-container>
    <el-main>
      <el-image fit="contain" :src="modelMetaData.modelImagePath" />
      <el-row align="middle">
        <el-col :span="18">
          <h1>{{ modelMetaData.name }}</h1>
        </el-col>
        <el-col :span="6">
          <el-button
            @click="startAR"
            :class="isXrSupported ? '' : 'hidden'"
            type="primary"
            plain
          >
            <font-awesome-icon :icon="['fas', 'vr-cardboard']" />
          </el-button>
        </el-col>
        <el-col>
          <p class="desc">
            {{ modelMetaData.description }}
          </p>
        </el-col>
      </el-row>
    </el-main>
    <Footer />
  </el-container>
  <RootOverlay @close="stopAR" :toastMessage="toastMessage" />
</template>

<script lang="ts">
import { defineComponent, inject, ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { ModelsRefInjectKey } from "@/symbols";

import Footer from "@/components/Footer.vue";
import RootOverlay from "@/components/overlay/RootOverlay.vue";

import { useXR } from "@/composables/webxr/composables/useXR";

export default defineComponent({
  name: "Model Details",
  components: { Footer, RootOverlay },
  setup() {
    const route = useRoute();
    const models = inject(ModelsRefInjectKey)?.value;
    const model = models?.find(
      (m) => m.getModelMetaData().id === route.params.modelId
    );
    const modelMetaData = model?.getModelMetaData();

    const toastMessage = ref("");
    const { isXrSupported, getXRSupport, startAR, stopAR } =
      useXR(toastMessage);

    onMounted(async () => {
      await getXRSupport();
    });

    onUnmounted(() => {
      stopAR();
    });

    return {
      modelMetaData,
      startAR,
      stopAR,
      isXrSupported,
      toastMessage,
    };
  },
});
</script>

<style lang="scss" scoped>
.el-container {
  background-color: rgb(245, 245, 245);
  height: calc(100vh - 32px);
}

.el-main {
  --el-main-padding: 0;

  .el-row {
    padding: 0 10px 0;
  }

  .el-button {
    padding: 6px 11px;
    font-size: 1.5rem;
    line-height: 2.5rem;
  }

  h1 {
    font-size: 2rem;
    margin: 20px 0 20px;
  }

  p.desc {
    text-align: justify;
  }
  .hidden {
    display: none;
  }
}
</style>
