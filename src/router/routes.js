const routes = [
  {
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
];

export default routes;
