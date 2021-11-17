// based on https://logaretm.com/blog/type-safe-provide-inject/

import type { InjectionKey, Ref } from "vue";
import type { IdSystem } from "@/composables/idSystem/IdSystem";

export const ModelsRefInjectKey: InjectionKey<Ref<IdSystem[]>> =
  Symbol("ModelsRefInjectKey");
