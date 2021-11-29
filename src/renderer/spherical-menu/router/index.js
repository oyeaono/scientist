import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/spherical-menu",
    name: "SphericalMenu",
    component: () =>
      import(/* webpackChunkName: "SphericalMenu" */ "../App.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
