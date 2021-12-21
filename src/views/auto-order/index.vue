<template>
  <q-layout class="auto-order">
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
    <!--    <div class="search">-->
    <!--      <input id="input" class="input" type="text" placeholder="输入地址" />-->
    <!--      <input id="btn" class="btn" type="button" value="提交" />-->
    <!--    </div>-->

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
        <div class="item">
          <q-input v-model="poll" label="轮询时间(单位: 秒)" :dense="dense" />
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
            v-model="purchase"
            label="买入价格(单位: 币 / BNB)"
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
          <q-input
            v-model="sellOut"
            label="卖出价格(单位: 币 / BNB)"
            :dense="dense"
          />
          <!--          <svg-icon icon-class="setting-tip"></svg-icon>-->
        </div>
        <div class="item" style="width: 86%">
          <q-toggle v-model="loop" label="是否循环" />
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
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  getCurrentInstance,
} from "vue";
// import SvgIcon from "../../components/svg-icon/index.vue";
import { Dialog } from "quasar";
const { ipcRenderer } = window.electron;
import { Run } from "../../utils/price.js";
import { ethers } from "ethers";

export default defineComponent({
  name: "AutoOrder",
  // components: { SvgIcon },
  setup() {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      settingShow: false,
      startDisabled: false,
      stopDisabled: true,
      dense: false,
      platform: "",
      options: ["BSC"],
      contractAddress: "",
      poll: "",
      slipPoint: "",
      purchase: "",
      sellOut: "",
      amount: "",
      settingState: false,
      // privateKey: "0x98727c99453ad81e18db292c7442526f8d7d4f1c8d60b7a7014d0151a9055a26",
      // coinToken: "0xd41fdb03ba84762dd66a0af1a6c8540ff1ba5dfb",
      timer: null,
      logList: [],
      option: {},
      loop: false,
      batch: false,
      async saveSetting() {
        if (!state.platform) {
          state.emptyTip("选择公链");
          return;
        }
        if (!state.contractAddress) {
          state.emptyTip("填写合约地址");
          return;
        }
        if (!state.poll) {
          state.emptyTip("填写轮询时间");
          return;
        }
        if (state.amount && !state.slipPoint) {
          state.emptyTip("填写滑点");
          return;
        }
        if (state.sellOut && !state.slipPoint) {
          state.emptyTip("填写滑点");
          return;
        }
        if (state.purchase && !state.amount) {
          state.emptyTip("填写买入数量");
          return;
        }
        if (!state.purchase && state.amount) {
          state.emptyTip("填写买入价格");
          return;
        }
        state.selectNetWork();
        state.settingShow = false;
        state.settingState = true;
        state.option.platform = state.platform;
        state.option.contractAddress = state.contractAddress;
        state.option.slipPoint = state.slipPoint;
        state.option.purchase = state.purchase;
        state.option.amount = state.amount;
        state.option.sellOut = state.sellOut;
        state.option.loop = state.loop;
        state.option.batch = state.batch;
        state.option.privateKey = JSON.parse(
          localStorage.getItem("privateKey")
        ).privateKey;
        state.option.poll = Number(state.poll);
        localStorage.setItem("autoConfig", JSON.stringify(state.option));
        console.log("option", state.option);

        const run = new Run(state.option);
        let blockNum, blockList;
        console.log("run", run.provider);

        // 最新区块号
        await run.provider.getBlockNumber().then((blockNumber) => {
          blockNum = blockNumber;
          console.log("Current block number: " + blockNumber);
        });

        // gas费
        await run.provider.getGasPrice().then((gasPrice) => {
          const gasPriceString = gasPrice.toString();
          console.log("Current gas price: " + gasPriceString);
        });

        // 最新区块信息
        await run.provider.getBlock(blockNum).then((block) => {
          console.log("block", block);
          blockList = block.transactions;
        });

        // 最新区块交易信息，获取bsc的币种
        await run.provider.getTransaction(blockList[0]).then((transaction) => {
          console.log("x1", transaction);
          console.log(
            "x11",
            new ethers.utils.AbiCoder().decode(
              ["uint256", "address[]", "address", "uint256"],
              transaction.data
            )
          );
        });

        await run.provider
          .getTransactionReceipt(blockList[0])
          .then((receipt) => {
            console.log("x2", receipt);
          });
      },
      // 打开配置
      openSetting() {
        state.settingShow = true;
        state.showSetting();
      },
      // 启动自动交易
      startAuto() {
        console.log("state.settingState", state.settingState);
        if (!state.settingState) {
          state.emptyTip("先配置参数");
          return;
        }
        state.startDisabled = true;
        state.stopDisabled = false;

        localStorage.setItem("startTransfer", JSON.stringify(true));
        localStorage.setItem("stopTransfer", JSON.stringify(false));

        ipcRenderer.send("open-order", {
          isClose: true,
        });
      },
      // 停止自动交易
      stopAuto() {
        state.startDisabled = false;
        state.stopDisabled = true;

        state.logList.unshift("任务结束...");
        localStorage.setItem("price", JSON.stringify(state.logList));

        ipcRenderer.send("open-order", {
          isClose: false,
        });
        localStorage.setItem("startTransfer", JSON.stringify(false));
        localStorage.setItem("stopTransfer", JSON.stringify(true));
      },
      // 清空日志
      clearLog() {
        state.logList = [];
        localStorage.removeItem("price");
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
        if (JSON.parse(localStorage.getItem("autoConfig"))) {
          state.settingState = true;
          state.option = JSON.parse(localStorage.getItem("autoConfig"));
          state.platform = state.option.platform;
          state.contractAddress = state.option.contractAddress;
          state.poll = state.option.poll;
          state.slipPoint = state.option.slipPoint;
          state.purchase = state.option.purchase;
          state.amount = state.option.amount;
          state.loop = state.option.loop;
          state.sellOut = state.option.sellOut;
        }
      },
    });
    onMounted(async () => {
      console.log("window", window);

      const url = `https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress=0xe8Df1A7Fc28E97f55c2642a587281207203760c3&apikey=RBR5Q6JPESKIME2FRNCPQ13YJRUX1WW5UJ`;
      // const url1 = `https://api.bscscan.com/api?module=contract&action=getabi&address=0xdA62CD97BaeCEff21232e26f3Fc0Db76dCd34001&apikey=RBR5Q6JPESKIME2FRNCPQ13YJRUX1WW5UJ`;
      // const url2 = `https://api.bscscan.com/api?module=contract&action=getsourcecode&address=0xe8Df1A7Fc28E97f55c2642a587281207203760c3&apikey=RBR5Q6JPESKIME2FRNCPQ13YJRUX1WW5UJ`;
      // const url3 = `https://api.bscscan.com/api?module=stats&action=tokenCsupply&contractaddress=0xe8Df1A7Fc28E97f55c2642a587281207203760c3&apikey=RBR5Q6JPESKIME2FRNCPQ13YJRUX1WW5UJ`;
      const url4 = `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0xe8Df1A7Fc28E97f55c2642a587281207203760c3s&address=0x89e73303049ee32919903c09e8de5629b84f59eb&tag=latest&apikey=YourApiKeyToken`;

      proxy.$axios.post(url).then((res) => {
        console.log("总量", res, res.data.result / 1e18);
      });
      proxy.$axios.post(url).then((res) => {
        console.log("循环供应量", res, res.data.result / 1e18);
      });
      proxy.$axios.post(url4).then((res) => {
        console.log("钱包币余额", res, res.data.result / 1e18);
      });
      // proxy.$axios.post(url1).then((res) => {
      //   console.log("合约ABI", res, res.data.result);
      // });
      // proxy.$axios.post(url2).then((res) => {
      //   console.log("合约源码", res, res.data.result[0].SourceCode);
      // });

      const Listener = window.ipc.on("echo-price", (data) => {
        state.logList = data;
      });
      Listener();

      const Listener1 = window.ipc.on("resetBtn", (data) => {
        if (data) {
          state.startDisabled = false;
          state.stopDisabled = true;
        }
      });
      Listener1();

      // 回到自动交易
      if (JSON.parse(localStorage.getItem("price"))) {
        state.logList = JSON.parse(localStorage.getItem("price"));
      }
      if (JSON.parse(localStorage.getItem("autoConfig"))) {
        state.settingState = true;
      }
      const startDisabled = JSON.parse(localStorage.getItem("startTransfer"));
      const stopDisabled = JSON.parse(localStorage.getItem("stopTransfer"));
      state.startDisabled = startDisabled ? startDisabled : false;
      state.stopDisabled = stopDisabled ? stopDisabled : true;
    });
    return {
      ...toRefs(state),
    };
  },
});
</script>

<style scoped lang="sass">
@import "../../assets/styles/auto-order.scss"
</style>
