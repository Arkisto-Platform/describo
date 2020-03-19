"use strict";

import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import { groupBy, uniqBy, merge } from "lodash";
import { stat } from "fs";

const state = reset();
export const mutations = {
    setTarget(state, payload) {
        state.target = payload;
    },
    setProfile(state, payload) {
        state.profile = payload.profile;
    },
    saveToGraph(state, payload) {
        // payload = {
        //     'uuid': 'xxx',
        //     '@type': ['Dataset' | 'Person' | ... ],
        //     ...:...
        // }
        if (!payload.uuid || !payload["@type"]) {
            throw new Error(
                "Each item saved to the store must have 'uuid' and '@type' properties"
            );
            return;
        }
        let cache = {};
        if (state.itemsById[payload.uuid])
            cache = state.itemsById[payload.uuid];
        state.itemsById[payload.uuid] = { ...payload };
        if (cache["@reverse"] && payload["@reverse"])
            state.itemsById[payload.uuid]["@reverse"] = {
                ...cache["@reverse"],
                ...payload["@reverse"]
            };
        state.graph = Object.keys(state.itemsById).map(
            key => state.itemsById[key]
        );
        state.itemsByType = groupBy(state.graph, "@type");
    },
    removeFromGraph(state, payload) {
        // payload = {
        //     'uuid': 'xxx',
        //     ...:...
        // }
        if (!payload.uuid) {
            throw new Error(
                "Each item saved to the store must have 'uuid' and '@type' properties"
            );
            return;
        }
        const { uuid } = payload;
        let item = { ...state.itemsById[uuid] };
        if (!item) return;

        if (payload["@reverse"] && item["@reverse"]) {
            let reverseProperties = Object.keys(payload["@reverse"]);
            for (let prop of reverseProperties) {
                delete item["@reverse"][prop];
            }
            reverseProperties = Object.keys(item["@reverse"]);
            state.itemsById[uuid] = { ...item };
            if (!reverseProperties.length) delete state.itemsById[uuid];
        } else if (!payload["@reverse"]) {
            delete state.itemsById[uuid];
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
        target: null,
        profile: null,
        graph: [],
        itemsByType: {},
        itemsById: {}
    };
}
