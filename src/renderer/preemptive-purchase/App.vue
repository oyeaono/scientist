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
import { realTimePrice, buy, sale } from "../../utils/price.js";
const { ipcRenderer } = window.electron;

export default defineComponent({
  name: "PreemptivePurchase",
  setup() {
    const state = reactive({
      windowTimer: null,
      logList: [],
      option: {},
      balance: "",
      taskError(err) {
        localStorage.setItem("errLog", JSON.stringify(err));
        state.logList.unshift("任务出错,设置正确的参数...");
        localStorage.setItem("preempt", JSON.stringify(state.logList));
        localStorage.setItem("startTransfer", JSON.stringify(false));
        localStorage.setItem("stopTransfer", JSON.stringify(true));

        ipcRenderer.send("preempt-echo", {
          data: toRaw(state.logList),
        });
      },
      async toSale() {
        try {
          await sale(state.option);

          state.logList.push("卖出成功...");

          localStorage.setItem("preempt", JSON.stringify(state.logList));

          ipcRenderer.send("preempt-echo", {
            data: toRaw(state.logList),
          });

          // 关闭窗口
          ipcRenderer.send("open-preempt", {
            isClose: false,
          });
        } catch (err) {
          state.taskError(err);
        }
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

          // 定时任务
          if (!state.option.mode) {
            let time = new Date().getTime();
            let flow = new Date(state.option.date).getTime();
            const start = flow - time;

            let timer = setTimeout(async () => {
              await buy(state.option);

              clearTimeout(timer);
              timer = null;
              state.logList.push("购买成功...");
              state.logList.push("任务完成...");
              localStorage.setItem("preempt", JSON.stringify(state.logList));

              state.windowTimer = setInterval(async () => {
                state.balance = (await realTimePrice(state.option)).value;

                if (state.balance >= state.balance * state.option.sellOut) {
                  clearTimeout(state.windowTimer);
                  state.windowTimer = null;
                  await state.toSale();
                }
              }, Number(state.option.poll) * 1000);
            }, start);
          } else {
            state.windowTimer = setInterval(async () => {
              // 流动性
              const mobility = (await realTimePrice(state.option)).coinValue;
              console.log("流动性", mobility);

              // 池子流动，任务启动
              if (mobility > 0) {
                // 购买成功清空定时器
                clearTimeout(state.windowTimer);
                state.windowTimer = null;
                await buy(state.option);
                state.logList.push("购买成功...");
                state.logList.push("任务完成...");
                localStorage.setItem("preempt", JSON.stringify(state.logList));

                state.windowTimer = setInterval(async () => {
                  state.balance = (await realTimePrice(state.option)).value;

                  if (state.balance >= state.balance * state.option.sellOut) {
                    clearTimeout(state.windowTimer);
                    state.windowTimer = null;
                    await state.toSale();
                  }
                }, Number(state.option.poll) * 1000);
              }
            }, Number(state.option.poll) * 1000);
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
