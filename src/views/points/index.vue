<template>
  <q-layout class="points">
    <q-banner glossy class="bg-orange text-white"> 群内聊天获取积分 </q-banner>
    <q-banner glossy class="bg-orange text-white">
      积分每日统计，次日更新
    </q-banner>
    <q-card flat bordered class="my-card">
      <q-card-section>
        <div class="text-h6">积分：{{ points }}</div>
      </q-card-section>

      <q-separator inset />

      <q-select
        label="兑换功能"
        transition-show="flip-up"
        transition-hide="flip-down"
        v-model="func"
        :options="options"
        class="select-func"
        @popup-show="showFunc"
      />

      <q-btn
        @click="exchange"
        color="black"
        glossy
        label="兑换"
        v-if="points > 0"
      />
      <q-btn @click="toTG" color="black" glossy label="获取积分" v-else />
    </q-card>

    <q-dialog v-model="showExchange" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">兑换3天使用时长</div>
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
import { Dialog } from "quasar";
const { shell } = window.electron;
const fs = window.fs.fs;

export default defineComponent({
  name: "Points",
  setup() {
    const instance = getCurrentInstance();
    const state = reactive({
      showExchange: false,
      points: 0,
      func: "",
      cdk: "",
      options: ["", "", ""],
      funcData: [],
      id: 0,
      exchange() {
        if (!state.func) {
          state.emptyTip("选择功能");
          return;
        }
        if (state.func.indexOf("自动挂单") > -1) {
          state.id = state.funcData[0].id;
        }
        if (state.func.indexOf("抢开盘") > -1) {
          state.id = state.funcData[1].id;
        }
        if (state.func.indexOf("抢预售") > -1) {
          state.id = state.funcData[2].id;
        }
        state.showExchange = true;
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
      toTG() {
        shell.openExternal("http://www.baidu.com");
      },
      async yes() {
        const res =
          await instance.appContext.config.globalProperties.$Http.integralConvert(
            {
              password: state.cdk,
              packageId: state.id,
            },
            true
          );
        console.log("确定", res);
        state.showExchange = false;
        if (res.code === 100000) {
          state.emptyTip("兑换成功");
        } else {
          state.emptyTip(res.msg);
        }
      },
      no() {
        console.log("取消");
      },
      async showFunc() {
        const res =
          await instance.appContext.config.globalProperties.$Http.setMealList();
        console.log("套餐", res);
        if (res.code === 100000) {
          state.funcData = res.data;
          state.options = res.data.map(
            (item) =>
              item.name + "\u3000\u3000\u3000\u3000" + `(${item.score}分)`
          );
        } else {
          state.emptyTip(res.msg);
        }
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
          state.emptyTip(res.msg);
        }
      },
    });
    onMounted(async () => {
      state.cdk = fs.readFileSync("cdk.txt", "utf-8");
      await state.getIntegral();
    });
    return {
      ...toRefs(state),
    };
  },
});
</script>

<style scoped lang="scss">
@import "../../assets/styles/points.scss";
</style>
