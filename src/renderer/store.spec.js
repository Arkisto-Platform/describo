import { mutations } from "./store";

let state = {};
let store = {};

beforeEach(() => {
    state = {
        graph: [],
        itemsById: {},
        itemsByType: {}
    };
    store = {
        state,
        commit: (method, payload) => {
            mutations[method](state, payload);
        }
    };
});

test("it should save a single item to the store", () => {
    let item = {
        uuid: "#xxx",
        "@type": "Person",
        name: "x"
    };
    store.commit("saveToGraph", item);
    expect(state.graph.length).toBe(1);
    expect(state.graph[0]).toEqual({
        uuid: "#xxx",
        "@type": "Person",
        name: "x"
    });
    expect(state.itemsById).toHaveProperty("#xxx");
    expect(state.itemsById["#xxx"]).toEqual({
        uuid: "#xxx",
        "@type": "Person",
        name: "x"
    });

    expect(state.itemsByType).toHaveProperty("Person");
    expect(state.itemsByType["Person"]).toEqual([
        {
            uuid: "#xxx",
            "@type": "Person",
            name: "x"
        }
    ]);
});
test("it should fail because required properties have not been provided", () => {
    let item = {
        "@type": "Person",
        name: "x"
    };
    expect(() => {
        store.commit("saveToGraph", item);
    }).toThrow();
    expect(() => {
        store.commit("removeFromGraph", item);
    }).toThrow();

    item = {
        uuid: "#xxx",
        name: "x"
    };
    expect(() => {
        store.commit("saveToGraph", item);
    }).toThrow();
});
test("it should be able to save two different items to the store", () => {
    let item = {
        uuid: "#1",
        "@type": "Person",
        name: "one"
    };
    store.commit("saveToGraph", item);
    item = {
        uuid: "#2",
        "@type": "Person",
        name: "one"
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
        name: "one"
    };
    store.commit("saveToGraph", item);
    store.commit("saveToGraph", item);
    expect(state.graph.length).toBe(1);
    expect(Object.keys(state.itemsById).length).toBe(1);
    expect(state.itemsByType.Person.length).toBe(1);
});
test("it should be able to create an object with two back references", () => {
    let item = {
        uuid: "#1",
        "@type": "Person",
        name: "one",
        "@reverse": {
            author: { "@id": "./" }
        }
    };
    store.commit("saveToGraph", item);

    item = {
        uuid: "#1",
        "@type": "Person",
        name: "one",
        "@reverse": {
            participant: { "@id": "./" }
        }
    };
    store.commit("saveToGraph", item);
    expect(state.graph.length).toBe(1);
    const person = state.graph.pop();
    expect(Object.keys(person["@reverse"]).length).toBe(2);
});
test("it should not remove the object when there's still a back reference", () => {
    let ref1 = {
        uuid: "#1",
        "@type": "Person",
        name: "one",
        "@reverse": {
            author: { "@id": "./" }
        }
    };
    store.commit("saveToGraph", ref1);
    // console.log(JSON.stringify(state, null, 2));

    let ref2 = {
        uuid: "#1",
        "@type": "Person",
        name: "one",
        "@reverse": {
            participant: { "@id": "./" }
        }
    };
    store.commit("saveToGraph", ref2);

    store.commit("removeFromGraph", ref1);
    expect(state.graph.length).toBe(1);
    expect(Object.keys(state.graph[0]["@reverse"]).length).toBe(1);

    // should do nothing
    store.commit("removeFromGraph", ref1);
    expect(state.graph[0]["@reverse"]).toEqual({
        participant: {
            "@id": "./"
        }
    });
});
test("it should remove the object when there are no back references", () => {
    let ref1 = {
        uuid: "#1",
        "@type": "Person",
        name: "one",
        "@reverse": {
            author: { "@id": "./" }
        }
    };
    store.commit("saveToGraph", ref1);
    // console.log(JSON.stringify(state, null, 2));

    let ref2 = {
        uuid: "#1",
        "@type": "Person",
        name: "one",
        "@reverse": {
            participant: { "@id": "./" }
        }
    };
    store.commit("saveToGraph", ref2);

    store.commit("removeFromGraph", ref1);
    expect(state.graph.length).toBe(1);
    expect(Object.keys(state.graph[0]["@reverse"]).length).toBe(1);

    // should do nothing
    store.commit("removeFromGraph", ref1);
    expect(state.graph[0]["@reverse"]).toEqual({
        participant: {
            "@id": "./"
        }
    });

    store.commit("removeFromGraph", ref2);
    expect(state.graph.length).toBe(0);
});
test("it should remove an item without an @reverse property", () => {
    let ref1 = {
        uuid: "#1",
        "@type": "Dataset",
        name: "one"
    };
    store.commit("saveToGraph", ref1);
    store.commit("removeFromGraph", ref1);
    expect(state.graph.length).toBe(0);
});
