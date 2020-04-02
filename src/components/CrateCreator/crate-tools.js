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
        let data = crate["@graph"];
        data = data.filter(e => e["@id"] !== "/ro-crate-metadata.jsonld");
        const elementsById = groupBy(data, "@id");
        const rootDatasetUUID = generateId();
        data = mapIdentifiers({ data, rootDatasetUUID });
        data = data.map(element => {
            if (element.uuid === rootDatasetUUID)
                element["@type"] = "RootDataset";
            return element;
        });
        return data;

        function mapIdentifiers({ data, rootDatasetUUID }) {
            return data.map(element => {
                element = mapIdToUuid(element);
                return walkObject(element);
            });

            function walkObject(obj) {
                obj = mapIdToUuid(obj);
                for (let prop of Object.keys(obj)) {
                    if (isPlainObject(obj[prop])) {
                        obj[prop] = walkObject(obj[prop]);
                    } else if (isArray(obj[prop])) {
                        obj[prop] = walkArray(obj[prop]);
                    }
                }
                return obj;
            }

            function walkArray(obj) {
                return obj.map(element => {
                    mapIdToUuid(element);
                    if (isPlainObject(element)) {
                        return walkObject(element);
                    } else if (isArray(element)) {
                        return walkArray(element);
                    }
                });
            }

            function mapIdToUuid(element) {
                if (element["@id"]) {
                    element["@type"] = elementsById[element["@id"]][0]["@type"];
                    element.uuid =
                        element["@id"] === "./"
                            ? rootDatasetUUID
                            : element["@id"];
                    delete element["@id"];
                }
                return element;
            }
        }
    }

    assembleCrate({ data }) {
        data = cloneDeep(data);
        const rootDatasetUUID = this.getRootDataset({ data }).uuid;
        data = mapIdentifiers({ data, rootDatasetUUID });

        let elements = data.filter(d => d["@type"] !== "RootDataset");
        let rootDataset = this.getRootDataset({ data });
        rootDataset["@type"] = "Dataset";

        let graph = [this.getCrateMetadataFileDescriptor()];
        graph = [...graph, rootDataset, ...elements];
        this.crate = {
            "@context": "https://w3id.org/ro/crate/1.0/context",
            "@graph": graph
        };

        function mapIdentifiers({ data, rootDatasetUUID }) {
            return data.map(element => {
                element = mapUuidToId(element);
                return walkObject(element);
            });

            function walkObject(obj) {
                obj = mapUuidToId(obj);
                for (let prop of Object.keys(obj)) {
                    if (isPlainObject(obj[prop])) {
                        obj[prop] = walkObject(obj[prop]);
                    } else if (isArray(obj[prop])) {
                        obj[prop] = walkArray(obj[prop]);
                    }
                }
                return obj;
            }

            function walkArray(obj) {
                return obj.map(element => {
                    mapUuidToId(element);
                    if (isPlainObject(element)) {
                        return walkObject(element);
                    } else if (isArray(element)) {
                        return walkArray(element);
                    }
                });
            }

            function mapUuidToId(element) {
                if (element.uuid && !element["@id"]) {
                    element["@id"] =
                        element.uuid === rootDatasetUUID ? "./" : element.uuid;
                }
                delete element.uuid;
                return element;
            }
        }
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
