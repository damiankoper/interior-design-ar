<template>
  <Teleport to="body">
    <div
      id="overlay"
      style="
        display: none;
        flex-direction: column;
        justify-content: space-between;
      "
    >
      <el-row justify="space-between" style="padding: 24px">
        <el-button type="primary" @click="$emit('close')">
          <font-awesome-icon size="lg" :icon="['fas', 'times']" />
        </el-button>
        <div>
          <el-button type="primary">
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
      <transition name="select">
        <div class="object-select" v-if="objectMenu">
          <div v-for="i in 10" :key="i" class="object-container">
            <img src="/models/SheenChair/SheenChair.png" />
          </div>
        </div>
      </transition>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  emits: ["close"],
  setup() {
    const objectMenu = ref(false);
    return { objectMenu };
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
      transition-delay: 0.3s;

      img {
        height: 100%;
      }
    }
  }
}
</style>
