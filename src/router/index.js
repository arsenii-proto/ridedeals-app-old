import Vue from 'vue'
import Router from 'vue-router'

import { CheckLogin } from "../services/CheckLogin";

import HelloWorld from '../components/HelloWorld'
import Login from '../components/Login'
import NotAllowed from "../components/NotAllowed";

// Client Area
import ClientMap from "../components/client-dashboard/ClientMap";

// Driver Area
import DriverList from "../components/drive-dashboard/DriverList";

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/not-allowed',
      name: 'NotAllowed',
      component: NotAllowed
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/client-dashboard',
      name: 'Client Dashboard',
      component: ClientMap
    },
  ]
})

router.beforeEach((to, from, next) => {
  
  if (['Login', 'NotAllowed'].indexOf(to.name) == -1) {
    
    CheckLogin.canGo().then(() => {
      
      next()
      
    }).catch(() => {
      
      if( from.name ){

        router.push('/not-allowed')
        
      } else {
        
        router.push('/login')
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