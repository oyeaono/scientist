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
import { realTimePrice, buy } from "../../utils/price.js";
const { ipcRenderer } = window.electron;

export default defineComponent({
  name: "PreemptivePurchase",
  setup() {
    const state = reactive({
      windowTimer: null,
      logList: [],
      option: {},
      taskError(err) {
        localStorage.setItem("errLog", JSON.stringify(err));
        state.logList.unshift("任务出错,设置正确的参数...");
        localStorage.setItem("preempt", JSON.stringify(state.logList));
        localStorage.setItem("startTransfer", JSON.stringify(false));
        localStorage.setItem("stopTransfer", JSON.stringify(true));

        ipcRenderer.send("preempt-echo", {
          data: toRaw(state.logList),
        });

        ipcRenderer.send("open-preempt", {
          isClose: false,
        });
      },
    });
    onMounted(() => {
      console.log("抢开盘隐藏窗口");
      const Listener = window.ipc.on("PreemptivePurchase", async () => {
        localStorage.removeItem("preempt");
        clearInterval(state.windowTimer);
        state.windowTimer = null;
        state.logList = [];
        state.logList.push("任务开始...");
        localStorage.setItem("preempt", JSON.stringify(state.logList));

        ipcRenderer.send("preempt-echo", {
          data: toRaw(state.logList),
        });

        // 读取配置开始任务
        if (JSON.parse(localStorage.getItem("preemptivePurchaseConfig"))) {
          state.option = JSON.parse(
            localStorage.getItem("preemptivePurchaseConfig")
          );

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
                localStorage.setItem("preempt", JSON.stringify(state.logList));

                // 关闭窗口
                ipcRenderer.send("open-preempt", {
                  isClose: false,
                });

                ipcRenderer.send("preempt-echo", {
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
