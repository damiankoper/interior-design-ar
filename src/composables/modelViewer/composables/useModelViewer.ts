import { IdModelsInjectKey } from "@/symbols";
import Container from "typedi";
import { watch, Ref, inject, computed } from "vue";
import { useRoute } from "vue-router";
import { ModelViewer } from "../ModelViewer";

export function useModelViewer(container: Ref<HTMLDivElement | null>) {
  const modelViewer = Container.get(ModelViewer);
  const route = useRoute();
  const models = inject(IdModelsInjectKey, []);
  const model = computed(
    () => models.find((m) => m.meta.id === route.params.modelId) ?? null
  );

  watch(
    [model, container],
    async ([model]) => {
      modelViewer.destroy();
      if (container.value && model) {
        await modelViewer.init(container.value, model);
        modelViewer.animate();
      }
    },
    { immediate: true }
  );

  return { model, meta: computed(() => model.value?.meta || null) };
}
