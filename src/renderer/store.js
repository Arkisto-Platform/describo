"use strict";

import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import {
    groupBy,
    cloneDeep,
    uniqBy,
    merge,
    isArray,
    flattenDeep,
} from "lodash";

const state = reset();
export const mutations = {
    setTarget(state, payload) {
        state.target = payload;
    },
    setProfile(state, payload) {
        state.profile = payload.profile;
    },
    saveProfileInputs(state, payload) {
        state.profileInputs = [...payload];
    },
    saveTypeDefinitions(state, payload) {
        state.typeDefinitions = cloneDeep(payload);
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
        payload = cloneDeep(payload);
        if ("@reverse" in payload) {
            for (let prop of Object.keys(payload["@reverse"])) {
                // convert @reverse prop's to arrays if not already
                if (!isArray(payload["@reverse"][prop])) {
                    payload["@reverse"][prop] = [payload["@reverse"][prop]];
                }
            }
        }

        let item = {};
        if (state.itemsById[payload.uuid]) {
            // clone the existing entry
            item = cloneDeep(state.itemsById[payload.uuid]);

            // iterate over the props in the new entry
            if ("@reverse" in payload && "@reverse" in item) {
                for (let prop of Object.keys(payload["@reverse"])) {
                    // if the prop is in new and old
                    if (
                        prop in payload["@reverse"] &&
                        prop in item["@reverse"]
                    ) {
                        // join sensibly
                        payload["@reverse"][prop] = [
                            ...item["@reverse"][prop],
                            ...payload["@reverse"][prop],
                        ];

                        // then ensure uniq entries only
                        payload["@reverse"][prop] = uniqBy(
                            payload["@reverse"][prop],
                            "uuid"
                        );
                    }

                    // merge the old and new entry
                    payload["@reverse"] = merge(
                        item["@reverse"],
                        payload["@reverse"]
                    );
                }
            }
            // update the item
            state.itemsById[payload.uuid] = {
                ...payload,
            };
        } else {
            state.itemsById[payload.uuid] = payload;
        }

        state.itemsById = { ...state.itemsById };
        state.graph = Object.keys(state.itemsById).map(
            (key) => state.itemsById[key]
        );
        // state.itemsByType = groupBy(state.graph, "@type");
        state.itemsByType = groupItemsByType(state.graph);
    },
    removeFromGraph(state, payload) {
        // payload = {
        //     'uuid': 'xxx',
        //     ...:...
        // }
        if (!payload.uuid) {
            throw new Error(
                "Each item to be removed must have a 'uuid' property"
            );
            return;
        }
        payload = cloneDeep(payload);
        const { uuid } = payload;
        let item = cloneDeep(state.itemsById[uuid]);
        if (!item) return;

        if (payload["@reverse"] && item["@reverse"]) {
            for (let prop of Object.keys(payload["@reverse"])) {
                let reference = payload["@reverse"][prop];
                if (item["@reverse"][prop]) {
                    item["@reverse"][prop] = item["@reverse"][prop].filter(
                        (i) => {
                            return i.uuid !== reference.uuid;
                        }
                    );
                }
            }
            state.itemsById[uuid] = { ...item };

            let reverseProperties = Object.keys(payload["@reverse"]);
            for (let prop of reverseProperties) {
                if (item["@reverse"][prop] && !item["@reverse"][prop].length)
                    delete item["@reverse"][prop];
            }

            reverseProperties = Object.keys(item["@reverse"]);
            if (!reverseProperties.length) delete state.itemsById[uuid];
        } else if (!payload["@reverse"]) {
            delete state.itemsById[uuid];
        }
        state.graph = Object.keys(state.itemsById).map(
            (key) => state.itemsById[key]
        );
        // state.itemsByType = groupBy(state.graph, "@type");
        state.itemsByType = groupItemsByType(state.graph);
    },
    addNewItem(state, payload) {
        state.addNewItem = cloneDeep(payload);
    },
    reset(state) {
        state.graph = [];
        state.itemsById = {};
        state.itemsByType = {};
    },
};

export const getters = {
    getItemById: (state) => (id) => {
        try {
            return cloneDeep(state.itemsById[id]);
        } catch (error) {
            return {};
        }
    },
    getItemsByType: (state) => (type) => {
        try {
            return cloneDeep(state.itemsByType[type]);
        } catch (error) {
            return [];
        }
    },
    getTypeDefinition: (state) => (type) => {
        if (type in state.typeDefinitions) {
            return cloneDeep(state.typeDefinitions[type]);
        } else {
            return undefined;
        }
    },
};

const configuration = {
    strict: process.env.NODE_ENV !== "production",
    state,
    mutations,
    actions: {},
    getters: getters,
};
export const store = new Vuex.Store(configuration);

function reset() {
    return {
        target: null,
        profile: null,
        profileInputs: [],
        typeDefinitions: {},
        graph: [],
        itemsByType: {},
        itemsById: {},
        addNewItem: undefined,
    };
}

function groupItemsByType(graph) {
    const items = graph.map((item) => {
        if (isArray(item["@type"])) {
            return item["@type"].map((type) => {
                return { ...item, "@type": type };
            });
        } else {
            return item;
        }
    });
    return groupBy(flattenDeep(items), "@type");
}
