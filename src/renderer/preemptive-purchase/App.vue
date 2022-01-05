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
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  toRaw,
  watch,
} from "vue";
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
    watch(
      () => state.balance,
      (n) => {
        // 钱包币余额大于0,轮询实时价格
        if (n > 0) {
          let timer = setTimeout(async () => {
            let salePrice = await realTimePrice(state.option).value;
            if (salePrice >= state.balance * state.option.sellOut) {
              await state.toSale();
            }
            clearTimeout(timer);
            timer = null;
          }, 1000);
        }
      }
    );
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
              try {
                const isBuy = await buy(state.option);

                if (isBuy) {
                  state.logList.push("购买成功...");
                  state.logList.push("任务完成...");
                  localStorage.setItem(
                    "preempt",
                    JSON.stringify(state.logList)
                  );

                  state.balance = await realTimePrice(state.option).value;

                  // 购买成功清空定时器
                  clearTimeout(timer);
                  timer = null;
                }
              } catch (err) {
                state.taskError(err);
              }
            }, start);
          } else {
            state.windowTimer = setInterval(async () => {
              // 流动性
              const mobility = (await realTimePrice(state.option)).coinValue;

              // 池子流动，任务启动
              if (mobility > 0) {
                try {
                  const isBuy = await buy(state.option);

                  if (isBuy) {
                    state.logList.push("购买成功...");
                    state.logList.push("任务完成...");
                    localStorage.setItem(
                      "preempt",
                      JSON.stringify(state.logList)
                    );

                    state.balance = await realTimePrice(state.option).value;

                    // 购买成功清空定时器
                    clearTimeout(state.windowTimer);
                    state.windowTimer = null;
                  }
                } catch (err) {
                  state.taskError(err);
                }
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
