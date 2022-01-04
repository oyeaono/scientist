import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { Quasar } from "quasar";
import quasarUserOptions from "./quasar-user-options";
import axios from "axios";
import "./assets/styles/index.scss";

const app = createApp(App);

app.config.globalProperties.$axios = axios;

app.use(Quasar, quasarUserOptions).use(store).use(router).mount("#app");
