import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/invitation-code",
    name: "InvitationCode",
    component: () =>
      import(/* webpackChunkName: "InvitationCode" */ "../App.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
