import { mutations, getters } from "./store";
import Vue from "vue";
import Vuex from "vuex";
import { it } from "date-fns/locale";
Vue.use(Vuex);

let state = {};
let store = {};

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
});

test("it should save a single item to the store", () => {
    let item = {
        uuid: "#xxx",
        "@type": "Person",
        name: "x",
    };
    store.commit("saveToGraph", item);
    expect(state.graph.length).toBe(1);
    expect(state.graph[0]).toEqual({
        uuid: "#xxx",
        "@type": "Person",
        name: "x",
    });
    expect(state.itemsById).toHaveProperty("#xxx");
    expect(state.itemsById["#xxx"]).toEqual({
        uuid: "#xxx",
        "@type": "Person",
        name: "x",
    });

    expect(state.itemsByType).toHaveProperty("Person");
    expect(state.itemsByType["Person"]).toEqual([
        {
            uuid: "#xxx",
            "@type": "Person",
            name: "x",
        },
    ]);
});
test("it should fail because required properties have not been provided", () => {
    let item = {
        "@type": "Person",
        name: "x",
    };
    expect(() => {
        store.commit("saveToGraph", item);
    }).toThrow();
    expect(() => {
        store.commit("removeFromGraph", item);
    }).toThrow();

    item = {
        uuid: "#xxx",
        name: "x",
    };
    expect(() => {
        store.commit("saveToGraph", item);
    }).toThrow();
});
test("it should be able to save two different items to the store", () => {
    let item = {
        uuid: "#1",
        "@type": "Person",
        name: "one",
    };
    store.commit("saveToGraph", item);
    item = {
        uuid: "#2",
        "@type": "Person",
        name: "one",
    };
    store.commit("saveToGraph", item);
    expect(state.graph.length).toBe(2);
    expect(Object.keys(state.itemsById).length).toBe(2);
    expect(state.itemsByType.Person.length).toBe(2);
});
test("it should not create two of the same item in the store", () => {
    let item = {
        uuid: "#1",
        "@type": "Person",
        name: "one",
    };
    store.commit("saveToGraph", item);
    store.commit("saveToGraph", item);
    expect(state.graph.length).toBe(1);
    expect(Object.keys(state.itemsById).length).toBe(1);
    expect(state.itemsByType.Person.length).toBe(1);
});
test("it should handle @reverse inputs sensibly - including adding and removing back ref's", () => {
    // add ref author = ./
    let ref1 = {
        uuid: "#1",
        "@type": "Person",
        name: "one",
        "@reverse": {
            author: { uuid: "./" },
        },
    };
    store.commit("saveToGraph", ref1);
    expect(Object.keys(state.itemsById["#1"]["@reverse"]).length).toBe(1);
    expect(state.itemsById["#1"]["@reverse"].author.length).toBe(1);
    // console.log(JSON.stringify(state.graph, null, 2));

    // add ref author = #4
    ref1 = {
        uuid: "#1",
        "@type": "Person",
        name: "one",
        "@reverse": {
            author: { uuid: "#4" },
        },
    };
    store.commit("saveToGraph", ref1);
    expect(Object.keys(state.itemsById["#1"]["@reverse"]).length).toBe(1);
    expect(state.itemsById["#1"]["@reverse"].author.length).toBe(2);
    // console.log(JSON.stringify(state.graph, null, 2));

    // add ref participant = ./
    ref1 = {
        uuid: "#1",
        "@type": "Person",
        name: "one",
        "@reverse": {
            participant: { uuid: "./" },
        },
    };
    store.commit("saveToGraph", ref1);
    expect(Object.keys(state.itemsById["#1"]["@reverse"]).length).toBe(2);
    expect(state.itemsById["#1"]["@reverse"].author.length).toBe(2);
    expect(state.itemsById["#1"]["@reverse"].participant.length).toBe(1);
    // console.log(JSON.stringify(state.graph, null, 2));

    // add ref participant = #elephants
    ref1 = {
        uuid: "#1",
        "@type": "Person",
        name: "one",
        "@reverse": {
            participant: { uuid: "#elephants" },
        },
    };
    store.commit("saveToGraph", ref1);
    expect(Object.keys(state.itemsById["#1"]["@reverse"]).length).toBe(2);
    expect(state.itemsById["#1"]["@reverse"].author.length).toBe(2);
    expect(state.itemsById["#1"]["@reverse"].participant.length).toBe(2);
    // console.log(JSON.stringify(state.graph, null, 2));

    // re-add ref author = ./
    ref1 = {
        uuid: "#1",
        "@type": "Person",
        name: "one",
        "@reverse": {
            author: { uuid: "./" },
        },
    };
    store.commit("saveToGraph", ref1);
    expect(Object.keys(state.itemsById["#1"]["@reverse"]).length).toBe(2);
    expect(state.itemsById["#1"]["@reverse"].author.length).toBe(2);
    expect(state.itemsById["#1"]["@reverse"].participant.length).toBe(2);

    // remove ref author = ./
    ref1 = {
        uuid: "#1",
        "@type": "Person",
        name: "one",
        "@reverse": {
            author: { uuid: "./" },
        },
    };
    store.commit("removeFromGraph", ref1);
    expect(Object.keys(state.itemsById["#1"]["@reverse"]).length).toBe(2);
    expect(state.itemsById["#1"]["@reverse"].author.length).toBe(1);
    expect(state.itemsById["#1"]["@reverse"].participant.length).toBe(2);

    // remove ref author = #4
    ref1 = {
        uuid: "#1",
        "@type": "Person",
        name: "one",
        "@reverse": {
            author: { uuid: "#4" },
        },
    };
    store.commit("removeFromGraph", ref1);
    expect(Object.keys(state.itemsById["#1"]["@reverse"]).length).toBe(1);
    expect(state.itemsById["#1"]["@reverse"].author).toBeUndefined;
    expect(state.itemsById["#1"]["@reverse"].participant.length).toBe(2);

    // remove ref participant = #4 (doesn't exist so no changes)
    ref1 = {
        uuid: "#1",
        "@type": "Person",
        name: "one",
        "@reverse": {
            participant: { uuid: "#4" },
        },
    };
    store.commit("removeFromGraph", ref1);
    expect(Object.keys(state.itemsById["#1"]["@reverse"]).length).toBe(1);
    expect(state.itemsById["#1"]["@reverse"].author).toBeUndefined;
    expect(state.itemsById["#1"]["@reverse"].participant.length).toBe(2);

    // remove ref participant = ./
    ref1 = {
        uuid: "#1",
        "@type": "Person",
        name: "one",
        "@reverse": {
            participant: { uuid: "./" },
        },
    };
    store.commit("removeFromGraph", ref1);
    expect(Object.keys(state.itemsById["#1"]["@reverse"]).length).toBe(1);
    expect(state.itemsById["#1"]["@reverse"].participant.length).toBe(1);

    // remove ref participant = #elephants
    ref1 = {
        uuid: "#1",
        "@type": "Person",
        name: "one",
        "@reverse": {
            participant: { uuid: "#elephants" },
        },
    };
    store.commit("removeFromGraph", ref1);
    expect(state.itemsById["#1"]).toBeUndefined;
});
test("it should be able to merge an item with a reverse with an existing version without", () => {
    // add ref author = ./
    let ref1 = {
        uuid: "#1",
        "@type": "Person",
        name: "one",
    };
    store.commit("saveToGraph", ref1);

    // add ref author = #4
    ref1 = {
        uuid: "#1",
        "@type": "Person",
        name: "one",
        "@reverse": {
            author: { uuid: "#4" },
        },
    };
    store.commit("saveToGraph", ref1);
    expect(Object.keys(state.itemsById["#1"]["@reverse"]).length).toBe(1);
    expect(state.itemsById["#1"]["@reverse"].author.length).toBe(1);
});
test("it should remove an item without an @reverse property", () => {
    let ref1 = {
        uuid: "#1",
        "@type": "Dataset",
        name: "one",
    };
    store.commit("saveToGraph", ref1);
    store.commit("removeFromGraph", ref1);
    expect(state.graph.length).toBe(0);
});
test("it should be able to save type definitions to the store", () => {
    const typeDefinitions = {
        Product: { inputs: [] },
    };
    store.commit("saveTypeDefinitions", typeDefinitions);
    const t = getters.getTypeDefinition(state)("Product");
    expect(t).toBeDefined();
});
test("it should not find a type definition", () => {
    const t = getters.getTypeDefinition(state)("Product");
    console.log(t);
    expect(t).toBeUndefined();
});
test("it should be able to retrieve an item by id", () => {
    let item = {
        uuid: "#xxx",
        "@type": "Person",
        name: "x",
    };
    store.commit("saveToGraph", item);
    const i = getters.getItemById(state)("#xxx");
    expect(i.uuid).toBe(item.uuid);
});
test("it should be able to retrieve items by type", () => {
    let item = {
        uuid: "#xxx",
        "@type": "Person",
        name: "x",
    };
    store.commit("saveToGraph", item);
    const i = getters.getItemsByType(state)("Person");
    expect(i.length).toBe(1);
});
test("it should be able to retrieve a definition", () => {});
