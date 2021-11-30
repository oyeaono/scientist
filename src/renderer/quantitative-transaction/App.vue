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
import { realTimePrice, sale, buy, Run } from "../../utils/price.js";
const { ipcRenderer } = window.electron;

export default defineComponent({
  name: "QuantitativeTransaction",
  setup() {
    const state = reactive({
      windowTimer: null,
      logList: [],
      option: {},
      buyFlag: false,
      saleFlag: false,
      taskError(err) {
        localStorage.setItem("errLog", JSON.stringify(err));
        state.logList.unshift("任务出错,设置正确的参数...");
        localStorage.setItem("price", JSON.stringify(state.logList));
        localStorage.setItem("startTransfer", JSON.stringify(false));
        localStorage.setItem("stopTransfer", JSON.stringify(true));

        ipcRenderer.send("real-time-price", {
          data: toRaw(state.logList),
        });

        ipcRenderer.send("open-order", {
          isClose: false,
        });
      },
    });
    onMounted(() => {
      console.log("自动交易隐藏窗口", window);
      const Listener = window.ipc.on("QuantitativeTransaction", async () => {
        localStorage.removeItem("price");
        clearInterval(state.windowTimer);
        state.windowTimer = null;
        state.logList = [];
        state.logList.push("任务开始...");

        // 读取配置开始任务
        if (JSON.parse(localStorage.getItem("autoConfig"))) {
          state.option = JSON.parse(localStorage.getItem("autoConfig"));
          // 币名
          let unit;
          try {
            unit = (await new Run(state.option).name()).split(" ")[0];
          } catch (err) {
            state.taskError(err);
          }
          // 轮询任务
          state.windowTimer = setInterval(async () => {
            if (state.saleFlag) {
              state.saleFlag = false;
              state.buyFlag = false;
            }
            let price;
            try {
              price = (await realTimePrice(state.option)).value;
            } catch (err) {
              state.taskError(err);
            }
            console.log("price", price, typeof price);
            state.logList.unshift(`${price} BNB / ${unit}`);
            localStorage.setItem("price", JSON.stringify(state.logList));

            // 买入
            if (state.option.purchase && !state.option.sellOut) {
              // 循环
              if (state.option.loop) {
                if (price <= state.option.purchase) {
                  try {
                    await buy(state.option);
                    state.logList.unshift("买入成功...");
                    localStorage.setItem(
                      "price",
                      JSON.stringify(state.logList)
                    );
                  } catch (err) {
                    state.taskError(err);
                  }
                }
              } else {
                if (price <= state.option.purchase) {
                  try {
                    await buy(state.option);
                    state.logList.unshift("买入成功...");
                    state.logList.unshift("任务完成...");
                    localStorage.setItem(
                      "price",
                      JSON.stringify(state.logList)
                    );
                    ipcRenderer.send("open-order", {
                      isClose: false,
                    });
                  } catch (err) {
                    state.taskError(err);
                  }
                }
              }
            }

            // 卖出
            if (!state.option.purchase && state.option.sellOut) {
              // 循环
              if (state.option.loop) {
                if (price >= state.option.sellOut) {
                  try {
                    await sale(state.option);
                    state.logList.unshift("卖出成功...");
                    localStorage.setItem(
                      "price",
                      JSON.stringify(state.logList)
                    );
                  } catch (err) {
                    state.taskError(err);
                  }
                }
              } else {
                if (price >= state.option.sellOut) {
                  try {
                    await sale(state.option);
                    state.logList.unshift("卖出成功...");
                    state.logList.unshift("任务完成...");
                    localStorage.setItem(
                      "price",
                      JSON.stringify(state.logList)
                    );
                    ipcRenderer.send("open-order", {
                      isClose: false,
                    });
                  } catch (err) {
                    state.taskError(err);
                  }
                }
              }
            }

            // 买入卖出
            if (state.option.purchase && state.option.sellOut) {
              // 循环
              if (state.option.loop) {
                if (price <= state.option.purchase && !state.buyFlag) {
                  try {
                    await buy(state.option);
                    state.logList.unshift("买入成功...");
                    localStorage.setItem(
                      "price",
                      JSON.stringify(state.logList)
                    );
                    this.buyFlag = true;
                  } catch (err) {
                    state.taskError(err);
                  }
                }
                if (price >= state.option.sellOut && !state.saleFlag) {
                  try {
                    await sale(state.option);
                    state.logList.unshift("卖出成功...");
                    localStorage.setItem(
                      "price",
                      JSON.stringify(state.logList)
                    );
                    this.saleFlag = true;
                  } catch (err) {
                    state.taskError(err);
                  }
                }
              } else {
                if (price <= state.option.purchase && !state.buyFlag) {
                  try {
                    await buy(state.option);
                    state.logList.unshift("买入成功...");
                    localStorage.setItem(
                      "price",
                      JSON.stringify(state.logList)
                    );
                    this.buyFlag = true;
                  } catch (err) {
                    state.taskError(err);
                  }
                }
                if (price >= state.option.sellOut && !state.saleFlag) {
                  try {
                    await sale(state.option);
                    state.logList.unshift("卖出成功...");
                    state.logList.unshift("任务完成...");
                    localStorage.setItem(
                      "price",
                      JSON.stringify(state.logList)
                    );
                    this.saleFlag = true;
                    ipcRenderer.send("open-order", {
                      isClose: false,
                    });
                  } catch (err) {
                    state.taskError(err);
                  }
                }
              }
            }

            ipcRenderer.send("real-time-price", {
              data: toRaw(state.logList),
            });
          }, Number(state.option.poll) * 1000);
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
