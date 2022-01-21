<template>
  <q-layout class="unlock">
    <q-card flat bordered class="my-card">
      <q-btn @click="unlock" color="black" glossy label="解锁" />
    </q-card>

    <q-dialog v-model="showUnlock" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">与该电脑解除绑定</div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="取消" v-close-popup @click="no" />
          <q-btn flat label="确定" v-close-popup @click="yes" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  onMounted,
} from "vue";
const fs = window.fs.fs;
import getPcMsg from "../../utils/hardware.js";
import { Dialog } from "quasar";

export default defineComponent({
  name: "Unlock",
  setup() {
    const instance = getCurrentInstance();
    const state = reactive({
      showUnlock: false,
      cdk: "",
      unlock() {
        state.showUnlock = true;
      },
      async yes() {
        const res =
          await instance.appContext.config.globalProperties.$Http.deviceUnlock(
            {
              password: state.cdk,
              pcAddress: getPcMsg.mac,
            },
            true
          );
        console.log("解锁", res);
        if (res.code === 100000) {
          Dialog.create({
            dark: true,
            message: "已解锁",
            cancel: false,
            class: "tip",
            persistent: true,
          });
        }
      },
      no() {},
    });
    onMounted(async () => {
      state.cdk = fs.readFileSync("cdk.txt", "utf-8");
    });
    return {
      ...toRefs(state),
    };
  },
});
</script>

<style scoped lang="scss">
@import "../../assets/styles/unlock.scss";
</style>
