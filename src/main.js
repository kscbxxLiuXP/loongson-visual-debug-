import Vue from 'vue'
import App from './App.vue'
import ElementUI, {Message} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css'
import VueRouter from "vue-router";
import axios from "axios";
import router from "@/router";


Vue.prototype.$message = Message;
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueRouter);

// eslint-disable-next-line vue/multi-word-component-names

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
