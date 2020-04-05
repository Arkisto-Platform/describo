import { mutations, getters } from "src/renderer/store";
import { save, restore, remove } from "./organisation";

import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

let state = {};
let store = {};
let organisation = {};
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

    organisation = {
        uuid: "#1",
        name: "organisation",
        description: "description"
    };
    reference = {
        property: "author",
        uuid: "#dataset"
    };
    store.commit("saveToGraph", rootDataset);
});

test("it should be able to save a new organisation to the store", () => {
    save({ store, reference, organisation });
    expect(state.graph.length).toBe(3);
    expect(state.itemsById["#1"]["@reverse"]).toEqual({
        author: [{ uuid: "#dataset" }]
    });
    // console.log(JSON.stringify(organisation, null, 2));
});

test("it should be able to save a ROR organisation to the store", () => {
    const uuid = "https://ror.org/xxx";
    organisation.uuid = uuid;

    save({ store, reference, organisation });
    expect(state.graph.length).toBe(3);
    expect(state.itemsById[uuid]["@reverse"]).toEqual({
        author: [{ uuid: "#dataset" }]
    });
    // console.log(JSON.stringify(state.graph, null, 2));
});

test("it should be able to update an existing organisation in the store", () => {
    save({ store, reference, organisation });
    expect(state.itemsById["#1"].name).toBe("organisation");
    // console.log(JSON.stringify(state.graph, null, 2));

    organisation.name = "new name";
    save({ store, reference, organisation });
    expect(state.itemsById["#1"].name).toBe("new name");
    // console.log(JSON.stringify(state.graph, null, 2));

    reference = {
        property: "participant",
        uuid: "#dataset"
    };
    save({ store, reference, organisation });
    expect(state.itemsById["#1"]["@reverse"]).toHaveProperty("author");
    expect(state.itemsById["#1"]["@reverse"]).toHaveProperty("participant");
    // console.log(JSON.stringify(state.graph, null, 2));
});

test("it should be able to remove organisations from the store sensibly", () => {
    save({
        store,
        reference,
        organisation
    });
    // console.log(JSON.stringify(state.graph, null, 2));

    let reference2 = {
        property: "participant",
        uuid: "#dataset"
    };
    save({
        store,
        reference: reference2,
        organisation
    });
    // console.log(JSON.stringify(state.graph, null, 2));
    remove({
        store,
        reference,
        organisation
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
        organisation
    });
    // console.log(JSON.stringify(state.graph, null, 2));
    expect(state.graph.length).toBe(1);
});
