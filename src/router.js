import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Unauthorized from './views/Unauthorized.vue'

import { CheckLogin } from "./services/CheckLogin";

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: Unauthorized
    },
  ]
})


router.beforeEach((to, from, next) => {

  if (['login', 'unauthorized'].indexOf(to.name) == -1) {

    CheckLogin.canGo().then(() => {

      next()

    }).catch(() => {

      if (from.name) {

        router.replace('/unauthorized')

      } else {

        router.replace('/login')
      }

    })

  } else {

    next()
  }

});

router.afterEach(() => {

  setTimeout(() => {

    Vue.prototype.$stiller.splashScreen.hide()

  }, 200)

})

export default router
