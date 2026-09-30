import { createRouter, createWebHistory } from "vue-router";

import DiscoverView from "../views/DiscoverView.vue";
import WatchedView from "../views/WatchedView.vue";
import SavedView from "../views/SavedView.vue";
import ProfileView from "@/views/ProfileView.vue";
import ProfileEditView from "@/views/ProfileEditView.vue";

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
  {
    path: "/profile",
    name: "profile",
    component: ProfileView,
  },
  {
    path: "/profile/edit",
    name: "profile-edit",
    component: ProfileEditView,
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
