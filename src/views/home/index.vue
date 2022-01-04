<template>
  <q-page class="home">
    <q-card flat bordered class="my-card">
      <q-card-section>
        <div class="text-h6">积分：{{ duration }}</div>
      </q-card-section>

      <q-separator inset />

      <q-btn
        @click="exchange"
        color="black"
        glossy
        label="兑换"
        :disabled="duration > 0"
      />
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Home",
  setup() {
    const userRouter = useRouter();
    const state = reactive({
      duration: 100,
      exchange() {
        userRouter.push("/points");
      },
    });
    return {
      ...toRefs(state),
    };
  },
});
</script>

<style scoped lang="scss">
@import "../../assets/styles/home.scss";
</style>
