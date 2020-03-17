"use strict";

import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import { groupBy, uniqBy, merge } from "lodash";
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
        let cache = {};
        if (state.itemsById[payload.uuid])
            cache = state.itemsById[payload.uuid];
        state.itemsById[payload.uuid] = { ...payload };
        if (cache.reference && payload.reference)
            state.itemsById[payload.uuid].reference = [
                ...payload.reference,
                ...cache.reference
            ];
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
        const { uuid, reference } = payload;
        if (state.itemsById[uuid]) {
            if (reference && state.itemsById[uuid].reference) {
                state.itemsById[uuid].reference = state.itemsById[
                    uuid
                ].reference.filter(r => r !== reference);
                if (!state.itemsById[uuid].reference.length)
                    delete state.itemsById[uuid];
            } else if (!reference) {
                delete state.itemsById[uuid];
            }
        }
        state.graph = Object.keys(state.itemsById).map(
            key => state.itemsById[key]
        );
        state.itemsByType = groupBy(state.graph, "@type");
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
