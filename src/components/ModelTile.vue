<template>
  <div class="model-tile" @click="openModelDetails()">
    <el-image fit="contain" :src="imageSrc" />
    <div class="label">
      <p>{{ model.getModelMetaData().name }}</p>
      <el-button
        @click.stop="startAR"
        :class="{ hidden: !isXrSupported }"
        type="primary"
        plain
      >
        <font-awesome-icon :icon="['fas', 'vr-cardboard']" />
      </el-button>
    </div>
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
.model-tile {
  cursor: pointer;
  position: relative;

  .label {
    width: calc(100% - 20px);
    background-color: rgba(255, 255, 255, 0.507);
    position: absolute;
    bottom: 0;
    padding: 10px 10px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
      margin: auto;
      flex: 1;
      font-weight: 700;
    }

    .el-button {
      padding: 6px 10.25px;
      margin: auto;
      height: 40px;
    }
  }

  .el-image {
    width: 100%;
    box-shadow: var(--el-box-shadow-base);
    transition: all 200ms ease-out;
  }

  .el-image:hover {
    box-shadow: 0 2px 4px 2px rgba(0, 0, 0, 0.12),
      0 0 6px 8px rgba(0, 0, 0, 0.04);
  }

  .hidden {
    display: none;
  }
}
</style>
