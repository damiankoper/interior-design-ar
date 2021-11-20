import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "@/views/Home.vue";
import ModelBrowser from "@/views/ModelBrowser.vue";
import ModelDetails from "@/views/ModelDetails.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/browser",
    name: "Model browser",
    component: ModelBrowser,
  },
  {
    path: "/browser/:modelId",
    name: "Model details",
    component: ModelDetails,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
