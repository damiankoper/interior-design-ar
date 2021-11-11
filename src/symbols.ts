// based on https://logaretm.com/blog/type-safe-provide-inject/

import { InjectionKey, Ref } from "vue";
import { IdSystem } from "@/composables/idSystem/IdSystem";

export const ModelsRefInjectKey: InjectionKey<Ref<IdSystem[]>> =
  Symbol("ModelsRefInjectKey");
