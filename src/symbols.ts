// based on https://logaretm.com/blog/type-safe-provide-inject/

import type { InjectionKey } from "vue";
import type { IdSystem } from "@/composables/idSystem/IdSystem";

export const IdSystemsInjectKey: InjectionKey<IdSystem[]> =
  Symbol("IdSystemsInjectKey");
