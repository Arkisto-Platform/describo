import { mutations, getters } from "src/renderer/store";
import { writeParts } from "./part-tools";

import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

let state = {};
let store = {};
const nodes = [
    {
        uuid: "a/c/",
        path: "a/c",
        name: "a/c",
        size: -1,
        mimeType: "inode/directory",
        modTime: "2020-02-25T10:16:53.020336279+11:00",
        isDir: true,
        parent: "a/",
        isLeaf: false,
    },
    {
        uuid: "a/c/NT1-005-005A.eaf",
        path: "NT1-005-005A.eaf",
        name: "NT1-005-005A.eaf",
        size: 653986,
        mimeType: "application/octet-stream",
        modTime: "2020-02-25T10:13:22.823580306+11:00",
        isDir: false,
        parent: "a/c/",
        isLeaf: true,
    },
    {
        uuid: "a/",
        path: "a",
        name: "a",
        size: -1,
        mimeType: "inode/directory",
        modTime: "2020-02-25T10:16:53.020336279+11:00",
        isDir: true,
        parent: "",
        isLeaf: false,
    },
    {
        uuid: "b/",
        path: "b",
        name: "b",
        size: -1,
        mimeType: "inode/directory",
        modTime: "2020-02-25T10:16:53.020336279+11:00",
        isDir: true,
        parent: "",
        isLeaf: false,
    },
    {
        uuid: "b/NT1-005-005A.eaf",
        path: "NT1-005-005A.eaf",
        name: "NT1-005-005A.eaf",
        size: 653986,
        mimeType: "application/octet-stream",
        modTime: "2020-02-25T10:13:22.823580306+11:00",
        isDir: false,
        parent: "b/",
        isLeaf: true,
    },
    {
        uuid: "file.txt",
        path: "file.txt",
        name: "file.txt",
        size: 653986,
        mimeType: "application/octet-stream",
        modTime: "2020-02-25T10:13:22.823580306+11:00",
        isDir: false,
        parent: "",
        isLeaf: true,
    },
];

const rootDataset = {
    "@type": "RootDataset",
    uuid: "#f187287a-f82e-4414-9ec0-d75617d8bc02",
    name: "fsdbdfgb",
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
    store.commit("saveToGraph", rootDataset);
    store.commit("saveProfileInputs", [
        { property: "hasPart", multiple: true },
    ]);
});

test("it should be able to save files to the dataset and store", () => {
    state.target = {
        type: "local",
        folder: "/Users/mlarosa/src/pdsc/data/NT1",
    };
    writeParts({ store, nodes });
    // console.log(JSON.stringify(state.graph, null, 2));
    expect(state.graph.length).toBe(7);
});

test("the dataset and store should not end up with multiple copies of the same file", () => {
    state.target = {
        type: "local",
        folder: "/Users/mlarosa/src/pdsc/data/NT1",
    };
    writeParts({ store, nodes });
    writeParts({ store, nodes });
    // console.log(JSON.stringify(state.graph, null, 2));
    expect(state.graph.length).toBe(7);
});
