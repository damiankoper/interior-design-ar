// based on https://logaretm.com/blog/type-safe-provide-inject/

import { InjectionKey, Ref } from "vue";
import { IdObject } from "@/composables/idSystem/interfaces/IdObject.interface";

export const ModelsRefInjectKey: InjectionKey<Ref<IdObject[]>> =
  Symbol("ModelsRefInjectKey");
