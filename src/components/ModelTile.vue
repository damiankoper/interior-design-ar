<template>
  <div>
    <el-image fit="contain" :src="imageSrc"></el-image>
    <el-button :class="isXrSupported ? '' : 'hidden'" type="primary" plain>
      <font-awesome-icon :icon="['fas', 'vr-cardboard']" />
    </el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
// import { useXR } from "@/composables/webxr/composables/useXR";

export default defineComponent({
  setup() {
    const imageSrc = ref("models/SheenChair/SheenChair.png");
    // const { isXrSupported } = useXR();

    return {
      imageSrc,
      isXrSupported: true, // TODO remove assignment
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
