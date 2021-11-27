import { IdModelsInjectKey } from "@/symbols";
import Container from "typedi";
import { onMounted, Ref, inject, computed } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { ModelViewer } from "../ModelViewer";

export function useModelViewer(container: Ref<HTMLDivElement | null>) {
  const modelViewer = Container.get(ModelViewer);
  const route = useRoute();
  const models = inject(IdModelsInjectKey, []);
  const model = computed(
    () => models.find((m) => m.meta.id === route.params.modelId) ?? null
  );

  function destroy() {
    modelViewer.destroy();
    console.log("[ModelViewer] destroy");
  }

  async function init() {
    console.log("[ModelViewer] init");
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
