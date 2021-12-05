import { IdModelsService } from "@/composables/idSystem/services/IdModels.service";
import Container from "typedi";
import { onMounted, Ref, computed } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { ModelViewer } from "../ModelViewer";

export function useModelViewer(container: Ref<HTMLDivElement | null>) {
  const modelViewer = Container.get(ModelViewer);
  const idModelsService = Container.get(IdModelsService);
  const route = useRoute();
  const model = computed(
    () =>
      idModelsService
        .getIdModels()
        .find((m) => m.meta.id === route.params.modelId) ?? null
  );

  function destroy() {
    modelViewer.destroy();
  }

  async function init() {
    modelViewer.destroy();

    if (container.value && model.value) {
      await modelViewer.init(container.value, model.value);
      modelViewer.animate();
    }
  }

  onMounted(init);
  onBeforeRouteLeave(destroy);

  return {
    destroy,
    init,
    model,
    meta: computed(() => model.value?.meta || null),
  };
}
