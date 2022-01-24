<template>
  <q-item clickable tag="a" :active="false" :disable="disabled" :to="link">
    <!--    <q-item-section-->
    <!--      v-if="icon"-->
    <!--      avatar-->
    <!--    >-->
    <!--      <q-icon :name="icon" />-->
    <!--    </q-item-section>-->
    <svg-icon v-if="icon" :icon-class="icon"></svg-icon>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <!--      <q-item-label caption>-->
      <!--        {{ caption }}-->
      <!--      </q-item-label>-->
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import SvgIcon from "./svg-icon/index.vue";

export default defineComponent({
  name: "EssentialLink",
  components: { SvgIcon },
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "#",
    },

    icon: {
      type: String,
      default: "",
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    tabindex: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const state = reactive({
      path: "",
    });
    return {
      ...toRefs(state),
    };
  },
});
</script>
<style scoped lang="scss">
@import "../assets/styles/essential.scss";
</style>
