import { mutations } from "src/renderer/store";
import { save, restore } from "./person";
import { ElectronHttpExecutor } from "electron-updater/out/electronHttpExecutor";

const state = {
    graph: [],
    itemsById: {},
    itemsByType: {}
};
const store = {
    state,
    commit: (method, payload) => {
        mutations[method](state, payload);
    }
};
test("saving a person to the store", () => {
    const params = {
        id: 1,
        name: "x",
        identifierId: 2,
        idType: "ORCID"
    };
    save({ store, params });
    expect(state.graph).toEqual([
        { "@id": 1, "@type": "Person", name: "x", identifier: 2 },
        { "@id": 2, "@type": "PropertyValue", name: "ORCID", value: 1 }
    ]);
    expect(Object.keys(state.itemsById)).toEqual(["1", "2"]);
    expect(Object.keys(state.itemsByType)).toEqual(["Person", "PropertyValue"]);
});

test("restoring a person from the store", () => {
    const properties = restore({ store, id: "1" });
    expect(properties.id).toBe(1);
    expect(properties.identifierId).toBe(2);
    expect(properties.name).toBe("x");
    expect(properties.idType).toBe("ORCID");
});
