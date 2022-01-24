<template>
  <div style="display: flex; justify-content: center">
    <input
      id="input"
      v-model="cdk"
      class="input"
      type="text"
      placeholder="输入邀请码"
    />
    <input id="btn" class="btn" type="button" value="提交" @click="login" />
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import "./utils/index";
const { ipcRenderer } = window.electron;
import getPcMsg from "../../utils/hardware.js";
import Http from "../../api/index.js";
const fs = window.fs.fs;
const dialog = window.tc.dialog;

export default defineComponent({
  name: "InvitationCode",
  setup() {
    const state = reactive({
      cdk: "",
      duration: 100,
      async login() {
        console.log("w", window);
        if (!state.cdk) {
          dialog.showErrorBox("", "输入邀请码");
          return;
        }
        const res = await Http.timingDetection(
          {
            password: state.cdk,
            pcAddress: getPcMsg.mac,
          },
          true
        );
        console.log("登录", res);
        if (res.code === 100000) {
          console.log("state.cdk", state.cdk);
          fs.writeFile("cdk.txt", state.cdk, "utf-8", (err) => {
            if (err) throw err;
          });
          ipcRenderer.send("invitation-code-finish", {
            isClose: true,
          });
        } else {
          dialog.showErrorBox("", res.msg);
        }
      },
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
