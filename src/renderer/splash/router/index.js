import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/splash",
    name: "Splash",
    component: () => import(/* webpackChunkName: "Splash" */ "../App.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
