import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueTouch from "vue-touch";
import axios from "axios";

import { StillerService } from "./services/StillerService";
import { TransService } from "./services/TransService";

// import './assets/css/materialize.css';
import './assets/css/hellper.css';
import './assets/css/animate.css';

Vue.config.productionTip = false

Vue.use( VueTouch )
Vue.use({ install(V) { V.prototype.$axios = axios } })

Vue.use( StillerService )
Vue.use( TransService )

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
