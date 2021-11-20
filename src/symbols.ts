// based on https://logaretm.com/blog/type-safe-provide-inject/

import type { InjectionKey } from "vue";
import type { IdModel } from "@/composables/idSystem/IdModel";

export const IdModelsInjectKey: InjectionKey<IdModel[]> =
  Symbol("IdModelsInjectKey");
