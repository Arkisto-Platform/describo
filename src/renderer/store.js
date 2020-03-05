"use strict";

import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const configuration = {
    strict: process.env.NODE_ENV !== "production",
    state: reset(),
    mutations: {
    },
    actions: {
    },
    getters: {}
};
export const store = new Vuex.Store(configuration);

function reset() {
    return {
    };
}
