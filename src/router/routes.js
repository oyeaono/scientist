const routes = [
  {
    // 主界面
    path: "/",
    name: "Home",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(/* webpackChunkName: "Home" */ "../views/home/index.vue"),
      },
    ],
  },
  {
    // 自动交易
    path: "/auto-order",
    name: "AutoOrder",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(
            /* webpackChunkName: "AutoOrder" */ "../views/auto-order/index.vue"
          ),
      },
    ],
  },
  {
    // 积分
    path: "/points",
    name: "Points",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(/* webpackChunkName: "Points" */ "../views/points/index.vue"),
      },
    ],
  },
  {
    // 抢开盘
    path: "/market-open",
    name: "MarketOpen",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(
            /* webpackChunkName: "MarketOpen" */ "../views/market-open/index.vue"
          ),
      },
    ],
  },
  {
    // 抢预售
    path: "/pre-sale",
    name: "PreSale",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(
            /* webpackChunkName: "PreSale" */ "../views/pre-sale/index.vue"
          ),
      },
    ],
  },
  {
    // 交易检测
    path: "/check-coin",
    name: "CheckCoin",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(
            /* webpackChunkName: "CheckCoin" */ "../views/check-coin/index.vue"
          ),
      },
    ],
  },
  {
    // 貔貅检测
    path: "/brave-troops",
    name: "BraveTroops",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(
            /* webpackChunkName: "BraveTroops" */ "../views/brave-troops/index.vue"
          ),
      },
    ],
  },
];

export default routes;
