import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/preemptive-pre-sale",
    name: "PreemptivePreSale",
    component: () =>
      import(/* webpackChunkName: "PreemptivePreSale" */ "../App.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
