<template>
  <el-container>
    <Header :useAutocomplete="true" />
    <el-main v-if="model">
      <div class="model-details">
        <div ref="viewerRoot" class="viewer-root">
          <div class="viewer-root-overlay" />
        </div>
        <div class="model-data">
          <el-row align="middle" class="" justify="space-between">
            <el-col :span="NaN">
              <h1>{{ meta.name }}</h1>
            </el-col>
            <el-col :span="NaN">
              <el-button
                @click="startAR"
                :disabled="!isXrSupported"
                type="primary"
                plain
              >
                <font-awesome-icon :icon="['fas', 'vr-cardboard']" />
              </el-button>
            </el-col>
            <el-col :span="24" class="desc" v-html="meta.description" />
          </el-row>
        </div>
      </div>
    </el-main>
    <div class="not-found" v-else>
      <p>Requested model was not found</p>
      <router-link to="/">
        <el-button>Go back to main page</el-button>
      </router-link>
    </div>
    <Footer />
  </el-container>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";

import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { useModelViewer } from "@/composables/modelViewer/composables/useModelViewer";

export default defineComponent({
  name: "Model Details",
  components: { Header, Footer },
  props: {
    startAR: {
      type: Function as PropType<() => Promise<void>>,
      required: true,
    },
    isXrSupported: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const viewerRoot = ref<HTMLDivElement | null>(null);
    const { model, meta } = useModelViewer(viewerRoot);

    return {
      viewerRoot,
      model,
      meta,
    };
  },
});
</script>

<style lang="scss" scoped>
.el-main {
  background-color: rgb(245, 245, 245);
  min-height: 100vh;

  .el-button {
    padding: 6px 11px;
    font-size: 1.5rem;
    line-height: 2.5rem;
  }

  h1 {
    font-size: 2rem;
    margin: 20px 0 20px;
    text-align: left;
  }

  p.desc {
    text-align: justify;
  }
  .hidden {
    display: none;
  }

  .model-details {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  }

  .viewer-root {
    height: 50vh;
    max-height: 500px;
    width: 100%;
    background: #ecf5ff;
    border-radius: 4px 4px 0 0;
    position: relative;
    &-overlay {
      pointer-events: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(#00000000 99%, #00000010 100%);
    }
    z-index: 1;
  }

  .model-data {
    background: white;
    position: relative;
    overflow: hidden;
    border-radius: 0 0 4px 4px;
    padding: 16px;
    width: 100%;
    box-sizing: border-box;
  }
}

.not-found {
  --not-found-padding-top: 100px;
  text-align: center;
  width: 100%;
  height: calc(100vh - var(--not-found-padding-top));
  padding-top: var(--not-found-padding-top);
  font-size: 2rem;
  background-color: rgb(245, 245, 245);
}
</style>
