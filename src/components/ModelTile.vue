<template>
  <div @click="openModelDetails()">
    <el-image fit="contain" :src="imageSrc"></el-image>
    <el-button
      @click.stop="startAR"
      :class="{ hidden: !isXrSupported }"
      type="primary"
      plain
    >
      <font-awesome-icon :icon="['fas', 'vr-cardboard']" />
    </el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from "vue";
import { useRouter } from "vue-router";

import { useXR } from "@/composables/webxr/composables/useXR";
import { IdSystem } from "@/composables/idSystem/IdSystem";

export default defineComponent({
  props: {
    model: { type: Object as PropType<IdSystem>, required: true },
  },

  setup(props) {
    const router = useRouter();
    const toastMessage = ref("");
    const { isXrSupported, startAR } = useXR(toastMessage);
    const modelMetaData = props.model.getModelMetaData();
    const imageSrc = modelMetaData.modelImagePath;

    const openModelDetails = () =>
      router.push({ path: `/browser/${modelMetaData.id}` });

    return {
      openModelDetails,
      imageSrc,
      startAR,
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
    box-shadow: var(--el-box-shadow-base);
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
