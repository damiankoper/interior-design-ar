import "reflect-metadata";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/display.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faVrCardboard,
  faCubes,
  faTimes,
  faEllipsisH,
  faEllipsisV,
  faCloudDownloadAlt,
  faSearch,
  faArrowLeft,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faVrCardboard,
  faCubes,
  faTimes,
  faEllipsisH,
  faEllipsisV,
  faCloudDownloadAlt,
  faSearch,
  faArrowLeft,
  faTrash
);

createApp(App)
  .use(router)
  .use(ElementPlus)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
