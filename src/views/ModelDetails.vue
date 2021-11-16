<template>
  <el-container>
    <Header />
    <el-main v-if="modelMetaData">
      <el-image fit="contain" :src="modelMetaData.modelImagePath" />
      <el-row align="middle">
        <el-col :span="20" :xl="24">
          <h1>{{ modelMetaData.name }}</h1>
        </el-col>
        <el-col class="hidden-xl-only" :span="4">
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
import { computed, defineComponent, inject, ref } from "vue";
import { useRoute } from "vue-router";
import { ModelsRefInjectKey } from "@/symbols";

import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { useXR } from "@/composables/webxr/composables/useXR";

export default defineComponent({
  name: "Model Details",
  components: { Header, Footer },
  setup() {
    const route = useRoute();
    const models = inject(ModelsRefInjectKey);
    const modelMetaData = computed(() =>
      models?.value
        .find((m) => m.getModelMetaData().id === route.params.modelId)
        ?.getModelMetaData()
    );

    const toastMessage = ref("");
    const { isXrSupported, startAR } = useXR(toastMessage);

    return {
      modelMetaData,
      startAR,
      isXrSupported,
    };
  },
});
</script>

<style lang="scss" scoped>
.el-main {
  background-color: rgb(245, 245, 245);
  min-height: 100vh;
  --el-main-padding: 60px 0 0;
  @media only screen and (min-width: 1200px) {
    --el-main-padding: 70px 200px 32px;
  }

  .el-row {
    padding: 0 20px 0;
  }

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
