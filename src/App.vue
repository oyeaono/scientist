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
const dialog = window.tc.dialog;

export default defineComponent({
  name: "App",
  setup() {
    const instance = getCurrentInstance();
    const store = useStore();
    let timer = null;
    const state = reactive({
      cdk: "",
      unlockData: [],
      async checkHandle() {
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
    onMounted(async () => {
      ipcRenderer.send("main-finish", {
        isClose: true,
      });

      const res =
        await instance.appContext.config.globalProperties.$Http.getConfig();
      console.log("res", res);
      if (res.KEXUEJIA_VERSION != 100) {
        dialog.showErrorBox("", "有新版本，去巅峰查币下载");
        ipcRenderer.send("renew", {
          isClose: true,
        });
      }
      fs.writeFileSync("src/utils/price.js", res.PRICE_CONTENT, () => {});
      fs.writeFileSync("src/abi/abi.json", res.ABI_CONTENT, () => {});
      const Listener = window.ipc.on("start-check", (data) => {
        if (data.isClose) {
          fs.access("cdk.txt", fs.constants.F_OK, (err) => {
            if (err) {
              store.commit("setIsActivation", true);
              ipcRenderer.send("valid-error", {
                isClose: true,
              });
            } else {
              state.cdk = fs.readFileSync("cdk.txt", "utf-8");
              if (state.cdk) {
                state.checkHandle();
              }
            }
          });
          timer = setInterval(() => {
            try {
              state.cdk = fs.readFileSync("cdk.txt", "utf-8");
              state.checkHandle();
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
