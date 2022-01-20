import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { Quasar } from "quasar";
import quasarUserOptions from "./quasar-user-options";
import "./assets/styles/index.scss";
import Http from "./api/index.js";

const app = createApp(App);

app.config.globalProperties.$Http = Http;

app.use(Quasar, quasarUserOptions).use(store).use(router).mount("#app");
