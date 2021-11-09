import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "@/views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/browser",
    name: "Model browser",
    component: () =>
      import(/* webpackChunkName: "browser" */ "@/views/ModelBrowser.vue"),
  },
  {
    path: "/browser/:modelName",
    name: "Model details",
    component: () =>
      import(/* webpackChunkName: "browser" */ "@/views/ModelDetails.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
