<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, provide, ref } from "vue";
import { ModelsRefInjectKey } from "@/symbols";
import modelsMetaJson from "@/assets/models.json";

import { IdSystem } from "@/composables/idSystem/IdSystem";

export default defineComponent({
  setup() {
    const idOSystems: IdSystem[] = modelsMetaJson.map((modelMeta) => {
      const modelPath = `/models/${modelMeta.id}/${modelMeta.id}`;
      return new IdSystem({
        ...modelMeta,
        modelImagePath: `${modelPath}.png`,
        webGlModelPath: `${modelPath}.glb`,
      });
    });
    const models = ref<IdSystem[]>(idOSystems);
    provide(ModelsRefInjectKey, models);
  },
});
</script>

<style lang="scss">
html,
body {
  padding: 0;
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
