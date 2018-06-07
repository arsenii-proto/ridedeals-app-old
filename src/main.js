// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import VueMaterial from 'vue-material'
import VueMaterialIcon from 'vue-material-icon'
import VueTouch from "vue-touch";

import axios from "axios";
import "./assets/animate.css"
import "./assets/materialize.css"

import { StillerService } from "./services/StillerService";
import { TransService } from "./services/TransService";

Vue.config.productionTip = false

Vue.use( StillerService )
Vue.use( TransService )
Vue.use( VueTouch )
Vue.use({ install(V) { V.prototype.$axios = axios } })
Vue.component(VueMaterialIcon.name, VueMaterialIcon)

/* eslint-disable no-new */
window.VueApp = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
