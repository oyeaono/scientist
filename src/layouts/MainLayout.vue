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
          <span style="margin-left: 10%">scientist tool</span>
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
            label="开启功能"
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
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
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
        <div class="title">设置私钥激活功能</div>
        <div class="item">
          <q-input v-model="tgUserName" label="电报用户名" :dense="dense" />
        </div>
        <div class="item">
          <q-input v-model="tgID" label="电报ID" :dense="dense" />
        </div>
        <div class="item">
          <q-input
            v-model="privateKey"
            type="password"
            label="钱包私钥"
            :dense="dense"
          />
        </div>
        <div class="item">
          <q-input
            v-model="password"
            type="password"
            label="钱包密码"
            :dense="dense"
          />
        </div>
        <div class="item">
          <q-input
            v-model="confirmPassword"
            type="password"
            label="确认密码"
            :dense="dense"
          />
        </div>
        <div class="item">填写信息以激活程序功能</div>
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

const linksList = [
  {
    title: "主界面",
    caption: "quasar.dev",
    icon: "",
    link: "/",
  },
  {
    title: "自动挂单",
    caption: "quasar.dev",
    icon: "",
    link: "/auto-order",
  },
  {
    title: "抢开盘",
    caption: "quasar.dev",
    icon: "",
    link: "/market-open",
  },
  {
    title: "抢预售",
    caption: "quasar.dev",
    icon: "",
    link: "/pre-sale",
  },
  {
    title: "积分兑换",
    caption: "quasar.dev",
    icon: "",
    link: "/points",
  },
  {
    title: "解锁设备",
    caption: "quasar.dev",
    icon: "",
    link: "/unlock",
  },
];

import { defineComponent, reactive, toRefs, onMounted } from "vue";
// import { useStore } from "vuex";
import SvgIcon from "../components/svg-icon/index.vue";
const { ipcRenderer } = window.electron;

export default defineComponent({
  name: "MainLayout",

  components: {
    SvgIcon,
    EssentialLink,
  },

  setup() {
    // const store = useStore();
    const state = reactive({
      privateKey: "",
      password: "",
      confirmPassword: "",
      dense: false,
      leftDrawerOpen: false,
      walletShow: false,
      tgUserName: "",
      tgID: "",
      toggleLeftDrawer() {
        // 查询是否激活，激活功能解锁
        state.leftDrawerOpen = !state.leftDrawerOpen;
      },
      openConnectWallet() {
        state.walletShow = true;
      },
      saveHandle() {
        if (!state.tgUserName) {
          state.emptyTip("电报名不能为空");
          return;
        }
        if (!state.tgID) {
          state.emptyTip("电报ID不能为空");
          return;
        }
        if (!state.privateKey) {
          state.emptyTip("私钥不能为空");
          return;
        }
        if (!state.password) {
          state.emptyTip("密码不能为空");
          return;
        }
        if (!state.confirmPassword) {
          state.emptyTip("确认密码不能为空");
          return;
        }
        if (state.password !== state.confirmPassword) {
          state.emptyTip("两次密码不一样");
          return;
        }
        state.walletShow = false;
        localStorage.setItem(
          "privateKey",
          JSON.stringify({
            tgUserName: state.tgUserName,
            tgID: state.tgID,
            privateKey: state.privateKey,
            password: state.password,
          })
        );
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

        ipcRenderer.send("shut-down", {
          isClose: true,
        });
      },
    });
    onMounted(() => {
      if (JSON.parse(localStorage.getItem("privateKey"))) {
        const conf = JSON.parse(localStorage.getItem("privateKey"));
        state.tgUserName = conf.tgUserName;
        state.tgID = conf.tgID;
        state.privateKey = conf.privateKey;
        state.password = conf.password;
        state.confirmPassword = conf.password;
      }
    });
    return {
      ...toRefs(state),
      essentialLinks: linksList,
    };
  },
});
</script>
<style scoped lang="scss">
@import "../assets/styles/layout.scss";
</style>
