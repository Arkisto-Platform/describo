"use strict";

import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import ShellComponent from "components/Shell.component.vue";
import BadRequestComponent from "components/BadRequest.component.vue";
import DescribeShellComponent from "components/DescribeShell.component.vue";
import SettingsShellComponent from "components/Settings/Shell.component.vue";
import OnboardingShellComponent from "components/Onboarding/Shell.component.vue";

export const router = new VueRouter({
    routes: [
        { path: "*", name: "404", component: BadRequestComponent },
        {
            path: "/",
            component: ShellComponent,
            children: [
                {
                    path: "describe",
                    component: DescribeShellComponent,
                },
                {
                    path: "settings",
                    component: SettingsShellComponent,
                },
                {
                    path: "onboarding",
                    component: OnboardingShellComponent,
                },
            ],
        },
    ],
});
