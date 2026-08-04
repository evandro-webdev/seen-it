import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import "./style.css";
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

const app = createApp(App);

app.config.errorHandler = (err, instance, info) => {
  console.error("Exceção não tratada capturada pelo Vue:", err);
  console.error("Info:", info);
};

app.use(createPinia());
app.use(router);

app.mount("#app");
