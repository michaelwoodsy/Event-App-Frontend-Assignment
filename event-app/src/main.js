import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';
import App from './App.vue';
import Events from "./components/Events";
import Login from "./components/Login";
import Register from "./components/Register";
import ElementPlus from 'element-plus';

const routes = [
    {
        path: "/",
        name: "events",
        component: Events
    },
    {
        path: "/login",
        name: "login",
        component: Login
    },
    {
        path:"/register",
        name: "register",
        component: Register
    }
];

const router = createRouter({
    routes,
    history: createWebHistory()
});

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.mount('#app');