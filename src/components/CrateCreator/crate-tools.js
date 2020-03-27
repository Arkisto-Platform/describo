import { cloneDeep, isPlainObject, isArray, groupBy } from "lodash";
import { writeFile, readJSON } from "fs-extra";
import { generateId } from "components/CrateCreator/tools";
import path from "path";
const roCrateMetadataFile = "ro-crate-metadata.jsonld";

export default class CrateTool {
    constructor() {
        this.crate = undefined;
    }

    writeCrate({ target }) {
        switch (target.type) {
            case "local":
                writeToLocalFolder({
                    folder: target.folder,
                    crate: this.crate
                });
                break;
        }
        function writeToLocalFolder({ folder, crate }) {
            const file = path.join(folder, roCrateMetadataFile);
            writeFile(file, JSON.stringify(crate));
        }
    }

    async readCrate({ target }) {
        let crate;
        try {
            switch (target.type) {
                case "local":
                    crate = await readFromLocalFolder({
                        folder: target.folder
                    });
                    break;
            }
        } catch (error) {
            return null;
        }

        return this.loadCrate({ crate });
        async function readFromLocalFolder({ folder }) {
            const file = path.join(folder, roCrateMetadataFile);
            return await readJSON(file);
        }
    }

    loadCrate({ crate }) {
        // remove metadata element
        let elements = crate["@graph"];
        elements = elements.filter(
            e => e["@id"] != "/ro-crate-metadata.jsonld"
        );
        const rootDatasetUUID = generateId();
        elements = elements.map(element => {
            if (element["@id"] === "./") {
                element.uuid = rootDatasetUUID;
                element["@type"] = "RootDataset";
            } else {
                element.uuid = element["@id"];
            }

            if (element["@reverse"]) {
                for (let property of Object.keys(element["@reverse"])) {
                    element["@reverse"][property] = element["@reverse"][
                        property
                    ].map(entry => {
                        if (entry["@id"] === "./")
                            entry["@id"] = rootDatasetUUID;
                        return entry;
                    });
                }
            }

            for (let property of Object.keys(element)) {
                if (isPlainObject(element[property])) {
                    element[property].uuid = element[property]["@id"];
                } else if (isArray(element[property])) {
                    element[property] = element[property].map(entry => {
                        entry.uuid = entry["@id"];
                        return entry;
                    });
                }
            }

            return element;
        });
        return elements;
    }

    assembleCrate({ data }) {
        data = cloneDeep(data);
        data = this.mapIdentifiers({ data });
        // data = this.cleanup({ data });

        let graph = [this.getCrateMetadataFileDescriptor()];

        const rootDataset = this.getRootDataset({ data });
        // console.log(rootDataset);
        graph = [...graph, rootDataset];

        let elements = data.filter(d => d["@type"] !== "RootDataset");
        elements = this.remapReverseReferences({ rootDataset, elements });

        graph = [...graph, ...elements];
        data = this.cleanup({ data: graph });
        this.crate = {
            "@context": "https://w3id.org/ro/crate/1.0/context",
            "@graph": graph
        };
    }

    remapReverseReferences({ rootDataset, elements }) {
        elements = elements.map(element => {
            if (element["@reverse"]) {
                for (let property of Object.keys(element["@reverse"])) {
                    element["@reverse"][property] = element["@reverse"][
                        property
                    ].map(entry => {
                        if (entry["@id"] === rootDataset.uuid)
                            entry["@id"] = "./";
                        return entry;
                    });
                }
            }
            return element;
        });
        return elements;
    }

    getCrateMetadataFileDescriptor() {
        return {
            "@id": "/ro-crate-metadata.jsonld",
            "@type": "CreativeWork",
            about: {
                "@id": "./"
            },
            identifier: "ro-crate-metadata.jsonld",
            conformsTo: { "@id": "https://w3id.org/ro/crate/1.0" },
            license: {
                "@id": "https://creativecommons.org/licenses/by-sa/3.0"
            }
        };
    }

    cleanup({ data }) {
        data = data.map(element => {
            for (let property of Object.keys(element)) {
                if (element.uuid) delete element.uuid;
                if (isPlainObject(element[property])) {
                    if (element[property].uuid) delete element[property].uuid;
                } else if (isArray(element[property])) {
                    element[property] = element[property].map(entry => {
                        if (entry.uuid) delete entry.uuid;
                        return entry;
                    });
                }
            }
            return element;
        });
        return data;
    }

    mapIdentifiers({ data }) {
        data = data.map(element => {
            for (let property of Object.keys(element)) {
                element = mapUuidToId({ element });
                if (isPlainObject(element[property])) {
                    element[property] = mapUuidToId({
                        element: element[property]
                    });
                } else if (isArray(element[property])) {
                    element[property] = element[property].map(entry => {
                        return mapUuidToId({ element: entry });
                    });
                }
            }
            return element;
        });

        const elementsByUUID = groupBy(data, "uuid");
        let item;
        data = data.map(element => {
            for (let property of Object.keys(element)) {
                if (isPlainObject(element[property])) {
                    item = elementsByUUID[element.uuid];
                    if (item) element["@id"] = item[0]["@id"];
                } else if (isArray(element[property])) {
                    element[property] = element[property].map(entry => {
                        item = elementsByUUID[entry.uuid];
                        if (item) entry["@id"] = item[0]["@id"];
                        return entry;
                    });
                }
            }
            return element;
        });
        return data;

        function mapUuidToId({ element }) {
            if (element.uuid && !element["@id"]) {
                element["@id"] = element.uuid;
            }
            return element;
        }
    }

    getRootDataset({ data }) {
        let rootDataset = data.filter(d => d["@type"] === "RootDataset");
        if (rootDataset.length !== 1) {
            throw new Error(
                `You must provide a graph with only one 'RootDataset'`
            );
            return;
        }
        rootDataset = rootDataset.pop();
        rootDataset = {
            ...rootDataset,
            "@id": "./",
            "@type": "Dataset"
        };

        return rootDataset;
    }
}
