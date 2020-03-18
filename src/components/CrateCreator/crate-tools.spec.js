import CrateTool from "./crate-tools";
import { isPlainObject, isArray } from "lodash";

const graph = [
    {
        "@type": "RootDataset",
        uuid: "#1",
        name: "dataset",
        author: {
            uuid: "#2"
        },
        elephants: [{ uuid: "#5", "@id": "/large" }],
        participant: [{ uuid: "#3" }, { uuid: "#4" }]
    },
    {
        "@type": "Person",
        uuid: "#2"
    },
    {
        "@type": "Person",
        uuid: "#3"
    },
    {
        "@type": "Person",
        uuid: "#4"
    },
    { uuid: "#5", "@type": "Elephant", "@id": "/large" }
];

test("it should be able to map UUID to @id if @id not defined", () => {
    const crateTool = new CrateTool();
    let data = crateTool.mapIdentifiers({ data: graph });
    data = data.shift();
    expect(data["@id"]).toBe(data.uuid);
    expect(data.author["@id"]).toBe(data.author.uuid);
    for (let p of data.participant) {
        expect(p["@id"]).toBe(p.uuid);
    }
    expect(data.elephants[0]).toHaveProperty("@id");
});

test("it should be able to find the root dataset", () => {
    const crateTool = new CrateTool();
    expect(() => {
        let rootDataset = crateTool.getRootDataset({ data: graph });
    }).not.toThrow();
});

test("it should not be able to find the root dataset", () => {
    const graph = [
        {
            "@type": "Dataset",
            uuid: "#1",
            name: "dataset",
            author: {
                uuid: "#2"
            },
            elephants: [{ "@id": "/large" }],
            participant: [{ uuid: "#3" }, { uuid: "#4" }]
        }
    ];

    const crateTool = new CrateTool();
    expect(() => {
        let rootDataset = crateTool.getRootDataset({ data: graph });
    }).toThrow();
});

test("it should be able to remove all UUID refs", () => {
    const crateTool = new CrateTool();
    let data = crateTool.mapIdentifiers({ data: graph });
    data = crateTool.cleanup({ data });
    for (let element of data) {
        ensureNoUUID(element);
        for (let property of Object.keys(element)) {
            if (isPlainObject(element[property])) {
                ensureNoUUID(element[property]);
            } else if (isArray(element[property])) {
                for (let entry of element[property]) {
                    ensureNoUUID(entry);
                }
            }
        }
    }
});

test("it should be able to get a crate", () => {
    const crateTool = new CrateTool();
    crateTool.assembleCrate({ data: graph });
    let data = crateTool.crate;
    expect(data["@graph"].length).toBe(6);
});

test("it should be able to load a crate", () => {
    let crate = {
        "@context": "https://w3id.org/ro/crate/1.0/context",
        "@graph": [
            {
                "@id": "/ro-crate-metadata.jsonld",
                "@type": "CreativeWork",
                about: {
                    "@id": "./"
                },
                identifier: "ro-crate-metadata.jsonld",
                conformsTo: {
                    "@id": "https://w3id.org/ro/crate/1.0"
                },
                license: {
                    "@id": "https://creativecommons.org/licenses/by-sa/3.0"
                }
            },
            {
                "@type": "Dataset",
                name: "dataset",
                author: {
                    "@id": "#2"
                },
                elephants: [
                    {
                        "@id": "#1"
                    }
                ],
                participant: [
                    {
                        "@id": "#1"
                    },
                    {
                        "@id": "#1"
                    }
                ],
                "@id": "./"
            },
            {
                "@type": "Person",
                "@id": "#2"
            },
            {
                "@type": "Person",
                "@id": "#3"
            },
            {
                "@type": "Person",
                "@id": "#4"
            },
            {
                "@type": "Elephant",
                "@id": "/large"
            }
        ]
    };
    const crateTool = new CrateTool();
    const data = crateTool.loadCrate({ crate });
    // console.log(JSON.stringify(data, null, 2));

    for (let element of data) {
        ensureUUID(element);
        for (let property of Object.keys(element)) {
            if (isPlainObject(element[property])) {
                ensureUUID(element[property]);
            } else if (isArray(element[property])) {
                for (let entry of element[property]) {
                    ensureUUID(entry);
                }
            }
        }
    }
});

function ensureNoUUID(element) {
    expect(element).not.toHaveProperty("uuid");
}

function ensureUUID(element) {
    expect(element).toHaveProperty("uuid");
}
