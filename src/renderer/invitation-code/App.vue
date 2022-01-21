<template>
  <div style="display: flex; justify-content: center">
    <input id="input" class="input" type="text" placeholder="输入邀请码" />
    <input id="btn" class="btn" type="button" value="提交" @click="login" />
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from "vue";
const { ipcRenderer } = window.electron;
import "./utils/index";
import getPcMsg from "../../utils/hardware.js";
import Http from "../../api/index.js";
import { useStore } from "vuex";
import { Dialog } from "quasar";

export default defineComponent({
  name: "InvitationCode",
  setup() {
    const store = useStore();
    const state = reactive({
      duration: 100,
      async login() {
        const res = await Http.deviceBinding({
          password: "xx",
          pcAddress: getPcMsg,
        });
        if (res) {
          store.commit("setIsActivation", false);
        } else {
          Dialog.create({
            dark: true,
            message: "激活码错误",
            cancel: false,
            class: "tip",
            persistent: true,
          });
        }
        console.log("登录", res);
      },
    });
    onMounted(async () => {
      ipcRenderer.send("invitation-code-finish", {
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
@import "./assets/app.scss";
</style>
