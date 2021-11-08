<template>
  <div>
    <el-image fit="contain" :src="imageSrc"></el-image>
    <el-button
      @click="startAR"
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
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import { useXR } from "@/composables/webxr/composables/useXR";
import RootOverlay from "@/components/overlay/RootOverlay.vue";

export default defineComponent({
  components: { RootOverlay },
  setup() {
    const imageSrc = ref("models/SheenChair/SheenChair.png");
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
