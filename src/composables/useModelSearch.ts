import { ref, computed, inject } from "vue";
import { useRouter } from "vue-router";
import type { ModelMetaData } from "@/composables/idSystem/interfaces/ModelMetaData.interface";
import { ModelsRefInjectKey } from "@/symbols";

export function useModelSearch() {
  const searchValue = ref("");
  const xmodels = inject(ModelsRefInjectKey, ref([]));
  const metaModels = computed(() =>
    xmodels.value.map((model) => model.getModelMetaData())
  );

  const querySearch = (
    queryString: string,
    cb: (a: ModelMetaData[]) => void
  ) => {
    const results = queryString
      ? metaModels.value.filter(createFilter(queryString))
      : metaModels.value;
    // call callback function to return suggestions
    cb(results);
  };

  const createFilter = (queryString: string) => {
    return (model: ModelMetaData) => {
      return model.name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1;
    };
  };

  const router = useRouter();
  const onSelect = (modelMetaData: ModelMetaData) => {
    router.push({ path: `/browser/${modelMetaData.id}` });
  };

  return {
    searchValue,
    querySearch,
    onSelect,
  };
}