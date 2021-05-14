import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';
import App from './App.vue';

const routes = [];

const router = createRouter({
    routes,
    history: createWebHistory()
});

const app = createApp(App);
app.use(router);
app.mount('#app');