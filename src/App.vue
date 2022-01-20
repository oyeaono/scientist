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

export default defineComponent({
  name: "App",
  setup() {
    const instance = getCurrentInstance();
    const store = useStore();
    const state = reactive({
      async timingDetection() {
        const res =
          await instance.appContext.config.globalProperties.$Http.timingDetection(
            {
              password: "xx",
              pcAddress: getPcMsg,
            }
          );
        if (res) {
          store.commit("setIsActivation", false);
        }
      },
    });
    onMounted(async () => {
      // localStorage.clear()
      setInterval(() => {
        state.timingDetection();
      }, 300000);
      console.log("store", store);
      // 查询是否激活
      // store.commit("setIsActivation", false)
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
