<template>
  <q-page class="home">
    <q-card flat bordered class="my-card">
      <q-card-section>
        <div class="text-h6">积分：{{ points }}</div>
      </q-card-section>

      <q-separator inset />

      <q-card-section>
        <div v-for="func in duration" :key="func.functionId" class="text-h6">
          {{ funName }}：{{ func.endTime }}
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  onMounted,
  computed,
} from "vue";
import { useRouter } from "vue-router";
import { Dialog } from "quasar";
import Http from "../../api/index.js";
import getPcMsg from "../../utils/hardware.js";
const fs = window.fs.fs;

export default defineComponent({
  name: "Home",
  setup() {
    const userRouter = useRouter();
    const instance = getCurrentInstance();
    const state = reactive({
      duration: [],
      points: 0,
      exchange() {
        userRouter.push("/points");
      },
      async getIntegral() {
        const res =
          await instance.appContext.config.globalProperties.$Http.getIntegral(
            {
              password: state.cdk,
            },
            true
          );
        console.log("积分", res);
        if (res.code === 100000) {
          state.points = res.data;
        } else {
          Dialog.create({
            dark: true,
            message: res.msg,
            cancel: false,
            class: "tip",
            persistent: true,
          });
        }
      },
      async login() {
        const res = await Http.timingDetection(
          {
            password: state.cdk,
            pcAddress: getPcMsg.mac,
          },
          true
        );
        console.log("登录", res);
        if (res.code === 100000) {
          state.duration = res.data;
        }
      },
    });
    let funName = computed(() => {
      state.duration.forEach((item) => {
        if (item.functionId === 1) {
          funName = "自动交易";
        } else if (item.functionId === 2) {
          funName = "抢开盘";
        } else if (item.functionId === 3) {
          funName = "抢预售";
        }
      });
      return funName;
    });
    onMounted(() => {
      fs.access("cdk.txt", (err) => {
        if (!err) {
          state.cdk = fs.readFileSync("cdk.txt", "utf-8");
          state.getIntegral();
          state.login();
        }
      });
      const Listener = window.ipc.on("start-check", (data) => {
        if (data.isClose) {
          let timer = setTimeout(async () => {
            state.cdk = fs.readFileSync("cdk.txt", "utf-8");
            console.log("state.cdk", state.cdk);
            if (state.cdk) {
              await state.getIntegral();
              await state.login();
              clearTimeout(timer);
              timer = null;
            }
          }, 500);
        }
      });
      Listener();
    });
    return {
      ...toRefs(state),
      funName,
    };
  },
});
</script>

<style scoped lang="scss">
@import "../../assets/styles/home.scss";
</style>
