"use strict";

import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import path from "path";
import electron from "electron";
let appConfigDir;
try {
    appConfigDir = (electron.app || electron.remote.app).getPath("userData");
} catch (error) {
    appConfigDir = __dirname;
}
const databaseFile = path.join(appConfigDir, "describo-database.sqlite");

import {
    groupBy,
    cloneDeep,
    uniqBy,
    merge,
    isArray,
    isPlainObject,
    flattenDeep,
    has,
} from "lodash";

const state = reset();
export const mutations = {
    setTarget(state, payload) {
        state.target = payload;
    },
    setWriteToDisk(state, payload) {
        state.enableWriteToDisk = payload;
    },
    saveProfile(state, payload) {
        state.profile = payload.profile;
    },
    setActiveProfileType(state, item) {
        state.activeProfileType = item;
    },
    saveDatabaseHandle(state, payload) {
        state.database = payload.database;
    },
    saveTypeDefinitions(state, payload) {
        state.typeDefinitions = cloneDeep(payload);
    },
    saveMappings(state, payload) {
        state.mappings = cloneDeep(payload);
    },
    saveToGraph(state, payload) {
        // payload = {
        //     'uuid': 'xxx',
        //     '@type': ['Dataset' | 'Person' | ... ],
        //     ...:...
        // }

        const item =
            has(payload, "item") && has(payload, "operation")
                ? cloneDeep(payload.item)
                : cloneDeep(payload);

        if (!item.uuid || !item["@type"]) {
            throw new Error(
                "Each item saved to the store must have 'uuid' and '@type' properties"
            );
            return;
        }
        // payload = cloneDeep(payload);

        if (
            has(payload, "item") &&
            has(payload, "operation") &&
            payload.operation === "merge"
        ) {
            state.itemsById[item.uuid] = {
                ...state.itemsById[item.uuid],
                ...item,
            };
        } else {
            state.itemsById[item.uuid] = item;
        }
        state.itemsById = { ...state.itemsById };
        state.graph = Object.keys(state.itemsById).map(
            (key) => state.itemsById[key]
        );
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

        // if pointing to anything in the graph throw an error
        for (let key of Object.keys(item)) {
            if (key === "@reverse") continue;
            if (isPlainObject(item[key]) && item[key].uuid) {
                check(item[key], key);
            } else if (isArray(item[key])) {
                item[key].forEach((element) => check(element, key));
            }
        }
        // if any @reverse properties exist throw an error
        if ("@reverse" in item) {
            for (let key of Object.keys(item["@reverse"])) {
                let entries = [];
                if (isPlainObject(item["@reverse"][key]))
                    entries.push(item["@reverse"][key]);
                if (isArray(item["@reverse"][key]))
                    entries = item["@reverse"][key];
                entries.forEach((entry) => check(entry, key));
            }
        }
        delete state.itemsById[uuid];
        state.graph = Object.keys(state.itemsById).map(
            (key) => state.itemsById[key]
        );
        state.itemsByType = groupItemsByType(state.graph);

        function check(obj, prop) {
            if (isPlainObject(obj) && obj.uuid)
                throw Error(
                    `'${obj.uuid} - ${prop}' points to another item in the graph. Can't be removed.`
                );
        }
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
            return cloneDeep(state.itemsByType[type]) || [];
        } catch (error) {
            return [];
        }
    },
    getTypeDefinition: (state) => (type) => {
        if (has(state.typeDefinitions, type)) {
            return cloneDeep(state.typeDefinitions[type]);
        } else {
            return {
                inputs: [],
                metadata: {},
            };
        }
    },
    getActiveProfileDefinition: (state) => () => {
        return cloneDeep(state.profile.items[state.activeProfileType]);
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
        profile: undefined,
        activeProfileType: undefined,
        database: undefined,
        databaseFile,
        typeDefinitions: {},
        mappings: {},
        graph: [],
        itemsByType: {},
        itemsById: {},
        addNewItem: undefined,
        enableWriteToDisk:
            process.env.NODE_ENV === "development" ? false : true,
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
