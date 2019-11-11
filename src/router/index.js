import Vue from 'vue';
import Router from 'vue-router';

// router lazy load
Vue.use(Router);

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', name: 'home', component: () => import('../views/Home.vue') },
    {
      path: '/sys',
      name: 'sys',
      component: () => import('../views/SysPages/SysHome.vue'),
      children: [
        {
          path: 'projects',
          component: () =>
            import('../views/SysPages/SysComponents/Projects.vue')
        },
        {
          path: 'operators',
          component: () =>
            import('../views/SysPages/SysComponents/Operators.vue')
        },
        {
          path: 'players',
          component: () => import('../views/SysPages/SysComponents/Players.vue')
        },
        {
          path: 'records',
          component: () => import('../views/SysPages/SysComponents/Records.vue')
        },
        {
          path: 'schedules',
          component: () =>
            import('../views/SysPages/SysComponents/Schedules.vue')
        }
      ]
    }
  ]
});
