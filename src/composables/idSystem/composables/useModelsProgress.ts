import Container from "typedi";
import { IdModelsService } from "../services/IdModels.service";
import { ref, onMounted, onUnmounted, computed } from "vue";
import { onBeforeRouteLeave } from "vue-router";

export function useModelsProgress(ignoreLeave = false) {
  const service = Container.get(IdModelsService);
  const events: (() => void)[] = [];
  const progress = ref(1); // loaded by default

  const progressVisibleDebounced = ref(false);
  const progressVisible = computed(() => {
    if (!progressVisibleDebounced.value) {
      return false;
    } else return progress.value < 1;
  });

  onMounted(() => {
    setTimeout(() => (progressVisibleDebounced.value = true), 300);
    events.push(
      service.onLoadProgress.sub((p) => {
        progress.value = p;
      })
    );
  });

  if (!ignoreLeave)
    onBeforeRouteLeave(() => {
      events.forEach((e) => e());
    });

  onUnmounted(() => {
    events.forEach((e) => e());
  });

  return { progress, progressVisible };
}
