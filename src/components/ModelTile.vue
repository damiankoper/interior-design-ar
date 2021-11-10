<template>
  <div @click="openModelDetails()">
    <el-image fit="contain" :src="imageSrc"></el-image>
    <el-button
      @click.stop="startAR"
      :class="isXrSupported ? '' : 'hidden'"
      type="primary"
      plain
    >
      <font-awesome-icon :icon="['fas', 'vr-cardboard']" />
    </el-button>
  </div>
  <RootOverlay @close="stopAR" :toastMessage="toastMessage" />
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, PropType } from "vue";
import { useRouter } from "vue-router";

import RootOverlay from "@/components/overlay/RootOverlay.vue";

import { useXR } from "@/composables/webxr/composables/useXR";
import { IdObject } from "@/composables/idSystem/interfaces/IdObject.interface";

export default defineComponent({
  components: { RootOverlay },
  props: {
    model: { type: Object as PropType<IdObject>, required: true },
  },
  setup(props) {
    const router = useRouter();
    const toastMessage = ref("");
    const { isXrSupported, getXRSupport, startAR, stopAR } =
      useXR(toastMessage);
    const modelMetaData = props.model.getModelMetaData();
    const imageSrc = modelMetaData.modelImagePath;

    const openModelDetails = () =>
      router.push({ path: `/browser/${modelMetaData.id}` });

    onMounted(async () => {
      await getXRSupport();
    });

    onUnmounted(() => {
      stopAR();
    });

    return {
      openModelDetails,
      imageSrc,
      startAR,
      stopAR,
      isXrSupported,
      toastMessage,
    };
  },
});
</script>

<style lang="scss" scoped>
div {
  cursor: pointer;
  position: relative;
  .el-image {
    width: 100%;
  }
  .el-button {
    position: absolute;
    bottom: 5%;
    right: 5%;
    padding: 6px 10.25px;
  }
  .hidden {
    display: none;
  }
}
</style>
