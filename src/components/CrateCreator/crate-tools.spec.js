import "regenerator-runtime/runtime";
import CrateTool from "./crate-tools";
import { isPlainObject, isArray } from "lodash";

const graph = [
    {
        "@type": "RootDataset",
        uuid: "#1",
        name: "dataset",
        author: [
            { uuid: "#2", "@type": "Person" },
            { uuid: "#3", "@type": "Person" }
        ],
        elephants: [{ uuid: "/large" }],
        participant: [{ uuid: "#3" }, { uuid: "#4" }]
    },
    {
        "@type": "Person",
        uuid: "#2",
        "@reverse": {
            author: [
                {
                    uuid: "#1",
                    something: {
                        uuid: "#4"
                    }
                }
            ]
        }
    },
    {
        "@type": "Person",
        uuid: "#3",
        "@reverse": {
            author: [{ uuid: "#1" }],
            participant: [{ uuid: "#1" }]
        }
    },
    {
        "@type": "Person",
        uuid: "#4",
        "@reverse": {
            participant: [{ uuid: "#1" }]
        }
    },
    {
        "@type": "Elephant",
        uuid: "/large",
        "@reverse": {
            elephants: [{ uuid: "#1" }]
        }
    }
];

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

test("it should be able to get a crate", () => {
    const crateTool = new CrateTool();
    crateTool.assembleCrate({ data: graph });
    let data = crateTool.crate;
    // console.log(JSON.stringify(data, null, 2));
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
                        "@id": "/large"
                    }
                ],
                participant: [
                    {
                        "@id": "#3"
                    },
                    {
                        "@id": "#4"
                    }
                ],
                "@id": "./"
            },
            {
                "@type": "Person",
                "@id": "#2",
                "@reverse": {
                    author: [
                        {
                            "@id": "./"
                        }
                    ]
                }
            },
            {
                "@type": "Person",
                "@id": "#3",
                "@reverse": {
                    participant: [
                        {
                            "@id": "./"
                        }
                    ]
                }
            },
            {
                "@type": "Person",
                "@id": "#4",
                "@reverse": {
                    participant: [
                        {
                            "@id": "./"
                        }
                    ]
                }
            },
            {
                "@type": "Elephant",
                "@id": "/large",
                "@reverse": {
                    author: [
                        {
                            "@id": "./"
                        }
                    ]
                }
            }
        ]
    };
    const crateTool = new CrateTool();
    const data = crateTool.loadCrate({ crate });
    // console.log(JSON.stringify(data, null, 2));
});

function ensureNoUUID(element) {
    expect(element).not.toHaveProperty("uuid");
}

function ensureUUID(element) {
    expect(element).toHaveProperty("uuid");
}
