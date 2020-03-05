"use strict";

import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import ShellComponent from "components/Shell.component.vue";
import BadRequestComponent from "components/BadRequest.component.vue";

export const router = new VueRouter({
    routes: [
        { path: "*", name: "404", component: BadRequestComponent },
        {
            path: "/",
            component: ShellComponent,
            children: []
        }
    ]
});
