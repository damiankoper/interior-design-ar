<template>
  <Teleport to="body">
    <div
      id="overlay"
      style="
        display: none;
        flex-direction: column;
        justify-content: space-between;
        pointer-events: none;
      "
    >
      <el-row justify="space-between" style="padding: 24px">
        <el-button type="primary" @click="$emit('close')">
          <font-awesome-icon size="lg" :icon="['fas', 'times']" />
        </el-button>
        <div>
          <el-button
            type="primary"
            v-if="sceneAvailable"
            @click="$emit('loadScene')"
          >
            <font-awesome-icon
              size="lg"
              :icon="['fas', 'cloud-download-alt']"
            />
          </el-button>
          <el-button type="primary" @click="objectMenu = !objectMenu">
            <font-awesome-icon
              size="lg"
              :icon="['fas', objectMenu ? 'ellipsis-h' : 'ellipsis-v']"
            />
          </el-button>
        </div>
      </el-row>
      <div>
        <el-row justify="center">
          <transition name="el-fade-in">
            <div class="toast" v-if="toastVisible">{{ toastMessage }}</div>
          </transition>
        </el-row>
        <transition name="select">
          <div class="object-select" v-if="objectMenu" v-loading="loading">
            <div
              v-for="i in 10"
              :key="i"
              class="object-container"
              @click="$emit('select:model', i)"
            >
              <!-- TODO: iterate over props.objects when available -->
              <!-- TODO: later model object instead of 'i' in $emit -->
              <img src="/models/SheenChair/SheenChair.png" />
            </div>
          </div>
        </transition>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";

export default defineComponent({
  props: {
    sceneAvailable: { type: Boolean, default: false },
    toastMessage: { type: String, default: "" },
    loading: { type: Boolean, default: false },
    objects: { type: Array as PropType<unknown>, default: () => [] },
  },
  emits: ["close", "select:model"],
  setup(props) {
    const objectMenu = ref(false);
    const toastVisible = ref(false);
    const toastTimeout = 5000;
    let toastTimer: ReturnType<typeof setTimeout> | null = null;
    watch(
      () => props.toastMessage,
      () => {
        if (toastTimer) clearTimeout(toastTimer);
        toastVisible.value = true;
        toastTimer = setTimeout(
          () => (toastVisible.value = false),
          toastTimeout
        );
      }
    );
    return { objectMenu, toastVisible };
  },
});
</script>

<style lang="scss" scoped>
#overlay {
  .el-button {
    $size: 48px;
    width: $size;
    height: $size;
    padding: 12px 0;
    opacity: 0.75;
    pointer-events: all;
  }
  $height: 80px;
  $padding: 16px;
  .object-select {
    height: $height;
    padding: $padding;
    background-color: #ffffffc0;
    display: flex;
    position: relative;
    flex-wrap: nowrap;
    overflow-x: scroll;
    overflow-y: hidden;
    align-items: stretch;
    top: 0px;
    will-change: top;

    &.select-enter-active {
      transition: top 0.3s ease-out;
    }
    &.select-leave-active {
      transition: top 0.3s ease-in;
    }

    &.select-enter-from,
    &.select-leave-to {
      top: #{$height + 2 * $padding};
      .object-container {
        left: 40px;
        opacity: 0;
      }
    }

    .object-container {
      position: relative;
      left: 0px;
      max-height: 100%;
      background-color: #a0cfff;
      border-radius: 4px;
      margin-right: 16px;
      transition: left 0.3s ease-out, opacity 0.3s ease-out;
      will-change: left, opacity;
      transition-delay: 0.3s;
      cursor: pointer;

      pointer-events: all;

      &:active {
        background: #0d84ff;
      }

      img {
        height: 100%;
      }
    }
  }
  .toast {
    background-color: #ffffffc0;
    border-radius: 999px;
    padding: 8px 12px;
    min-width: 60%;
    max-width: 80%;
    text-align: center;
    margin-bottom: 48px;
  }
}
</style>
