import { mutations } from "src/renderer/store";
import { writeParts } from "./part-tools";

let state = {};
let store = {};
const nodes = [
    {
        uuid: "/005",
        path: "005",
        name: "005",
        size: -1,
        mimeType: "inode/directory",
        modTime: "2020-02-25T10:16:53.020336279+11:00",
        isDir: true,
        parent: "/",
        isLeaf: false
    },
    {
        uuid: "/005/NT1-005-005A.eaf",
        path: "NT1-005-005A.eaf",
        name: "NT1-005-005A.eaf",
        size: 653986,
        mimeType: "application/octet-stream",
        modTime: "2020-02-25T10:13:22.823580306+11:00",
        isDir: false,
        parent: "/005",
        isLeaf: true
    }
];

const rootDataset = {
    "@type": "RootDataset",
    uuid: "#f187287a-f82e-4414-9ec0-d75617d8bc02",
    name: "fsdbdfgb"
};

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
    store.commit("saveToGraph", rootDataset);
});

test("it should be able to save files to the dataset and store", () => {
    state.target = {
        type: "local",
        folder: "/Users/mlarosa/src/pdsc/data/NT1"
    };
    writeParts({ store, nodes });
    expect(state.graph.length).toBe(3);
    expect(state.graph[0]["@type"]).toBe("RootDataset");
    expect(state.graph[1]["@type"]).toBe("Dataset");
    expect(state.graph[2]["@type"]).toBe("File");
    expect(state.graph[0].hasPart.length).toBe(1);
    expect(state.graph[1].hasPart.length).toBe(1);
});

test("the dataset and store should not end up with multiple copies of the same file", () => {
    state.target = {
        type: "local",
        folder: "/Users/mlarosa/src/pdsc/data/NT1"
    };
    writeParts({ store, nodes });
    writeParts({ store, nodes });
    expect(state.graph.length).toBe(3);
    expect(state.graph[0]["@type"]).toBe("RootDataset");
    expect(state.graph[1]["@type"]).toBe("Dataset");
    expect(state.graph[2]["@type"]).toBe("File");
    expect(state.graph[0].hasPart.length).toBe(1);
});
