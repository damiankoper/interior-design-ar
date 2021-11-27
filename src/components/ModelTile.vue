<template>
  <div class="model-tile" @click="openModelDetails()">
    <el-image fit="contain" :src="imageSrc" />
    <div class="label">
      <h2 class="hidden-sm-and-down">{{ model.meta.name }}</h2>
      <h3 class="hidden-md-and-up">{{ model.meta.name }}</h3>
      <!-- TODO: "AR not supported" el-tooltip to the left-->
      <el-button
        @click.prevent.stop="onARClick"
        :disabled="!isXrSupported"
        type="primary"
        plain
      >
        <font-awesome-icon :icon="['fas', 'vr-cardboard']" />
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { useRouter } from "vue-router";

import { IdModel } from "@/composables/idSystem/IdModel";
import * as THREE from "three";

export default defineComponent({
  props: {
    model: {
      type: Object as PropType<IdModel>,
      required: true,
    },
    startAR: {
      type: Function as PropType<(object: THREE.Group | null) => Promise<void>>,
      required: true,
    },
    isXrSupported: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const router = useRouter();

    const openModelDetails = () => {
      const modelMeta = props.model.meta;
      router.push({ path: `/browser/${modelMeta.id}` });
    };

    return {
      openModelDetails,
      imageSrc: computed(() => props.model.meta.thumbnailPath),
      async onARClick() {
        if (props.model) props.startAR(await props.model.getModel());
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.model-tile {
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  padding-top: 100%;
  box-shadow: var(--el-box-shadow-base);
  transition: background ease-in-out 0.15s;

  &:hover {
    background: #ecf5ff;
  }

  .el-image {
    position: absolute;
    top: 0;
    width: 100%;
  }

  .label {
    width: calc(100% - 16px);
    background-color: #ffffffdd;
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;

    h2,
    h3 {
      margin: 0;
    }

    .el-button {
      padding: 6px 10.25px;
      margin-left: 4px;
      height: 40px;
    }
  }

  .hidden {
    display: none;
  }
}
</style>
