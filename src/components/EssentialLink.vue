<template>
  <q-item clickable tag="a" :disable="isActivation" @click="enterPath(link)">
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
import { defineComponent, computed, reactive, toRefs } from "vue";
import { useStore } from "vuex";
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
  },
  setup() {
    const store = useStore();
    const state = reactive({
      enterPath(link) {
        this.$router.push({ path: link });
      },
    });

    return {
      isActivation: computed(() => store.state.app.isActivation),
      ...toRefs(state),
    };
  },
});
</script>
<style scoped lang="css">
.q-item__label {
  text-align: center;
}
</style>
