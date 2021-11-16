<template>
  <el-header :style="headerStyle">
    <el-row :gutter="10">
      <el-col :xs="4" :span="2" :xl="1">
        <el-button @click="onBack" type="primary" plain>
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </el-button>
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
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useWindowScroll } from "@/composables/useWindowScroll";

export default defineComponent({
  setup() {
    const searchValue = ref("");

    const router = useRouter();
    const onBack = () => {
      router.back();
    };

    const { isWindowScrolledToTop } = useWindowScroll();
    const headerStyle = computed(() => {
      return {
        boxShadow: isWindowScrolledToTop.value
          ? "none"
          : "0 8px 5px -5px rgb(0 0 0 / 0.4)",
        transition: "box-shadow 0.4s",
      };
    });

    return {
      searchValue,
      onBack,
      headerStyle,
    };
  },
});
</script>

<style lang="scss" scoped>
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
</style>
