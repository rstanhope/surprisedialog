import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: 'intro',
      component: ()=>import("../views/IntroView.vue")
    },
    {
      path: "/consent",
      name: 'consent',
      component: ()=>import("../views/ConsentView.vue")
    },
    {
      path: "/audioTest",
      name: 'audioTest',
      component: ()=>import("../views/AudioTest.vue")
    },
    {
      path: "/micTest",
      name: 'micTest',
      component: ()=>import("../views/MicTest.vue")
    },
    {
      path: "/t1",
      name: 't1',
      component: ()=>import("../views/TaskOne.vue")
    },
    {
      path: "/t2",
      name: 't2',
      component: ()=>import("../views/TaskTwo.vue")
    },
    {
      path: "/end",
      name: 'end',
      component: ()=>import("../views/EndView.vue")
    }
  ],
})

export default router
