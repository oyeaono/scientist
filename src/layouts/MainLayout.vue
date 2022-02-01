<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <span style="margin-left: 10%; font-size: 18px">巅峰科学家</span>
          <q-btn
            flat
            dense
            round
            class="shut-down"
            aria-label="Menu"
            @click="shutDown"
          >
            <svg-icon icon-class="shut-down"></svg-icon>
          </q-btn>
          <q-btn
            @click="openConnectWallet"
            label="设置私钥"
            outline
            color="white"
            glossy
            class="open"
          />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <EssentialLink
          v-for="(link, index) in linksList"
          :key="link.title"
          v-bind="link"
          :tabindex="index"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-dialog
      v-model="walletShow"
      prevent-close
      no-esc-dismiss
      no-backdrop-dismiss
      persistent
      transition-show="flip-down"
    >
      <div class="connectWallet">
        <div class="title">设置钱包私钥后启用功能</div>
        <div class="item">
          <q-input
            v-model="privateKey"
            type="password"
            label="钱包私钥"
            :dense="dense"
          />
        </div>
        <q-btn
          class="save"
          label="保存"
          glossy
          color="primary"
          @click="saveHandle"
        />
      </div>
    </q-dialog>
  </q-layout>
</template>

<script>
import EssentialLink from "../components/EssentialLink.vue";
import { Dialog } from "quasar";
import { defineComponent, reactive, toRefs, onMounted } from "vue";
import { useStore } from "vuex";
import SvgIcon from "../components/svg-icon/index.vue";
const { ipcRenderer } = window.electron;
const fs = window.fs.fs;

export default defineComponent({
  name: "MainLayout",

  components: {
    SvgIcon,
    EssentialLink,
  },

  setup() {
    const store = useStore();
    const state = reactive({
      privateKey: "",
      dense: false,
      leftDrawerOpen: false,
      walletShow: false,
      tgUserName: "",
      tgID: "",
      linksList: [],
      toggleLeftDrawer() {
        // 查询是否激活，激活功能解锁
        state.leftDrawerOpen = !state.leftDrawerOpen;
      },
      openConnectWallet() {
        state.walletShow = true;
        state.privateKey = store.state.app.hasPrivateKey;
        console.log("state.privateKey", state.privateKey);
      },
      saveHandle() {
        if (!state.privateKey) {
          state.emptyTip("私钥不能为空");
          return;
        }
        state.walletShow = false;
        store.commit("setHasPrivateKey", state.privateKey);
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
      shutDown() {
        localStorage.clear();
        fs.writeFileSync("src/utils/price.js", "", () => {});
        fs.writeFileSync("src/abi/abi.json", "", () => {});

        ipcRenderer.send("shut-down", {
          isClose: true,
        });
      },
    });
    onMounted(() => {
      state.linksList = useStore().state.app.linksList;
    });
    return {
      ...toRefs(state),
    };
  },
});
</script>
<style scoped lang="scss">
@import "../assets/styles/layout.scss";
</style>
