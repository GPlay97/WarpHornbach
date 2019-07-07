import Vue from 'vue';
import './plugins/vuetify';
import MomentJS from 'moment';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';

Vue.config.productionTip = false;

new Vue({
  data: () => ({
    MomentJS,
    settingsBtnClicked: false
  }),
  router,
  render: h => h(App)
}).$mount('#app');