<template>
  <el-header :style="headerStyle">
    <el-row :gutter="8" justify="space-between" style="flex-wrap: nowrap">
      <el-col :span="NaN">
        <el-row :gutter="16">
          <el-col :span="NaN">
            <el-button @click="onBack" type="primary" plain>
              <font-awesome-icon :icon="['fas', 'arrow-left']" />
            </el-button>
          </el-col>

          <el-col :span="NaN">
            <router-link class="hidden-sm-and-down no-link" to="/">
              <h1 class="logo">
                <span>ID</span>
                <span>AR</span>
              </h1>
            </router-link>
          </el-col>
        </el-row>
      </el-col>
      <el-col v-if="!modelMeta" :span="NaN" :md="5" :lg="5" :xl="5">
        <el-input
          placeholder="Search for model"
          clearable
          v-model="filterValue"
          @input="onFilterInput"
        >
          <template #prefix>
            <font-awesome-icon
              style="margin-left: 5px"
              :icon="['fas', 'search']"
            />
          </template>
        </el-input>
      </el-col>
      <el-col v-else :span="NaN">
        <div style="font-size: 12px; text-align: right">
          {{ modelMeta.type }}
        </div>
        <h2 style="margin-top: 0px">
          {{ modelMeta.name }}
        </h2>
      </el-col>
    </el-row>
  </el-header>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from "vue";
import { useRouter } from "vue-router";
import { debounce } from "lodash";
import { useWindowScroll } from "@/composables/useWindowScroll";
import { IdModelMeta } from "@/composables/idSystem/interfaces/IdModelMeta.interface.";

export default defineComponent({
  props: {
    modelMeta: {
      type: Object as PropType<IdModelMeta>,
      required: false,
    },
  },
  emits: ["filterChange"],
  setup(props, { emit }) {
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

    const filterValue = ref("");
    const onFilterInput = debounce((filter) => {
      emit("filterChange", filter);
    }, 300);

    return {
      ...props,
      onBack,
      headerStyle,
      filterValue,
      onFilterInput,
    };
  },
});
</script>

<style lang="scss" scoped>
.el-header {
  --el-header-padding: 10px 12px;
  @media only screen and (min-width: 1200px) {
    --el-header-padding: 10px 250px;
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
    user-select: none;
    margin: -6px 0 0;
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

  h1 {
    font-size: 2.4rem;
    margin: 0px;
    text-align: right;
  }

  .no-link {
    border: none;
    outline: none;
    text-decoration: none;
    color: inherit;
    -webkit-tap-highlight-color: white;
  }
}
</style>
