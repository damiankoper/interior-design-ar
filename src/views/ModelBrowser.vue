<template>
  <el-container>
    <Header @filterChange="onFilterChange" />
    <el-main>
      <el-row :gutter="8">
        <el-col
          :span="6"
          :xs="12"
          :lg="6"
          v-for="(model, index) in modelsFiltered"
          :key="index"
        >
          <ModelTile
            class="model-tile"
            :model="model"
            :isXrSupported="isXrSupported"
            :startAR="startAR"
          />
        </el-col>
      </el-row>
    </el-main>
    <Footer />
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from "vue";

import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import ModelTile from "@/components/ModelTile.vue";
import * as THREE from "three";
import Container from "typedi";
import { IdModelsService } from "@/composables/idSystem/services/IdModels.service";

export default defineComponent({
  components: { Header, Footer, ModelTile },
  props: {
    startAR: {
      type: Function as PropType<(object: THREE.Group | null) => Promise<void>>,
      required: true,
    },
    isXrSupported: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const idModelsService = Container.get(IdModelsService);

    const modelsFiltered = computed(() => {
      return idModelsService
        .getIdModels()
        .filter(
          (model) =>
            !filter.value ||
            model.meta.name?.toLowerCase().includes(filter.value) ||
            model.meta.type?.toLowerCase().includes(filter.value)
        );
    });

    const filter = ref("");
    const onFilterChange = (filterValue: string) => {
      filter.value = filterValue.toLowerCase();
    };

    return {
      modelsFiltered,
      onFilterChange,
    };
  },
});
</script>

<style lang="scss" scoped>
.el-main {
  background-color: rgb(245, 245, 245);
  min-height: 100vh;

  .model-tile {
    margin-bottom: 8px;
  }
}
</style>
