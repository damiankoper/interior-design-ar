import { IdSystem } from "@/composables/idSystem/IdSystem";
import Container from "typedi";
import { onMounted, onUnmounted, Ref } from "vue";
import { ModelViewer } from "../ModelViewer";

export function useModelViewer(
  container: Ref<HTMLDivElement | null>,
  model: Ref<IdSystem | null>
) {
  const modelViewer = Container.get(ModelViewer);

  onMounted(async () => {
    if (container.value && model.value) {
      await modelViewer.init(container.value, model.value);
      modelViewer.animate();
    }
  });

  onUnmounted(() => {
    if (model.value) {
      model.value.purge();
      modelViewer.destroy();
    }
  });
}
