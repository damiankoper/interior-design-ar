<template>
  <el-container>
    <el-main>
      <el-image fit="contain" :src="model.imageSrc" />
      <el-row align="middle">
        <el-col :span="18">
          <h1>{{ model.name }}</h1>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" plain>
            <font-awesome-icon :icon="['fas', 'vr-cardboard']" />
          </el-button>
        </el-col>
        <el-col>
          <p class="desc">
            {{ model.description }}
          </p>
        </el-col>
      </el-row>
    </el-main>
    <Footer />
  </el-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import Footer from "@/components/Footer.vue";
import models from "@/assets/models.json";

export default defineComponent({
  name: "Model Details",
  components: { Footer },
  setup() {
    const route = useRoute();
    const model = reactive({ name: "", description: "", imageSrc: "" });

    onMounted(() => {
      const modelName = route.params.modelName as string;

      const modelInfo = models.find(
        (mdl) =>
          mdl.id.localeCompare(modelName, undefined, {
            sensitivity: "base",
          }) === 0
      );

      if (modelInfo) {
        // TODO display model info
        model.name = modelInfo.name;
        model.description = modelInfo.description;
        model.imageSrc = `/models/${modelInfo.id}/${modelInfo.id}.png`;
      } else {
        // TODO display not found page
      }
    });

    return {
      model,
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

  .el-row {
    padding: 0 10px 0;
  }

  .el-button {
    padding: 6px 11px;
    font-size: 1.5rem;
    line-height: 2.5rem;
  }

  h1 {
    font-size: 2rem;
    margin: 20px 0 20px;
  }

  p.desc {
    text-align: justify;
  }
}
</style>
