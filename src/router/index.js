import { createRouter, createWebHistory } from "vue-router";

import DiscoverView from "../views/DiscoverView.vue";
import WatchedView from "../views/WatchedView.vue";
import SavedView from "../views/SavedView.vue";

const routes = [
  {
    path: "/",
    redirect: "/discover",
  },
  {
    path: "/discover",
    name: "discover",
    component: DiscoverView,
  },
  {
    path: "/watched",
    name: "watched",
    component: WatchedView,
  },
  {
    path: "/saved",
    name: "saved",
    component: SavedView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: "smooth" };
    }
  },
});

export default router;
