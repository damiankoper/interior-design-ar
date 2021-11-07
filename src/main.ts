import "reflect-metadata";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faVrCardboard,
  faCubes,
  faTimes,
  faEllipsisH,
  faEllipsisV,
  faCloudDownloadAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faVrCardboard,
  faCubes,
  faTimes,
  faEllipsisH,
  faEllipsisV,
  faCloudDownloadAlt
);

createApp(App)
  .use(router)
  .use(ElementPlus)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
