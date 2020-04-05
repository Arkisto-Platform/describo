import { mutations, getters } from "src/renderer/store";
import { save, restore, remove } from "./person";

import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

let state = {};
let store = {};
let person = {};
let reference = {};
let rootDataset = {
    uuid: "#dataset",
    "@type": "RootDataset"
};

beforeEach(() => {
    state = {
        graph: [],
        itemsById: {},
        itemsByType: {}
    };
    store = new Vuex.Store({
        strict: process.env.NODE_ENV !== "production",
        state,
        mutations,
        actions: {},
        getters: getters
    });
    person = {
        uuid: "#1",
        name: "person"
    };
    reference = {
        property: "author",
        uuid: "#dataset"
    };
    store.commit("saveToGraph", rootDataset);
});

test("it should be able to save a new person to the store", () => {
    save({ store, reference, person });
    expect(state.graph.length).toBe(3);
    expect(state.itemsById["#1"]["@reverse"]).toEqual({
        author: [{ uuid: "#dataset" }]
    });
    // console.log(JSON.stringify(state.graph, null, 2));
});
test("it should be able to update an existing organisation in the store", () => {
    save({ store, reference, person });
    expect(state.itemsById["#1"].name).toBe("person");
    // console.log(JSON.stringify(state.graph, null, 2));

    person.name = "new name";
    save({ store, reference, person });
    expect(state.itemsById["#1"].name).toBe("new name");
    // console.log(JSON.stringify(state.graph, null, 2));

    reference = {
        property: "participant",
        uuid: "#dataset"
    };
    save({ store, reference, person });
    expect(state.itemsById["#1"]["@reverse"]).toHaveProperty("author");
    expect(state.itemsById["#1"]["@reverse"]).toHaveProperty("participant");
    // console.log(JSON.stringify(state.graph, null, 2));
});
test("it should be able to remove people from the store sensibly", () => {
    save({
        store,
        reference,
        person
    });
    // console.log(JSON.stringify(state.graph, null, 2));

    let reference2 = {
        property: "participant",
        uuid: "#dataset"
    };
    save({
        store,
        reference: reference2,
        person
    });
    // console.log(JSON.stringify(state.graph, null, 2));
    remove({
        store,
        reference,
        person
    });
    // console.log(JSON.stringify(state.graph, null, 2));
    expect(store.getters.getItemById("#1")["@reverse"]).toHaveProperty(
        "participant"
    );
    expect(store.getters.getItemById("#1")["@reverse"]).not.toHaveProperty(
        "author"
    );

    remove({
        store,
        reference: reference2,
        person
    });
    // console.log(JSON.stringify(state.graph, null, 2));
    expect(state.graph.length).toBe(1);
});
