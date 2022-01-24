<template>
  <router-view />
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  getCurrentInstance,
} from "vue";
const { ipcRenderer } = window.electron;
import { useStore } from "vuex";
import getPcMsg from "./utils/hardware.js";
const fs = window.fs.fs;

export default defineComponent({
  name: "App",
  setup() {
    const instance = getCurrentInstance();
    const store = useStore();
    let timer = null;
    const state = reactive({
      cdk: "",
      unlockData: [],
      async timingDetection() {
        const res =
          await instance.appContext.config.globalProperties.$Http.timingDetection(
            {
              password: state.cdk,
              pcAddress: getPcMsg.mac,
            },
            true
          );
        console.log("定时检测", res);
        if (res.code !== 100000) {
          store.commit("setIsActivation", true);
          ipcRenderer.send("valid-error", {
            isClose: true,
          });
          clearInterval(timer);
          timer = null;
        } else {
          res.data.forEach((item) => {
            if (new Date(item.endTime) > new Date()) {
              if (item.functionId === 1) {
                store.commit("setAutoOrder", false);
              } else if (item.functionId === 2) {
                store.commit("setMarketOpen", false);
              } else if (item.functionId === 3) {
                store.commit("setPreSale", false);
              }
            }
          });
        }
      },
    });
    onMounted(() => {
      try {
        console.log("App");
        state.cdk = fs.readFileSync("cdk.txt", "utf-8");
        state.timingDetection();
      } catch (e) {
        store.commit("setIsActivation", true);
        ipcRenderer.send("valid-error", {
          isClose: true,
        });
      }
      const Listener = window.ipc.on("start-check", (data) => {
        if (data.isClose) {
          timer = setInterval(() => {
            try {
              state.cdk = fs.readFileSync("cdk.txt", "utf-8");
              state.timingDetection();
            } catch (e) {
              store.commit("setIsActivation", true);
              ipcRenderer.send("valid-error", {
                isClose: true,
              });
            }
            console.log("cdk", state.cdk);
          }, 10000);
        }
      });
      Listener();

      ipcRenderer.send("main-finish", {
        isClose: true,
      });
    });
    return {
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss">
@import "./assets/styles/app.scss";
</style>
