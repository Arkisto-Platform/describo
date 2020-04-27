import "regenerator-runtime/runtime";
import CrateTool from "./crate-tools";
import { cloneDeep, isPlainObject, isArray } from "lodash";

const root = {
    "@context": "https://w3id.org/ro/crate/1.0/context",
    "@graph": [
        {
            "@id": "/ro-crate-metadata.jsonld",
            "@type": "CreativeWork",
            about: {
                "@id": "./",
            },
            identifier: "ro-crate-metadata.jsonld",
            conformsTo: {
                "@id": "https://w3id.org/ro/crate/1.0",
            },
            license: {
                "@id": "https://creativecommons.org/licenses/by-sa/3.0",
            },
        },
    ],
};
const graph = [
    {
        "@type": "RootDataset",
        uuid: "#1",
        name: "dataset",
        author: [
            { uuid: "#2", "@type": "Person" },
            { uuid: "#3", "@type": "Person" },
        ],
        elephants: [{ uuid: "/large" }],
        languages: ["english", "french"],
        participant: [{ uuid: "#3" }, { uuid: "#4" }],
    },
    {
        "@type": "Person",
        uuid: "#2",
        "@reverse": {
            author: [
                {
                    uuid: "#1",
                    something: {
                        uuid: "#4",
                    },
                },
            ],
        },
    },
    {
        "@type": "Person",
        uuid: "#3",
        "@reverse": {
            author: [{ uuid: "#1" }],
            participant: [{ uuid: "#1" }],
        },
    },
    {
        "@type": "Person",
        uuid: "#4",
        "@reverse": {
            participant: [{ uuid: "#1" }],
        },
    },
    {
        "@type": "Elephant",
        uuid: "/large",
        "@reverse": {
            elephants: [{ uuid: "#1" }],
        },
    },
];

test("it should be able to find the root dataset", () => {
    const crateTool = new CrateTool();
    expect(() => {
        let rootDataset = crateTool.getRootDataset({
            data: graph,
            fromGraph: true,
        });
    }).not.toThrow();
});

test("it should not be able to find the root dataset", () => {
    const graph = [
        {
            "@type": "Dataset",
            uuid: "#1",
            name: "dataset",
            author: {
                uuid: "#2",
            },
            elephants: [{ "@id": "/large" }],
            participant: [{ uuid: "#3" }, { uuid: "#4" }],
        },
    ];

    const crateTool = new CrateTool();
    expect(() => {
        let rootDataset = crateTool.getRootDataset({
            data: graph,
            fromGraph: true,
        });
    }).toThrow();
});

test("it should complain about more than one root dataset in the graph", () => {
    const graph = [
        {
            "@type": "RootDataset",
            uuid: "#1",
            name: "dataset",
        },
        {
            "@type": "RootDataset",
            uuid: "#2",
            name: "dataset",
        },
    ];

    const crateTool = new CrateTool();
    expect(() => {
        let rootDataset = crateTool.getRootDataset({
            data: graph,
            fromGraph: true,
        });
    }).toThrow(
        `There seems to be more than one root Dataset. You must provide a graph with only one`
    );
});

test("it should complain about more than one root dataset in the crate being loaded", () => {
    let crate = cloneDeep(root);
    crate["@graph"].push({
        "@type": "Dataset",
        "@id": "./",
    });
    crate["@graph"].push({
        "@type": "Dataset",
        "@id": "./",
    });

    const crateTool = new CrateTool();
    expect(() => {
        let rootDataset = crateTool.getRootDataset({ data: crate["@graph"] });
    }).toThrow(
        `There seems to be more than one root Dataset. You must provide a graph with only one`
    );
});

test("it should be able to create an ro-crate", () => {
    const crateTool = new CrateTool();
    crateTool.assembleCrate({ data: graph });
    let data = crateTool.crate;
    // console.log(JSON.stringify(data, null, 2));
    expect(data["@graph"].length).toBe(6);
    // console.log(JSON.stringify(data["@graph"], null, 2));

    let ensureNoUUID = ensureNot("uuid");
    let ensureATID = ensure("@id");
    let rootDataset = crateTool.getRootDataset({
        data: data["@graph"],
    });
    walkObject({ obj: rootDataset, tests: [ensureNoUUID, ensureATID] });
});

test("it should be able to load a complex but good crate", () => {
    let crate = {
        "@context": "https://w3id.org/ro/crate/1.0/context",
        "@graph": [
            {
                "@id": "/ro-crate-metadata.jsonld",
                "@type": "CreativeWork",
                about: {
                    "@id": "./",
                },
                identifier: "ro-crate-metadata.jsonld",
                conformsTo: {
                    "@id": "https://w3id.org/ro/crate/1.0",
                },
                license: {
                    "@id": "https://creativecommons.org/licenses/by-sa/3.0",
                },
            },
            {
                "@type": "Dataset",
                "@id": "./",
                name: "dataset",
                author: {
                    "@id": "#2",
                },
                elephants: [
                    {
                        "@id": "/large",
                    },
                ],
                languages: ["english", "french"],
                participant: [
                    {
                        "@id": "#3",
                    },
                    {
                        "@id": "#4",
                    },
                ],
            },
            {
                "@id": "#5",
                "@type": "Dataset",
                participant: [
                    {
                        "@id": "#3",
                    },
                    {
                        "@id": "#4",
                    },
                ],
            },
            {
                "@type": "Person",
                "@id": "#2",
            },
            {
                "@type": "Person",
                "@id": "#3",
            },
            {
                "@type": "Person",
                "@id": "#4",
            },
            {
                "@type": "Elephant",
                "@id": "/large",
            },
        ],
    };
    const crateTool = new CrateTool();
    const { data, errors } = crateTool.loadCrate({ crate });

    let ensureUUID = ensure("uuid");
    let ensureNotATID = ensureNot("@id");
    let rootDataset = data.filter((d) => d["@type"] === "RootDataset")[0];
    walkObject({ obj: rootDataset, tests: [ensureUUID, ensureNotATID] });
});

test("it should fail trying to load a crate without a root dataset", () => {
    let crate, data, errors;
    const crateTool = new CrateTool();
    crate = cloneDeep(root);

    // no root dataset
    expect(() => {
        ({ data, errors } = crateTool.loadCrate({ crate }));
    }).toThrow();
    // console.log(JSON.stringify(data, null, 2));
});

test("it should succeed loading a simple crate with one prop reference", () => {
    let crate, data, errors;
    const crateTool = new CrateTool();
    crate = cloneDeep(root);
    crate["@graph"].push({
        "@type": "Dataset",
        "@id": "./",
        name: "dataset",
        author: {
            "@id": "#2",
        },
    });
    crate["@graph"].push({
        "@type": "Person",
        "@id": "#2",
    });
    ({ data, errors } = crateTool.loadCrate({ crate }));
    // console.log(JSON.stringify(data, null, 2));
    expect(data[0].author["@type"]).toBe("Person");
    expect(data[0].author.uuid).toBe("#2");
    expect(data[1]["@type"]).toBe("Person");
    expect(data[1]["@reverse"]).toHaveProperty("author");
    expect(data[1]["@reverse"].author.length).toBe(1);
    expect(data[1]["@reverse"].author[0].uuid).toBe(data[0].uuid);
});

test("it should succeed loading a simple crate with one prop referencing two elements", () => {
    let crate, data, errors;
    const crateTool = new CrateTool();
    crate = cloneDeep(root);
    crate["@graph"].push({
        "@type": "Dataset",
        "@id": "./",
        name: "dataset",
        author: [
            {
                "@id": "#3",
            },
            {
                "@id": "#4",
            },
        ],
    });
    crate["@graph"].push({
        "@type": "Person",
        "@id": "#3",
    });
    crate["@graph"].push({
        "@type": "Person",
        "@id": "#4",
    });
    ({ data, errors } = crateTool.loadCrate({ crate }));
    // console.log(JSON.stringify(data, null, 2));
    expect(data[1]["@reverse"]).toHaveProperty("author");
    expect(data[1]["@reverse"].author.length).toBe(1);
    expect(data[1]["@reverse"].author[0].uuid).toBe(data[0].uuid);
    expect(data[2]["@reverse"]).toHaveProperty("author");
    expect(data[2]["@reverse"].author.length).toBe(1);
    expect(data[2]["@reverse"].author[0].uuid).toBe(data[0].uuid);
});

test("it should succeed loading a crate with two datasets referencing another element", () => {
    let crate, data, errors;
    const crateTool = new CrateTool();
    crate = cloneDeep(root);
    crate["@graph"].push({
        "@type": "Dataset",
        "@id": "./",
        name: "dataset",
        author: [
            {
                "@id": "#3",
            },
        ],
    });
    crate["@graph"].push({
        "@type": "Dataset",
        "@id": "#5",
        name: "dataset",
        author: [
            {
                "@id": "#3",
            },
        ],
    });
    crate["@graph"].push({
        "@type": "Person",
        "@id": "#3",
    });
    ({ data, errors } = crateTool.loadCrate({ crate }));
    // console.log(JSON.stringify(data, null, 2));
    expect(data[2]["@reverse"]).toHaveProperty("author");
    expect(data[2]["@reverse"].author.length).toBe(2);
    expect(data[2]["@reverse"].author[0].uuid).toBe(data[0].uuid);
    expect(data[2]["@reverse"].author[1].uuid).toBe(data[1].uuid);
});

test("it should report errors when elements are missing @id property", () => {
    let crate, data, errors;
    const crateTool = new CrateTool();

    crate = cloneDeep(root);
    crate["@graph"].push({
        "@type": "Dataset",
        "@id": "./",
        name: "dataset",
        hasPart: [{ "@id": "#5" }],
    });
    crate["@graph"].push({
        "@type": "Dataset",
    });
    ({ data, errors } = crateTool.loadCrate({ crate }));
    // console.log(JSON.stringify(data, null, 2));
    expect(errors[0]).toMatch(/Unable to resolve item reference/);
    expect(errors[1]).toMatch(/Missing property '@id'/);
    expect(errors[2]).toMatch(/Orphaned item found/);
});

test("it should report errors when elements are missing @type property", () => {
    let crate, data, errors;
    const crateTool = new CrateTool();

    crate = cloneDeep(root);
    crate["@graph"].push({
        "@type": "Dataset",
        "@id": "./",
        name: "dataset",
        hasPart: [{ "@id": "#5" }],
    });
    crate["@graph"].push({
        "@id": "#5",
        "@reverse": {
            hasPart: { "@id": "./" },
        },
    });
    ({ data, errors } = crateTool.loadCrate({ crate }));
    // console.log(JSON.stringify(data, null, 2));
    expect(errors[0]).toMatch(/Missing property '@type'/);
});

test("it should report errors when dangling elements are found", () => {
    let crate, data, errors;
    const crateTool = new CrateTool();

    crate = cloneDeep(root);
    crate["@graph"].push({
        "@type": "Dataset",
        "@id": "./",
        name: "dataset",
    });
    crate["@graph"].push({
        "@id": "#5",
        "@type": "Dataset",
    });
    ({ data, errors } = crateTool.loadCrate({ crate }));
    // console.log(JSON.stringify(data, null, 2));
    expect(errors[0]).toMatch(/Orphaned item found/);
});

test("it should not report an error - no dangling elements", () => {
    let crate, data, errors;
    const crateTool = new CrateTool();

    crate = cloneDeep(root);
    crate["@graph"].push({
        "@type": "Dataset",
        "@id": "./",
        name: "dataset",
        hasPart: [{ "@id": "#5" }],
    });
    crate["@graph"].push({
        "@id": "#5",
        "@type": "Dataset",
        hasPart: [{ "@id": "#6" }],
    });
    crate["@graph"].push({
        "@id": "#6",
        "@type": "File",
    });
    ({ data, errors } = crateTool.loadCrate({ crate }));
    expect(errors.length).toBe(0);
});

test("it should report errors when unable to resolve item references", () => {
    let crate, data, errors;
    const crateTool = new CrateTool();

    crate = cloneDeep(root);
    crate["@graph"].push({
        "@type": "Dataset",
        "@id": "./",
        name: "dataset",
        hasPart: [{ "@id": "#5" }],
    });
    ({ data, errors } = crateTool.loadCrate({ crate }));
    // console.log(JSON.stringify(data, null, 2));
    expect(errors[0]).toMatch(/Unable to resolve item reference/);
});

test("it should be able to verify a crate has all the required data", () => {
    const crateTool = new CrateTool();
    let data, inputs, valid;

    inputs = [
        { property: "name", required: true },
        { property: "elephants" },
        { property: "author", required: true },
    ];
    valid = crateTool.verifyCrate({ data: graph, inputs });
    expect(valid).toBeTruthy;

    inputs = [{ property: "jumbo", required: true }];
    valid = crateTool.verifyCrate({ data: graph, inputs });
    expect(valid).toBeFalsy;

    inputs = [{ property: "participant", required: true }];
    data = cloneDeep(graph);
    delete data[0].participant;
    valid = crateTool.verifyCrate({ data, inputs });
    expect(valid).toBeFalsy;

    inputs = [{ property: "participant", required: true }];
    data = cloneDeep(graph);
    data[0].participant = {};
    valid = crateTool.verifyCrate({ data, inputs });
    expect(valid).toBeFalsy;

    data = cloneDeep(graph);
    data[0].participant = { "@id": "somewhere" };
    valid = crateTool.verifyCrate({ data, inputs });
    expect(valid).toBeTruthy;
});

function ensureNot(property) {
    return (element) => expect(element).not.toHaveProperty(property);
}

function ensure(property) {
    return (element) => expect(element).toHaveProperty(property);
}

function walkObject({ obj, tests }) {
    for (let prop of Object.keys(obj)) {
        if (isPlainObject(obj[prop])) {
            walkObject({ obj: obj[prop], tests });
        } else if (isArray(obj[prop])) {
            walkArray({ arr: obj[prop], tests });
        } else {
            tests.forEach((test) => test(obj));
        }
    }
}

function walkArray({ arr, tests }) {
    arr.forEach((entry) => {
        if (isPlainObject(entry)) {
            walkObject({ obj: entry, tests });
        } else if (isArray(entry)) {
            walkArray({ arr: entry, tests });
        }
    });
}
