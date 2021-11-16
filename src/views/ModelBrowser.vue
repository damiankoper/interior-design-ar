<template>
  <el-container>
    <Header />
    <el-main>
      <el-row :gutter="10">
        <el-col
          :span="6"
          :xs="12"
          :lg="4"
          v-for="(model, index) in modelsRef"
          :key="index"
        >
          <ModelTile class="model-tile" :model="model"></ModelTile>
        </el-col>
      </el-row>
    </el-main>
    <Footer />
  </el-container>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import { ModelsRefInjectKey } from "@/symbols";

import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import ModelTile from "@/components/ModelTile.vue";

export default defineComponent({
  components: { Header, Footer, ModelTile },
  setup() {
    const modelsRef = inject(ModelsRefInjectKey);

    return {
      modelsRef,
    };
  },
});
</script>

<style lang="scss" scoped>
.el-main {
  --el-main-padding: 70px 10px 32px;
  @media only screen and (min-width: 1200px) {
    --el-main-padding: 70px 200px 32px;
  }
  background-color: rgb(245, 245, 245);
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;

  .model-tile {
    margin-bottom: 6px;
  }
}
</style>
