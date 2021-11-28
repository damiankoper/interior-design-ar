<template>
  <el-container>
    <Header :useAutocomplete="true" />
    <el-main v-if="model">
      <div class="model-details">
        <div ref="viewerRoot" class="viewer-root">
          <div class="viewer-root-overlay">
            <transition name="el-fade-in">
              <el-progress
                type="circle"
                :percentage="Math.round(progress * 100)"
                :stroke-width="8"
                v-if="progressVisible"
              />
            </transition>
          </div>
        </div>
        <div class="model-data">
          <el-row align="middle" class="" justify="space-between">
            <el-col :span="NaN">
              <h1>{{ meta.name }}</h1>
            </el-col>
            <el-col :span="NaN">
              <el-button
                @click="onARClick"
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
import { defineComponent, onMounted, PropType, ref } from "vue";

import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { useModelViewer } from "@/composables/modelViewer/composables/useModelViewer";
import { useModelsProgress } from "@/composables/idSystem/composables/useModelsProgress";
import * as THREE from "three";
import { SignalDispatcher } from "ste-signals";
import { onBeforeRouteLeave } from "vue-router";
export default defineComponent({
  name: "Model Details",
  components: { Header, Footer },
  props: {
    startAR: {
      type: Function as PropType<(object: THREE.Group | null) => Promise<void>>,
      required: true,
    },
    onSessionStart: {
      type: Object as PropType<SignalDispatcher>,
      required: true,
    },
    onSessionEnd: {
      type: Object as PropType<SignalDispatcher>,
      required: true,
    },
    isXrSupported: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const viewerRoot = ref<HTMLDivElement | null>(null);
    const { model, meta, init, destroy } = useModelViewer(viewerRoot);
    const { progress, progressVisible } = useModelsProgress();

    const events: (() => void)[] = [];
    onMounted(() => {
      events.push(props.onSessionStart.sub(destroy));
      events.push(props.onSessionEnd.sub(init));
    });
    onBeforeRouteLeave(() => {
      events.forEach((e) => e());
      events.splice(0, events.length);
    });

    return {
      viewerRoot,
      model,
      meta,
      progress,
      progressVisible,
      async onARClick() {
        if (model.value) props.startAR(await model.value.getModel());
      },
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
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    border-radius: 4px;
  }

  .viewer-root {
    height: 50vh;
    max-height: 500px;
    width: 100%;
    background: #ecf5ff;
    position: relative;
    &-overlay {
      pointer-events: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      transition: background 0.3s ease-in-out;
      background: linear-gradient(#00000000 99%, #00000010 100%);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    z-index: 1;
  }

  .model-data {
    background: white;
    position: relative;
    overflow: hidden;
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
