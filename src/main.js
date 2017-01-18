import Vue from 'vue';
import App from './App';
import VueResource from 'vue-resource';
// import VueRouter from 'vue-router';
Vue.use(VueResource);
// Vue.use(VueRouter);
Vue.http.options.emulateJSON = true;

new Vue({
    el: '#app',
    template: '<App/>',
    components: {
        App
    },
    // computed: {
    // 	ViewComponent () {
    // 		return i===1?App:address;
    //   	}
    // },
    // render(h) {
    // 	return h(this.ViewComponent);
    // }
})
