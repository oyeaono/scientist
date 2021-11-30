<template>
  <q-fab glossy color="purple" icon="keyboard_arrow_up" direction="down">
    <q-fab-action color="amber" title="关闭程序" @click="closeWin" icon="">
      <svg-icon
        icon-class="shut-down"
        style="font-size: 20px"
        title="关闭程序"
      ></svg-icon>
    </q-fab-action>
    <q-fab-action color="secondary" title="窗口最大化" @click="maxWin" icon="">
      <svg-icon
        icon-class="maximize"
        style="font-size: 16px"
        title="窗口最大化"
      ></svg-icon>
    </q-fab-action>
  </q-fab>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import SvgIcon from "../../components/svg-icon/index.vue";
const { ipcRenderer } = window.electron;

export default defineComponent({
  name: "SphericalMenu",
  components: { SvgIcon },
  setup() {
    const state = reactive({
      closeWin() {
        ipcRenderer.send("close-win", {
          isClose: true,
        });
      },
      maxWin() {
        ipcRenderer.send("maximize", {
          isClose: true,
        });
      },
    });
    return {
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss">
@import "./assets/app.scss";
</style>
