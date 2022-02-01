export default {
  state() {
    return {
      isActivation: true,
      linksList: [
        {
          title: "主界面",
          caption: "quasar.dev",
          icon: "",
          link: "/",
          disabled: false,
        },
        {
          title: "自动挂单",
          caption: "quasar.dev",
          icon: "",
          link: "/auto-order",
          disabled: true,
        },
        {
          title: "抢开盘",
          caption: "quasar.dev",
          icon: "",
          link: "/market-open",
          disabled: true,
        },
        {
          title: "抢预售",
          caption: "quasar.dev",
          icon: "",
          link: "/pre-sale",
          disabled: true,
        },
        {
          title: "积分兑换",
          caption: "quasar.dev",
          icon: "",
          link: "/points",
          disabled: false,
        },
      ],
      hasPrivateKey: "",
    };
  },
  mutations: {
    setIsActivation(state, status) {
      state.isActivation = status;
    },
    setAutoOrder(state, status) {
      state.linksList[1].disabled = status;
    },
    setMarketOpen(state, status) {
      state.linksList[2].disabled = status;
    },
    setPreSale(state, status) {
      state.linksList[3].disabled = status;
    },
    setHasPrivateKey(state, status) {
      state.hasPrivateKey = status;
    },
  },
};
