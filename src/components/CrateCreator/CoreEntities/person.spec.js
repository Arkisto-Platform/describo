import { mutations } from "src/renderer/store";
import { save, restore, remove } from "./person";

let state = {};
let store = {};
let params = {};

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
    params = {
        uuid: "#1",
        id: "something",
        name: "x",
        identifierId: "#2",
        idType: "ORCID",
        "@reverse": {
            author: { "@id": "./" }
        }
    };
    save({ store, params });
});

test("saving a person to the store", () => {
    expect(state.graph.length).toBe(2);
    expect(Object.keys(state.itemsById)).toEqual(["#1", "#2"]);
    expect(Object.keys(state.itemsByType)).toEqual(["Person", "PropertyValue"]);
});
test("linking to a person from a different reference", () => {
    const params = {
        uuid: "#1",
        id: "something",
        name: "x",
        identifierId: "#2",
        idType: "ORCID",
        "@reverse": {
            participant: { "@id": "./" }
        }
    };
    save({ store, params });
    expect(state.graph.length).toBe(2);
    expect(state.itemsById["#1"]["@reverse"]).toEqual({
        author: { "@id": "./" },
        participant: { "@id": "./" }
    });
});
test("restoring a person from the store", () => {
    const properties = restore({ store, id: "#1" });
    expect(properties.uuid).toBe("#1");
    expect(properties.id).toBe("something");
    expect(properties.identifierId).toBe("#2");
    expect(properties.name).toBe("x");
    expect(properties.idType).toBe("ORCID");
});
test("removing one person with one reference from the store", () => {
    remove({ store, params });
    expect(state.graph.length).toBe(0);
});
test("removing one person with two references from the store", () => {
    const params = {
        uuid: "#1",
        id: "something",
        name: "x",
        identifierId: "#2",
        idType: "ORCID",
        "@reverse": {
            participant: { "@id": "./" }
        }
    };
    save({ store, params });
    remove({ store, params });
    // console.log(JSON.stringify(state.graph, null, 2));
    expect(state.graph.length).toBe(2);

    // try to remove non existant reference - ref count still > 0
    params["@reverse"] = { elephants: { "@id": "./" } };
    remove({ store, params });
    expect(state.graph.length).toBe(2);

    // remove real reference - ref count === 0
    params["@reverse"] = { author: { "@id": "./" } };
    remove({ store, params });
    expect(state.graph.length).toBe(0);
});
