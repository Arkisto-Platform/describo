import Vue from "vue";
import VueRouter from "vue-router";
import ShellComponent from "./components/Shell.component.vue";
import FeaturesComponent from "./components/features/Shell.component.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: ShellComponent,
    },
    {
        path: "/features",
        name: "Features",
        component: FeaturesComponent,
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;
