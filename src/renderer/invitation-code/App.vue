<template>
  <div style="display: flex; justify-content: center">
    <input id="input" class="input" type="text" placeholder="输入邀请码" />
    <input id="btn" class="btn" type="button" value="提交" />
  </div>
</template>

<script>
import { defineComponent, onMounted } from "vue";
const { ipcRenderer } = window.electron;
import { useStore } from "vuex";
import "./utils/index";

export default defineComponent({
  name: "InvitationCode",
  mounted() {
    // localStorage.clear()
    const store = useStore();
    // 查询是否激活
    // store.commit("setIsActivation", false)
    console.log("x", ipcRenderer);
    ipcRenderer.send("invitation-code-finish", {
      isClose: true,
    });
  },
});
</script>

<style lang="scss">
@import "assets/app.scss";
</style>
