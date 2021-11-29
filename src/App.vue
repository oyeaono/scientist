<template>
  <router-view />
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted } from "vue";

const { ipcRenderer } = window.electron;
import { useStore } from "vuex";

export default defineComponent({
  name: "App",
  setup() {
    const state = reactive({});
    onMounted(() => {
      // localStorage.clear()
      const store = useStore();
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
