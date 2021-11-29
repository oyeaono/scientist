<template>
  <q-page class="check-coin">
    <div class="search">
      <input id="input" class="input" type="text" placeholder="输入地址" />
      <input id="btn" class="btn" type="button" value="提交" />
    </div>
  </q-page>
</template>

<script>
export default {
  name: "CheckCoin",
};
</script>

<style scoped lang="sass">
@import "../../assets/styles/check-coin.scss"
</style>
