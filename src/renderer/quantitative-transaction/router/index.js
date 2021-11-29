import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/quantitative-transaction",
    name: "QuantitativeTransaction",
    component: () =>
      import(/* webpackChunkName: "QuantitativeTransaction" */ "../App.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
