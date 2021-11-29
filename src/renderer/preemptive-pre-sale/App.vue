<template>
  <q-card class="hide-transfer">
    <q-card-section>
      <q-banner
        inline-actions
        rounded
        class="bg-white text-black"
        v-for="item in logList"
        :key="item"
      >
        {{ item }}
      </q-banner>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted, toRaw } from "vue";
import {
  realTimePrice,
  coinBalance,
  sale,
  buy,
  Run,
} from "../../utils/price.js";
const { ipcRenderer } = window.electron;

export default defineComponent({
  name: "PreemptivePreSale",
  setup() {
    const state = reactive({
      windowTimer: null,
      logList: [],
      option: {},
      taskError(err) {
        localStorage.setItem("errLog", JSON.stringify(err));
        state.logList.unshift("任务出错,设置正确的参数...");
        localStorage.setItem("preSale", JSON.stringify(state.logList));

        ipcRenderer.send("pre-sale-echo", {
          data: toRaw(state.logList),
        });

        ipcRenderer.send("open-pre-sale", {
          isClose: false,
        });
      },
    });
    onMounted(() => {
      console.log("抢预售隐藏窗口");
      const Listener = window.ipc.on("PreSale", async () => {
        localStorage.removeItem("preSale");
        clearInterval(state.windowTimer);
        state.windowTimer = null;
        state.logList = [];
        state.logList.push("任务开始...");
        localStorage.setItem("preSale", JSON.stringify(state.logList));

        // 读取配置开始任务
        if (JSON.parse(localStorage.getItem("preSaleConfig"))) {
          state.option = JSON.parse(localStorage.getItem("preSaleConfig"));

          // 流动性
          let mobility;
          try {
            mobility = (await realTimePrice(state.option)).coinValue;
          } catch (err) {
            state.taskError(err);
          }

          // 池子流动，任务启动
          if (mobility > 0) {
            try {
              const isBuy = await buy(state.option);

              if (isBuy) {
                state.logList.push("购买成功...");
                state.logList.push("任务完成...");
                localStorage.setItem("preSale", JSON.stringify(state.logList));

                // 关闭窗口
                ipcRenderer.send("open-pre-sale", {
                  isClose: false,
                });

                ipcRenderer.send("pre-sale-echo", {
                  data: toRaw(state.logList),
                });
              }
            } catch (err) {
              state.taskError(err);
            }
          }
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

<style scoped lang="sass">
@import "./assets/app.scss"
</style>
