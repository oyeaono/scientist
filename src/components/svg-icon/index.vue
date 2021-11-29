<template>
  <svg :class="svgClass" aria-hidden="true">
    <title v-text="title" />
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
import { defineComponent } from "vue";
import "../../assets/svg/svg.js"; // 字体图标

export default defineComponent({
  name: "SvgIcon",
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`;
    },
    svgClass() {
      if (this.className) {
        return "svg-icon " + this.className;
      } else {
        return "svg-icon";
      }
    },
  },
});
</script>

<style scoped lang="scss">
@import "../../assets/styles/icon.scss";
</style>
