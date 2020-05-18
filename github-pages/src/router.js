import Vue from "vue";
import VueRouter from "vue-router";
import ShellComponent from "./components/Shell.component.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: ShellComponent,
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;
