"use strict";

import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import { groupBy, uniqBy } from "lodash";
import { stat } from "fs";

const state = reset();
export const mutations = {
    setFolder(state, payload) {
        state.folder = payload.folder;
    },
    setProfile(state, payload) {
        state.profile = payload.profile;
    },
    saveToGraph(state, payload) {
        // payload = {
        //     '@id': 'xxx',
        //     '@type': ['Dataset' | 'Person' | ... ],
        //     ...:...
        // }
        state.itemsById[payload["@id"]] = payload;
        state.graph = Object.keys(state.itemsById).map(
            key => state.itemsById[key]
        );
        state.itemsByType = groupBy(state.graph, "@type");
    },
    removeFromGraph(state, payload) {
        // payload = {
        //     '@id': 'xxx',
        //     '@type': ['Dataset' | 'Person' | ... ],
        //     ...:...
        // }
        state.graph = state.graph.filter(
            item => item["@id"] !== payload["@id"]
        );
        state.itemsByType = groupBy(state.graph, "@type");
        state.itemsById = groupBy(state.graph, "@id");
    },
    reset(state) {
        state.graph = [];
        state.itemsById = {};
        state.itemsByType = {};
    }
};

const configuration = {
    strict: process.env.NODE_ENV !== "production",
    state,
    mutations,
    actions: {},
    getters: {}
};
export const store = new Vuex.Store(configuration);

function reset() {
    return {
        folder: null,
        profile: null,
        graph: [],
        itemsByType: {},
        itemsById: {}
    };
}
