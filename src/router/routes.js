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
    // 解锁设备
    path: "/unlock",
    name: "Unlock",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(/* webpackChunkName: "Points" */ "../views/unlock/index.vue"),
      },
    ],
  },
];

export default routes;
