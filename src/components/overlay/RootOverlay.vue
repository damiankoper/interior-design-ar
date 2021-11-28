<template>
  <Teleport to="body">
    <div id="overlay" style="display: none; pointer-events: none">
      <el-progress
        v-if="progressVisible"
        text-inside
        class="progress"
        :percentage="Math.round(progress * 100)"
        :show-text="false"
        stroke-linecap="butt"
      />
      <el-row
        justify="space-between"
        style="position: absolute; top: 0; padding: 24px; width: 100%"
      >
        <el-button
          type="primary"
          @click="$emit('close')"
          @beforexrselect.prevent
        >
          <font-awesome-icon size="lg" :icon="['fas', 'times']" />
        </el-button>
        <transition name="el-fade-in">
          <div class="model-info" v-if="selectedModelMeta || progressVisible">
            {{ progressVisible ? "Loading..." : selectedModelMeta.name }}
          </div>
        </transition>
        <div>
          <el-button
            type="primary"
            v-if="sceneAvailable"
            @click="$emit('loadScene')"
            @beforexrselect.prevent
          >
            <font-awesome-icon
              size="lg"
              :icon="['fas', 'cloud-download-alt']"
            />
          </el-button>
          <el-button
            type="primary"
            @click="
              objectMenuDelete ? $emit('delete') : (objectMenu = !objectMenu)
            "
            @beforexrselect.prevent
          >
            <font-awesome-icon
              size="lg"
              :icon="[
                'fas',
                objectMenu
                  ? 'ellipsis-h'
                  : objectMenuDelete
                  ? 'trash'
                  : 'ellipsis-v',
              ]"
            />
          </el-button>
        </div>
      </el-row>
      <div style="position: absolute; bottom: 0; width: 100%">
        <el-row justify="center">
          <transition name="el-fade-in">
            <div class="toast" v-if="toast.visible">
              {{ toast.message }}
            </div>
          </transition>
        </el-row>
        <!-- TODO: Leszek: check if transitions kill performance -->
        <!-- <transition name="select"> -->
        <div class="object-select" v-if="objectMenu">
          <div
            v-for="i in 10"
            :key="i"
            class="object-container"
            @click="
              $emit('select:model', models[0]);
              objectMenu = false;
            "
            @beforexrselect.prevent
          >
            <!-- TODO: models[0] for test purposes -->
            <img src="/models/SheenChair/SheenChair.png" />
          </div>
        </div>
        <!-- </transition> -->
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { IdModelMeta } from "@/composables/idSystem/interfaces/IdModelMeta.interface.";
import { IdModel } from "@/composables/idSystem/models/IdModel";
import {
  SceneMode,
  SceneModeController,
} from "@/composables/webxr/domains/selectMode/controllers/SceneMode.controller";
import { Toast } from "@/composables/webxr/interfaces/Toast.interface";
import { EventDispatcher } from "ste-events";
import { defineComponent, onMounted, onUnmounted, PropType, ref } from "vue";

export default defineComponent({
  props: {
    sceneAvailable: { type: Boolean, default: false },
    toast: { type: Object as PropType<Toast>, required: true },
    progress: { type: Number, default: 0 },
    progressVisible: { type: Boolean, default: false },
    objects: { type: Array as PropType<unknown>, default: () => [] },
    models: { type: Array as PropType<IdModel[]>, required: true },
    onSceneModeChange: {
      type: Object as PropType<EventDispatcher<SceneMode, SceneModeController>>,
      required: true,
    },
  },
  emits: ["close", "delete", "select:model"],
  setup(props) {
    const objectMenu = ref(false);
    const objectMenuDelete = ref(false);
    const selectedModelMeta = ref<IdModelMeta | null>(null);

    const events: (() => void)[] = [];
    onMounted(() => {
      events.push(
        props.onSceneModeChange.sub(
          (mode: SceneMode, controller: SceneModeController) => {
            if (mode === SceneMode.SELECT) {
              objectMenu.value = false;
              objectMenuDelete.value = true;
              selectedModelMeta.value = controller.selectedIdModelMeta;
            } else {
              objectMenuDelete.value = false;
              selectedModelMeta.value = null;
            }
          }
        )
      );
    });

    onUnmounted(() => {
      events.forEach((e) => e());
    });

    return {
      objectMenu,
      objectMenuDelete,
      selectedModelMeta,
    };
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
  .progress {
    width: 100%;
    position: absolute;
    top: 0;
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
    border-radius: 4px;
    padding: 8px 12px;
    width: 100%;
    text-align: center;
    margin: 24px;
  }

  .model-info {
    background-color: #ffffffc0;
    border-radius: 4px;
    margin: 0 24px;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
