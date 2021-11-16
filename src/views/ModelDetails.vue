<template>
  <el-header class="hidden-md-and-down">
    <el-row :gutter="10">
      <el-col :xs="4" :span="2" :xl="1">
        <router-link to="/">
          <el-button type="primary" plain>
            <font-awesome-icon :icon="['fas', 'arrow-left']" />
          </el-button>
        </router-link>
      </el-col>
      <el-col class="hidden-sm-and-down" :span="2">
        <h1 class="logo">
          <span>ID</span>
          <span>AR</span>
        </h1>
      </el-col>
      <el-col
        :span="22"
        :xs="{ span: 19, offset: 1 }"
        :md="{ span: 12, offset: 8 }"
        :xl="{ span: 8, offset: 13 }"
      >
        <el-input
          v-model="searchValue"
          placeholder="Search for model"
          clearable
        >
          <template #prefix>
            <font-awesome-icon
              style="margin-left: 5px"
              :icon="['fas', 'search']"
            />
          </template>
        </el-input>
      </el-col>
    </el-row>
  </el-header>
  <el-container>
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
    <p class="not-found" v-else>Requested model was not found</p>
    <Footer />
  </el-container>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref } from "vue";
import { useRoute } from "vue-router";
import { ModelsRefInjectKey } from "@/symbols";

import Footer from "@/components/Footer.vue";

import { useXR } from "@/composables/webxr/composables/useXR";

export default defineComponent({
  name: "Model Details",
  components: { Footer },
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

    const searchValue = ref("");

    return {
      modelMetaData,
      startAR,
      isXrSupported,
      searchValue,
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

.el-header {
  --el-header-padding: 10px 10px;
  @media only screen and (min-width: 1200px) {
    --el-header-padding: 10px 200px;
  }
  top: 0px;
  left: 0px;
  position: fixed;
  width: 100%;
  background-color: white;
  z-index: 100;

  .el-button {
    padding: 12px 13px;
  }

  .logo {
    margin: -5px 0 0;
    line-height: 1;
    font-size: 1.1rem;
    span:first-child {
      font-size: 3em;
    }
    span:last-child {
      font-size: 0.75em;
      position: relative;
      left: -0.3rem;
    }
  }
}

.not-found {
  text-align: center;
  width: 100%;
  margin-top: 100px;
  font-size: 2rem;
}
</style>
