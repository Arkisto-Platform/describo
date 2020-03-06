"use strict";

import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import ShellComponent from "components/Shell.component.vue";
import BadRequestComponent from "components/BadRequest.component.vue";
import TargetSelectionComponent from "components/TargetSelection/Shell.component.vue";
import IntroductionComponent from "components/Introduction.component.vue";

export const router = new VueRouter({
    routes: [
        { path: "*", name: "404", component: BadRequestComponent },
        {
            path: "/",
            component: ShellComponent,
            children: [
                {
                    path: "introduction",
                    component: IntroductionComponent
                },
                {
                    path: "target-selection",
                    component: TargetSelectionComponent
                }
            ]
        }
    ]
});
