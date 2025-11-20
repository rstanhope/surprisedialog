import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: 'intro',
      component: () => import("../views/IntroView.vue")
    },
    {
      path: "/consent",
      name: 'consent',
      component: () => import("../views/ConsentView.vue")
    },
    {
      path: "/audioTest",
      name: 'audioTest',
      component: () => import("../views/AudioTest.vue")
    },
    {
      path: "/micTest",
      name: 'micTest',
      component: () => import("../views/MicTest.vue")
    },
    {
      path: "/t1",
      name: 't1',
      component: () => import("../views/TaskOne.vue"),
    },
    {
      path: "/t2",
      name: 't2',
      component: () => import("../views/TaskTwo.vue"),
    },
    {
      path: "/end",
      name: 'end',
      component: () => import("../views/EndView.vue"),
    }
  ],
})


//"oneWay" routes are only allowed to move forward, back button is efffectively disabled
router.beforeEach(async (to, from, next) => {
  window.onbeforeunload = function () {
    return "Are you sure you want to leave?";
  };

  if (from.name == "t1" || from.name == "t2") {
    // /t1 and /t1 routes can only proceed to the /end route
    if (to.name == "end") {
      next();
    } else {
      next(false);
    }
  }else if (from.name == "end") {
    // /end route is not allowed to move anywhere else
    next(false);
  } else {
    next();
  }
})

export default router
