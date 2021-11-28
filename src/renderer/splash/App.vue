<template>
  <div class="sk-circle-bounce">
    <div class="sk-child sk-circle-1"></div>
    <div class="sk-child sk-circle-2"></div>
    <div class="sk-child sk-circle-3"></div>
    <div class="sk-child sk-circle-4"></div>
    <div class="sk-child sk-circle-5"></div>
    <div class="sk-child sk-circle-6"></div>
    <div class="sk-child sk-circle-7"></div>
    <div class="sk-child sk-circle-8"></div>
    <div class="sk-child sk-circle-9"></div>
    <div class="sk-child sk-circle-10"></div>
    <div class="sk-child sk-circle-11"></div>
    <div class="sk-child sk-circle-12"></div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from "vue";
const { ipcRenderer } = window.electron;
import { useStore } from "vuex";

export default defineComponent({
  name: "Splash",
  mounted() {
    // localStorage.clear()
    const store = useStore();
    // 查询是否激活
    // store.commit("setIsActivation", false)
    console.log("x", ipcRenderer);
    ipcRenderer.send("splash-finish", {
      isClose: true,
    });
  },
});
</script>

<style lang="scss">
@import "assets/app.scss";
</style>
