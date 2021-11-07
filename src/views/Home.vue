<template>
  <el-container>
    <el-main class="home">
      <el-row>
        <el-col :span="24">
          <h1 class="logo">
            <span>ID</span>
            <span>AR</span>
          </h1>
          <span class="sublogo">interior design made easy for everyone</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <router-link to="/about">
            <el-button type="primary">
              <font-awesome-icon size="2x" :icon="['fas', 'cubes']" /> Browse
              models
            </el-button>
          </router-link>
        </el-col>
        <el-col :span="24">
          <el-button type="primary" @click="startAR" :disabled="!isXrSupported">
            <font-awesome-icon size="2x" :icon="['fas', 'vr-cardboard']" />
            {{ isXrSupported ? "Design in AR" : "AR not supported" }}
          </el-button>
        </el-col>
      </el-row>
    </el-main>

    <!-- TODO: extract footer to component -->
    <el-footer
      height="32px"
      style="background-color: white; display: flex; align-items: center"
    >
      Stopa
    </el-footer>
    <!-- TODO: extract footer to component -->
  </el-container>

  <RootOverlay @close="stopAR" :toastMessage="toastMessage" />
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import { useXR } from "@/composables/webxr/composables/useXR";
import RootOverlay from "@/components/overlay/RootOverlay.vue";

export default defineComponent({
  name: "Home",
  components: { RootOverlay },
  setup() {
    const toastMessage = ref("");
    const { isXrSupported, getXRSupport, startAR, stopAR } =
      useXR(toastMessage);

    onMounted(async () => {
      await getXRSupport();
    });

    onUnmounted(() => {
      stopAR();
    });

    return {
      startAR,
      stopAR,
      isXrSupported,
      toastMessage,
    };
  },
});
</script>

<style lang="scss" scoped>
.el-container {
  background: rgb(110, 226, 245);
  background: linear-gradient(
    147deg,
    rgb(255, 255, 255) 0%,
    rgb(160, 204, 255) 100%
  );
}

.home {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: calc(100vh - 32px);

  .logo {
    margin: 0;
    line-height: 1;
    font-size: 5rem;
    span:first-child {
      font-size: 3em;
    }
    span:last-child {
      font-size: 0.75em;
      position: relative;
      left: -1.5rem;
    }
  }
  .sublogo {
    font-size: 1.08rem;
    position: relative;
    top: -2rem;
  }

  .el-button {
    margin: 10px 0;
    font-weight: 700;
    font-size: 1.1em;
    width: 100%;
    max-width: 344px;
    :deep(span) {
      display: flex;
      justify-content: center;
      align-items: center;
      svg {
        width: 1em;
        margin-right: 16px;
      }
    }
  }
}
</style>
