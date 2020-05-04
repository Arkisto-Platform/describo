import { mutations, getters } from "src/renderer/store";
import { linkItemToParent, unlinkItemFromParentAndChildren } from "./tools";
import defaultProfile from "components/profiles/default";
import typeDefinitions from "components/profiles/types";
import { isArray, isPlainObject } from "lodash";

import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

let state = {};
let store = {};
let person = {};
let rootDataset = {
    uuid: "#rootDataset",
    "@type": "RootDataset",
};

beforeEach(() => {
    state = {
        graph: [],
        itemsById: {},
        itemsByType: {},
    };
    store = new Vuex.Store({
        strict: process.env.NODE_ENV !== "production",
        state,
        mutations,
        actions: {},
        getters: getters,
    });
    person = {
        uuid: "#person",
        "@type": "Person",
    };
    store.commit("saveProfileInputs", defaultProfile.Dataset);
    store.commit("saveTypeDefinitions", typeDefinitions);
    store.commit("saveToGraph", rootDataset);
    store.commit("saveToGraph", person);
});

test("it should link / unlink a person to a dataset via the author prop", () => {
    linkItemToParent({
        store,
        parentId: "#rootDataset",
        itemId: "#person",
        property: "author",
    });
    let dataset = store.getters.getItemById("#rootDataset");
    let person = store.getters.getItemById("#person");

    // verify person linked to dataset
    expect(dataset).toHaveProperty("author");
    expect(isArray(dataset.author)).toBe(true);
    expect(dataset.author[0].uuid).toBe("#person");

    // verify dataset referenced in person
    expect(person).toHaveProperty("@reverse");
    expect(isPlainObject(person["@reverse"])).toBe(true);
    expect(person["@reverse"]).toHaveProperty("author");
    expect(isArray(person["@reverse"].author)).toBe(true);
    expect(person["@reverse"].author[0].uuid).toBe("#rootDataset");

    unlinkItemFromParentAndChildren({
        store,
        parentId: "#rootDataset",
        itemId: "#person",
        property: "author",
    });
    dataset = store.getters.getItemById("#rootDataset");
    person = store.getters.getItemById("#person");
    // console.log(person);
    expect(dataset).not.toHaveProperty("author");
    expect(person).toBeUndefined();
});

test("it should link / unlink a person to a dataset via the author and publisher props", () => {
    linkItemToParent({
        store,
        parentId: "#rootDataset",
        itemId: "#person",
        property: "author",
    });
    linkItemToParent({
        store,
        parentId: "#rootDataset",
        itemId: "#person",
        property: "publisher",
    });
    let dataset = store.getters.getItemById("#rootDataset");
    let person = store.getters.getItemById("#person");
    // console.log(person);

    // verify person linked to dataset
    expect(dataset).toHaveProperty("author");
    expect(dataset).toHaveProperty("publisher");
    expect(isArray(dataset.author)).toBe(true);
    expect(isArray(dataset.publisher)).toBe(true);
    expect(dataset.author[0].uuid).toBe("#person");
    expect(dataset.publisher[0].uuid).toBe("#person");

    // verify dataset referenced in person
    expect(person).toHaveProperty("@reverse");
    expect(isPlainObject(person["@reverse"])).toBe(true);
    expect(person["@reverse"]).toHaveProperty("author");
    expect(person["@reverse"]).toHaveProperty("publisher");
    expect(isArray(person["@reverse"].author)).toBe(true);
    expect(isArray(person["@reverse"].publisher)).toBe(true);
    expect(person["@reverse"].author[0].uuid).toBe("#rootDataset");
    expect(person["@reverse"].publisher[0].uuid).toBe("#rootDataset");

    unlinkItemFromParentAndChildren({
        store,
        parentId: "#rootDataset",
        itemId: "#person",
        property: "author",
    });
    dataset = store.getters.getItemById("#rootDataset");
    person = store.getters.getItemById("#person");
    // console.log(JSON.stringify(person, null, 2));
    // console.log(JSON.stringify(dataset, null, 2));

    // verify person still linked to dataset via publisher
    expect(dataset).not.toHaveProperty("author");
    expect(dataset).toHaveProperty("publisher");
    expect(isArray(dataset.publisher)).toBe(true);
    expect(dataset.publisher[0].uuid).toBe("#person");

    // verify dataset referenced in person at publisher and not author
    expect(person).toHaveProperty("@reverse");
    expect(isPlainObject(person["@reverse"])).toBe(true);
    expect(person["@reverse"]).not.toHaveProperty("author");
    expect(person["@reverse"]).toHaveProperty("publisher");
    expect(isArray(person["@reverse"].publisher)).toBe(true);
    expect(person["@reverse"].publisher[0].uuid).toBe("#rootDataset");
    // expect(dataset).not.toHaveProperty("author");
    // expect(person).toBeUndefined();

    unlinkItemFromParentAndChildren({
        store,
        parentId: "#rootDataset",
        itemId: "#person",
        property: "publisher",
    });
    dataset = store.getters.getItemById("#rootDataset");
    person = store.getters.getItemById("#person");
    // console.log(JSON.stringify(dataset, null, 2));
    expect(dataset).not.toHaveProperty("publisher");
    expect(person).toBeUndefined();
});

test("it should link / unlink a person to multiple datasets via the same prop", () => {
    store.commit("saveToGraph", {
        uuid: "#dataset",
        "@type": "Dataset",
    });
    linkItemToParent({
        store,
        parentId: "#rootDataset",
        itemId: "#person",
        property: "author",
    });
    linkItemToParent({
        store,
        parentId: "#dataset",
        itemId: "#person",
        property: "author",
    });
    let root = store.getters.getItemById("#rootDataset");
    let dataset = store.getters.getItemById("#dataset");
    let person = store.getters.getItemById("#person");
    // console.log(JSON.stringify(person, null, 2));
    expect(person["@reverse"].author.length).toBe(2);
    expect(person["@reverse"].author.map((i) => i.uuid)).toEqual([
        "#rootDataset",
        "#dataset",
    ]);

    unlinkItemFromParentAndChildren({
        store,
        parentId: "#dataset",
        itemId: "#person",
        property: "author",
    });
    dataset = store.getters.getItemById("#dataset");
    person = store.getters.getItemById("#person");
    // console.log(dataset);
    // console.log(person);
    expect(dataset).not.toHaveProperty("author");
    expect(person["@reverse"].author.length).toBe(1);
    expect(person["@reverse"].author.map((i) => i.uuid)).toEqual([
        "#rootDataset",
    ]);
});

test("it should clean up correctly when removing an interlinked item", () => {
    store.commit("saveToGraph", {
        uuid: "#dataset",
        "@type": "Dataset",
    });
    linkItemToParent({
        store,
        parentId: "#rootDataset",
        itemId: "#dataset",
        property: "hasPart",
    });
    linkItemToParent({
        store,
        parentId: "#rootDataset",
        itemId: "#person",
        property: "author",
    });
    linkItemToParent({
        store,
        parentId: "#dataset",
        itemId: "#person",
        property: "author",
    });
    let root = store.getters.getItemById("#rootDataset");
    let dataset = store.getters.getItemById("#dataset");
    let person = store.getters.getItemById("#person");
    // console.log(JSON.stringify(person, null, 2));
    expect(person["@reverse"].author.length).toBe(2);
    expect(person["@reverse"].author.map((i) => i.uuid)).toEqual([
        "#rootDataset",
        "#dataset",
    ]);

    unlinkItemFromParentAndChildren({
        store,
        parentId: "#rootDataset",
        itemId: "#dataset",
        property: "hasPart",
    });
    root = store.getters.getItemById("#rootDataset");
    dataset = store.getters.getItemById("#dataset");
    person = store.getters.getItemById("#person");
    expect(root).not.toHaveProperty("hasPart");
    expect(person["@reverse"].author.length).toBe(1);
    expect(person["@reverse"].author.map((i) => i.uuid)).toEqual([
        "#rootDataset",
    ]);
    expect(dataset).toBeUndefined();
});
