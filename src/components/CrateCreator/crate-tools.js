import { cloneDeep, groupBy, isPlainObject, isArray, isEmpty } from "lodash";
import { writeFile, readJSON, pathExists } from "fs-extra";
import { generateId } from "components/CrateCreator/tools";
import path from "path";
const roCrateMetadataFile = "ro-crate-metadata";

export default class CrateTool {
    constructor() {
        this.crate = undefined;
    }

    verifyCrate({ data, inputs }) {
        const rootDataset = this.getRootDataset({ data, fromGraph: true });
        let valid = [];
        for (let input of inputs) {
            const { property, required } = input;
            if (!required in input || !required) continue;
            if (!rootDataset[property] || isEmpty(rootDataset[property]))
                valid.push(false);
            valid.push(true);
        }
        return valid.includes(false) ? false : true;
    }

    async writeCrate({ target }) {
        switch (target.type) {
            case "local":
                await writeToLocalFolder({
                    folder: target.folder,
                    crate: this.crate,
                });
                break;
        }
        async function writeToLocalFolder({ folder, crate }) {
            const file = path.join(folder, `${roCrateMetadataFile}.json`);
            await writeFile(file, JSON.stringify(crate));
        }
    }

    async readCrate({ target }) {
        let crate;
        try {
            switch (target.type) {
                case "local":
                    crate = await readFromLocalFolder({
                        folder: target.folder,
                    });
                    break;
            }
        } catch (error) {
            return null;
        }

        return this.loadCrate({ crate });
        async function readFromLocalFolder({ folder }) {
            // is there a .json file? read that otherwise fall back to reading
            //  the .jsonld file if any
            const jsonFile = path.join(folder, `${roCrateMetadataFile}.json`);
            const jsonldFile = path.join(
                folder,
                `${roCrateMetadataFile}.jsonld`
            );
            if (await pathExists(jsonFile)) {
                return await readJSON(jsonFile);
            } else if (await pathExists(jsonldFile)) {
                return await readJSON(jsonldFile);
            }
            return undefined;
        }
    }

    loadCrate({ crate }) {
        let errors = [];
        let data = crate["@graph"];
        data = data.filter((e) => e["@id"] !== `/${roCrateMetadataFile}.json`);
        data = data.filter(
            (e) => e["@id"] !== `/${roCrateMetadataFile}.jsonld`
        );

        const rootDatasetUUID = generateId();
        data = mapIdentifiers({ data, rootDatasetUUID });
        // console.log(JSON.stringify(data, null, 2));
        data = mapReverse({
            data,
            rootDataset: this.getRootDataset({ data, fromGraph: true }),
        });
        // console.log(JSON.stringify(data, null, 2));
        ({ data, errors } = verify({ data }));
        return { data, errors };

        function mapIdentifiers({ data, rootDatasetUUID }) {
            const elementsById = groupBy(data, "@id");
            return data.map((element) => {
                element = mapIdToUuid(element);
                return walkObject({ obj: element });
            });

            function walkObject({ obj }) {
                obj = mapIdToUuid(obj);
                for (let prop of Object.keys(obj)) {
                    if (isPlainObject(obj[prop])) {
                        obj[prop] = walkObject({ obj: obj[prop] });
                    } else if (isArray(obj[prop])) {
                        obj[prop] = walkArray({ arr: obj[prop] });
                    }
                }
                return obj;
            }

            function walkArray({ arr }) {
                return arr.map((element) => {
                    if (isPlainObject(element)) {
                        return walkObject({ obj: element });
                    } else if (isArray(element)) {
                        return walkArray({ arr: element });
                    } else {
                        return element;
                    }
                });
            }

            function mapIdToUuid(element) {
                if (element && element["@id"]) {
                    if (element["@id"] === "./") {
                        element.uuid = rootDatasetUUID;
                        element["@type"] = "RootDataset";
                    } else {
                        element.uuid = element["@id"];
                    }
                    try {
                        if (element["@type"] !== "RootDataset") {
                            element["@type"] =
                                elementsById[element["@id"]][0]["@type"];
                        }
                    } catch (error) {}
                    delete element["@id"];
                }
                return element;
            }
        }

        function mapReverse({ data, rootDataset }) {
            const reverseMappings = [];
            data.forEach((element) => {
                walkObject({ obj: element });
            });
            const reverseMappingsByTargetId = groupBy(
                reverseMappings,
                "tgtUUID"
            );
            data.forEach((d) => {
                const mapping = reverseMappingsByTargetId[d.uuid];
                if (mapping) {
                    mapping.forEach((m) => {
                        if (d.uuid === m.tgtUUID) {
                            if (!d["@reverse"]) d["@reverse"] = {};
                            if (!d["@reverse"][m.srcProperty])
                                d["@reverse"][m.srcProperty] = [];
                            if (isPlainObject(d["@reverse"][m.srcProperty]))
                                d["@reverse"][m.srcProperty] = [
                                    d["@reverse"][m.srcProperty],
                                ];
                            d["@reverse"][m.srcProperty].push({
                                uuid: m.srcUUID,
                            });
                        }
                    });
                }
            });
            return data;

            function walkObject({ obj }) {
                for (let property of Object.keys(obj)) {
                    if (isArray(obj[property])) {
                        obj[property].forEach((element) => {
                            if (isPlainObject(element)) {
                                if ("uuid" in element)
                                    reverseMappings.push({
                                        tgtUUID: element.uuid,
                                        srcProperty: property,
                                        srcUUID: obj.uuid,
                                    });
                            }
                        });
                    } else if (isPlainObject(obj[property])) {
                        if ("uuid" in obj[property])
                            reverseMappings.push({
                                tgtUUID: obj[property].uuid,
                                srcProperty: property,
                                srcUUID: obj.uuid,
                            });
                    }
                }
            }
        }

        function verify({ data }) {
            const elementsById = groupBy(data, "uuid");
            // console.log(JSON.stringify(elementsById, null, 2));
            let errors = [];
            data.forEach((item) => {
                // console.log(JSON.stringify(item, null, 2));
                // ensure each item has an @id property
                if (!item.uuid) {
                    errors.push(
                        `Missing property '@id' from item: '${JSON.stringify(
                            item
                        )}`
                    );
                }
                // ensure each item has an @type property
                if (!item["@type"]) {
                    errors.push(
                        `Missing property '@type' from item with @id=${item.uuid}`
                    );
                }

                // ensure each item except for the root dataset has a reverse property
                if (item["@type"] !== "RootDataset" && !item["@reverse"]) {
                    errors.push(
                        `Dangling item found @id=${item.uuid}, @type=${item["@type"]}`
                    );
                }

                // walk all items and make sure all references are resolvable
                walkObject({ obj: item });

                function walkObject({ obj }) {
                    for (let property of Object.keys(obj)) {
                        if (isArray(obj[property])) {
                            obj[property].forEach((element) => {
                                if (isPlainObject(element)) {
                                    if (!elementsById[element.uuid]) {
                                        errors.push(
                                            `Unable to resolve item reference for property: ${property} in item @id=${obj[property].uuid}, @type=${obj[property]["@type"]}`
                                        );
                                    }
                                }
                            });
                        } else if (isPlainObject(obj[property])) {
                            if ("uuid" in obj[property]) {
                                if (!elementsById[obj[property].uuid]) {
                                    errors.push(
                                        `Unable to resolve item reference for property: ${property} in item @id=${obj[property].uuid}, @type=${obj[property]["@type"]}`
                                    );
                                }
                            }
                        }
                    }
                }
            });
            return { data, errors };
        }
    }

    assembleCrate({ data }) {
        data = cloneDeep(data);
        let rootDataset = this.getRootDataset({ data, fromGraph: true });
        data = mapIdentifiers({ data, rootDatasetUUID: rootDataset.uuid });

        let elements = data.filter(
            (d) => d["@type"] !== "Dataset" && d["@id"] !== "./"
        );
        rootDataset = this.getRootDataset({ data, fromGraph: false });

        let graph = [this.getCrateMetadataFileDescriptor()];
        graph = [...graph, rootDataset, ...elements];
        this.crate = {
            "@context": "https://w3id.org/ro/crate/1.0/context",
            "@graph": graph,
        };

        function mapIdentifiers({ data, rootDatasetUUID }) {
            return data.map((element) => {
                element = mapUuidToId(element);
                return walkObject(element);
            });

            function walkObject(obj, level) {
                obj = mapUuidToId(obj);
                for (let prop of Object.keys(obj)) {
                    if (isPlainObject(obj[prop])) {
                        obj[prop] = mapUuidToId(obj[prop]);
                        delete obj[prop]["@type"];
                    } else if (isArray(obj[prop])) {
                        obj[prop].map((element) => {
                            element = mapUuidToId(element);
                            if (isPlainObject(element)) {
                                delete element["@type"];
                            }
                        });
                    }
                }
                return obj;
            }

            function mapUuidToId(element) {
                if (element.uuid && !element["@id"]) {
                    if (element.uuid === rootDatasetUUID) {
                        element["@id"] = "./";
                        element["@type"] = "Dataset";
                    } else {
                        element["@id"] = element.uuid;
                    }
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
                "@id": "./",
            },
            identifier: "ro-crate-metadata.jsonld",
            conformsTo: { "@id": "https://w3id.org/ro/crate/1.0" },
            license: {
                "@id": "https://creativecommons.org/licenses/by-sa/3.0",
            },
        };
    }

    getRootDataset({ data, fromGraph }) {
        let rootDataset;
        data = cloneDeep(data);
        if (fromGraph) {
            rootDataset = data.filter(
                (d) => d["@type"] === "RootDataset" && !isEmpty(d.uuid)
            );
            if (rootDataset.length > 1) {
                throw new Error(
                    `There seems to be more than one root Dataset. You must provide a graph with only one`
                );
            }
        } else {
            rootDataset = data.filter(
                (d) => d["@type"] === "Dataset" && d["@id"] === "./"
            );
            if (rootDataset.length > 1) {
                throw new Error(
                    `There seems to be more than one root Dataset. You must provide a graph with only one`
                );
            }
        }
        if (isEmpty(rootDataset))
            throw new Error(`There must be one root Dataset. None located.`);

        return rootDataset[0];
    }
}
