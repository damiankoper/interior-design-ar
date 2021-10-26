<template>
  <el-container>
    <el-main class="home">
      <div class="home-main">
        <el-row :gutter="24" align="middle" justify="center">
          <el-col>
            <el-image class="logo" fit="contain" :src="logoImg"></el-image>
          </el-col>
          <el-col>
            <span>design the shit out of your room</span>
          </el-col>
        </el-row>
        <div style="flex-grow: 1"></div>
        <el-row :gutter="24" align="middle" justify="center">
          <el-col>
            <router-link to="/about">
              <el-button type="primary">
                <font-awesome-icon :icon="['fas', 'cubes']" /> Browse models
              </el-button>
            </router-link>
          </el-col>
          <el-col>
            <el-button
              type="primary"
              @click="startAR"
              :disabled="!isXrSupported"
            >
              <font-awesome-icon :icon="['fas', 'vr-cardboard']" />
              {{ startARButtonLabel }}
            </el-button>
          </el-col>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
%flexbox {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.home {
  @extend %flexbox;
  min-height: 97vh;
  &-main {
    @extend %flexbox;
    max-width: 500px;
    height: 100%;
    padding: 15vh 0 15vh;
    @media only screen and (orientation: landscape) and (min-height: 850px) {
      padding: 20vh 0 20vh;
    }
    .logo {
      max-width: 70%;
    }
    span {
      @media only screen and (max-width: 640px) {
        font-size: 3.7vw;
      }
      @media only screen and (min-width: 640px) {
        font-size: 1.5rem;
      }
    }
    .el-button {
      width: 100%;
      margin: 10px 0;
      font-weight: 700;
      font-size: 1.1rem;
    }
  }
}
</style>

<script lang="ts">
import { defineComponent, onMounted, computed } from "vue";
import { useXR } from "@/composables/webxr/useXR";
//import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

export default defineComponent({
  name: "Home",
  components: {
    //HelloWorld,
  },
  setup() {
    const { isXrSupported, getXRSupport, startAR } = useXR();

    const startARButtonLabel = computed(() =>
      isXrSupported.value ? "Design in AR" : "AR not supported"
    );

    onMounted(async () => {
      await getXRSupport();
    });

    return {
      logoImg: require("@/assets/logo.svg"),
      startAR,
      isXrSupported,
      startARButtonLabel,
    };
  },
});
</script>
