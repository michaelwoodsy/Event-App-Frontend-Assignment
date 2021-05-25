import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';
import App from './App.vue';
import Events from "./components/Events";
import Login from "./components/Login";
import Register from "./components/Register";
import ElementPlus from 'element-plus';
import CreateEvent from "./components/CreateEvent";
import EditEvent from "./components/EditEvent";
import ProfilePage from "./components/ProfilePage";
import EditProfile from "./components/EditProfile";
import EventDetails from "./components/EventDetails";
import Home from "./components/Home";
import { store } from "./store"
import ManageRequests from "./components/ManageRequests";

const routes = [
    {
        path: "/",
        name: "home",
        component: Home
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
    },
    {
        path: "/events",
        name: "events",
        component: Events
    },
    {
        path:"/events/:id",
        name: "eventDetails",
        component: EventDetails
    },
    {
        path: "/events/create",
        name: "createEvent",
        component: CreateEvent
    },
    {
        path:"/events/:id/edit",
        name: "editEvent",
        component: EditEvent
    },
    {
        path: "/users/:id",
        name: "profilePage",
        component: ProfilePage
    },
    {
        path: "/users/:id/edit",
        name: "editProfile",
        component: EditProfile
    },
    {
        path: "/events/:id/manage",
        name: "manageRequests",
        component: ManageRequests
    }
];

const router = createRouter({
    routes,
    history: createWebHistory()
});

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.use(store);
app.mount('#app');