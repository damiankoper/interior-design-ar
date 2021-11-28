import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { IdModelMeta } from "./idSystem/interfaces/IdModelMeta.interface.";
import Container from "typedi";
import { IdModelsService } from "./idSystem/services/IdModels.service";

export function useModelSearch() {
  const searchValue = ref("");
  const idModelsService = Container.get(IdModelsService);
  const metaModels = computed(() =>
    idModelsService.getIdModels().map((model) => model.meta)
  );

  const querySearch = (queryString: string, cb: (a: IdModelMeta[]) => void) => {
    const results = queryString
      ? metaModels.value.filter(createFilter(queryString))
      : metaModels.value;
    // call callback function to return suggestions
    cb(results);
  };

  const createFilter = (queryString: string) => {
    return (model: IdModelMeta) => {
      return (
        model.name?.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
      );
    };
  };

  const router = useRouter();
  const onSelect = (modelMetaData: IdModelMeta) => {
    if (router.currentRoute.value.name === "Model details") {
      router.replace({ path: `/browser/${modelMetaData.id}` });
    } else {
      router.push({ path: `/browser/${modelMetaData.id}` });
    }
  };

  return {
    searchValue,
    querySearch,
    onSelect,
  };
}
