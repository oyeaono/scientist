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
          <q-btn flat label="取消" v-close-popup />
          <q-btn flat label="确定" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
const { shell } = window.electron;

export default defineComponent({
  name: "Points",
  setup() {
    const state = reactive({
      showExchange: false,
      points: 100,
      exchange() {
        state.showExchange = !state.showExchange;
      },
      toTG() {
        shell.openExternal("http://www.baidu.com");
      },
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
