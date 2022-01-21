<template>
  <q-layout class="market-open">
    <div class="left">
      <q-btn
        label="配置"
        glossy
        color="primary"
        class="setting"
        @click="openSetting"
      />
      <q-btn
        label="启动"
        glossy
        color="positive"
        class="start"
        :disable="startDisabled"
        @click="startAuto"
      />
      <q-btn
        label="停止"
        glossy
        color="warning"
        class="stop"
        :disable="stopDisabled"
        @click="stopAuto"
      />
      <q-btn
        label="清空"
        glossy
        color="deep-orange"
        class="stop"
        :disable="logList.length === 0"
        @click="clearLog"
      />
    </div>
    <div class="right">
      <q-card class="transaction-msg">
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
    </div>

    <q-dialog
      v-model="settingShow"
      prevent-close
      no-esc-dismiss
      no-backdrop-dismiss
      persistent
      transition-show="flip-down"
    >
      <div class="dialogBox">
        <div class="item">
          <q-select
            label="选择公链"
            transition-show="flip-up"
            transition-hide="flip-down"
            v-model="platform"
            :options="options"
          />
          <!--          <svg-icon icon-class="setting-tip"></svg-icon>-->
        </div>
        <div class="item">
          <q-input v-model="contractAddress" label="合约地址" :dense="dense" />
          <!--          <svg-icon icon-class="setting-tip"></svg-icon>-->
        </div>
        <div class="item" v-if="mode">
          <q-input v-model="poll" label="轮询时间(单位: 秒)" :dense="dense" />
          <!--          <svg-icon icon-class="setting-tip"></svg-icon>-->
        </div>
        <div class="item" v-else>
          <q-input
            v-model="date"
            label="开盘时间"
            :dense="dense"
            :shadow-text="timeTip"
          />
          <!--          <svg-icon icon-class="setting-tip"></svg-icon>-->
        </div>
        <div class="item">
          <q-input
            v-model="slipPoint"
            label="滑点比例(单位: %)"
            :dense="dense"
          />
          <!--          <svg-icon icon-class="setting-tip"></svg-icon>-->
        </div>
        <div class="item">
          <q-input
            v-model="amount"
            label="买入数量(单位: BNB)"
            :dense="dense"
          />
          <!--          <svg-icon icon-class="setting-tip"></svg-icon>-->
        </div>
        <div class="item">
          <q-input v-model="sellOut" label="卖出倍数" :dense="dense" />
          <!--          <svg-icon icon-class="setting-tip"></svg-icon>-->
        </div>
        <div class="item">
          <q-toggle v-model="mode" color="black" label="轮询" left-label />
        </div>
        <q-btn
          label="保存"
          glossy
          color="primary"
          class="save"
          @click="saveSetting"
        />
      </div>
    </q-dialog>
  </q-layout>
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted, watch } from "vue";
import { Dialog } from "quasar";
const { ipcRenderer } = window.electron;

export default defineComponent({
  name: "MarketOpen",
  setup() {
    const state = reactive({
      startDisabled: false,
      stopDisabled: true,
      logList: [],
      settingShow: false,
      platform: "",
      options: ["BSC"],
      dense: false,
      contractAddress: "",
      poll: "",
      slipPoint: "",
      amount: "",
      sellOut: "",
      option: {},
      batch: true,
      date: "",
      timeTip: "2022/1/1 23:00",
      mode: false,
      openSetting() {
        state.settingShow = true;
        state.showSetting();
      },
      startAuto() {
        if (!state.settingState) {
          state.emptyTip("先配置参数");
          return;
        }
        state.startDisabled = true;
        state.stopDisabled = false;

        localStorage.setItem("startPreempt", JSON.stringify(true));
        localStorage.setItem("stopPreempt", JSON.stringify(false));

        ipcRenderer.send("open-preempt", {
          isClose: true,
        });
      },
      stopAuto() {
        state.startDisabled = false;
        state.stopDisabled = true;

        state.logList.unshift("任务结束...");
        localStorage.setItem("preempt", JSON.stringify(state.logList));

        ipcRenderer.send("open-preempt", {
          isClose: false,
        });
        localStorage.setItem("startPreempt", JSON.stringify(false));
        localStorage.setItem("stopPreempt", JSON.stringify(true));
      },
      clearLog() {
        state.logList = [];
        localStorage.removeItem("preempt");
      },
      saveSetting() {
        if (!state.platform) {
          state.emptyTip("选择公链");
          return;
        }
        if (!state.contractAddress) {
          state.emptyTip("填写合约地址");
          return;
        }
        if (!state.slipPoint) {
          state.emptyTip("填写滑点");
          return;
        }
        if (!state.amount) {
          state.emptyTip("填写买入数量");
          return;
        }
        if (state.mode) {
          if (!state.poll) {
            state.emptyTip("填写轮询时间");
            return;
          }
        } else {
          if (!state.date) {
            state.emptyTip("填写开盘时间");
            return;
          }
        }
        state.selectNetWork();
        state.settingShow = false;
        state.settingState = true;
        state.option.platform = state.platform;
        state.option.contractAddress = state.contractAddress;
        state.option.slipPoint = state.slipPoint;
        state.option.amount = state.amount;
        state.option.sellOut = state.sellOut;
        state.option.batch = state.batch;
        state.option.date = state.date;
        state.option.mode = state.mode;
        state.option.privateKey = JSON.parse(
          localStorage.getItem("privateKey")
        ).privateKey;
        state.option.poll = Number(state.poll);
        localStorage.setItem(
          "preemptivePurchaseConfig",
          JSON.stringify(state.option)
        );
      },
      emptyTip(msg) {
        Dialog.create({
          dark: true,
          message: msg,
          cancel: false,
          class: "tip",
          persistent: true,
        });
      },
      selectNetWork() {
        if (state.platform === "BSC") {
          state.option.PROVIDER_URL = process.env.VUE_APP_BSC_URL;
          state.option.PROVIDER_NETWORK = {
            name: process.env.VUE_APP_BSC_NETWORK_NAME,
            chainId: Number(process.env.VUE_APP_BSC_NETWORK_CHAINID),
          };
        } else if (state.platform === "ETH") {
          state.option.PROVIDER_URL = process.env.VUE_APP_BSC_URL;
          state.option.PROVIDER_NETWORK = {
            name: process.env.VUE_APP_BSC_NETWORK_NAME,
            chainId: Number(process.env.VUE_APP_BSC_NETWORK_CHAINID),
          };
        } else {
          state.option.PROVIDER_URL = process.env.VUE_APP_HECO_URL;
          state.option.PROVIDER_NETWORK = {
            name: process.env.VUE_APP_HECO_NETWORK_NAME,
            chainId: Number(process.env.VUE_APP_HECO_NETWORK_CHAINID),
          };
        }
      },
      showSetting() {
        if (JSON.parse(localStorage.getItem("preemptivePurchaseConfig"))) {
          state.settingState = true;
          state.option = JSON.parse(
            localStorage.getItem("preemptivePurchaseConfig")
          );
          state.platform = state.option.platform;
          state.contractAddress = state.option.contractAddress;
          state.poll = state.option.poll;
          state.slipPoint = state.option.slipPoint;
          state.amount = state.option.amount;
          state.loop = state.option.loop;
          state.sellOut = state.option.sellOut;
        }
      },
    });
    watch(
      () => state.date,
      (n) => {
        if (n) {
          state.timeTip = "";
        } else {
          state.timeTip = "2022/1/1 23:00";
        }
      }
    );
    onMounted(() => {
      console.log("抢开盘");

      if (JSON.parse(localStorage.getItem("preemptivePurchaseConfig"))) {
        state.settingState = true;
      }
      if (JSON.parse(localStorage.getItem("preempt"))) {
        state.logList = JSON.parse(localStorage.getItem("preempt"));
      }
      const startDisabled = JSON.parse(localStorage.getItem("startPreempt"));
      const stopDisabled = JSON.parse(localStorage.getItem("stopPreempt"));
      state.startDisabled = startDisabled ? startDisabled : false;
      state.stopDisabled = stopDisabled ? stopDisabled : true;

      const Listener = window.ipc.on("echo-preempt", (data) => {
        state.logList = data;
      });
      Listener();

      const Listener1 = window.ipc.on("resetMarketBtn", (data) => {
        if (data) {
          state.startDisabled = false;
          state.stopDisabled = true;
        }
      });
      Listener1();
    });
    return {
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss">
@import "../../assets/styles/market-open.scss";
::v-deep .scroll {
  max-height: initial !important;
  top: 25px !important;
  left: 257px !important;
}
</style>
