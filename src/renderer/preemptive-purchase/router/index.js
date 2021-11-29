import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/preemptive-purchase",
    name: "PreemptivePurchase",
    component: () =>
      import(/* webpackChunkName: "PreemptivePurchase" */ "../App.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
