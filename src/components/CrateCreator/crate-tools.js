import {
    cloneDeep,
    groupBy,
    isPlainObject,
    isArray,
    isEmpty,
    has,
} from "lodash";
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
        data = data.filter((e) => {
            return ![
                `${roCrateMetadataFile}.json`,
                `/${roCrateMetadataFile}.json`,
                `${roCrateMetadataFile}.jsonld`,
                `/${roCrateMetadataFile}.jsonld`,
            ].includes(e["@id"]);
        });

        const rootDatasetUUID = generateId();
        data = mapIdentifiers({ data, rootDatasetUUID });
        // console.log(JSON.stringify(data, null, 2));
        data = mapReverse({
            data,
            rootDataset: this.getRootDataset({ data, fromGraph: true }),
        });
        // console.log(JSON.stringify(data, null, 2));
        ({ data, errors } = this.verify({ data }));
        return { data, errors };

        function mapIdentifiers({ data, rootDatasetUUID }) {
            const elementsById = groupBy(data, "@id");
            return data.map((element) => {
                return walkObject({
                    obj: element,
                    func: mapIdToUuid,
                    level: 0,
                });
            });

            function mapIdToUuid({ obj, level }) {
                if (obj && obj["@id"]) {
                    if (obj["@id"] === "./") {
                        obj.uuid = rootDatasetUUID;
                        obj["@type"] = "RootDataset";
                    } else {
                        obj.uuid = obj["@id"];
                    }
                    try {
                        if (obj["@type"] !== "RootDataset") {
                            obj["@type"] = elementsById[obj["@id"]][0]["@type"];
                        }
                    } catch (error) {}
                    delete obj["@id"];
                }
                return obj;
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
                            // no @reverse prop - add it
                            if (!d["@reverse"]) d["@reverse"] = {};

                            // no @reverse.srcProperty - create as array
                            if (!d["@reverse"][m.srcProperty]) {
                                d["@reverse"][m.srcProperty] = [];
                            }

                            // @reverse.srcProperty is {} = convert to array
                            if (isPlainObject(d["@reverse"][m.srcProperty]))
                                d["@reverse"][m.srcProperty] = [
                                    d["@reverse"][m.srcProperty],
                                ];

                            // push srcProperty reverse
                            const existingReverseMaps = d["@reverse"][
                                m.srcProperty
                            ].map((i) => i.uuid);
                            if (!existingReverseMaps.includes(m.srcUUID)) {
                                d["@reverse"][m.srcProperty].push({
                                    uuid: m.srcUUID,
                                });
                            }
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
    }

    verify({ data }) {
        const skipChecks = ["CreativeWork", "CreateAction"];
        const elementsById = groupBy(data, "uuid");
        // console.log(JSON.stringify(elementsById, null, 2));
        let errors = [];
        for (let item of data) {
            // console.log(JSON.stringify(item, null, 2));
            // ensure each item has an @id property
            if (!item.uuid) {
                errors.push(
                    `Missing property '@id' from item: '${JSON.stringify(item)}`
                );
            }
            // ensure each item has an @type property
            if (!item["@type"]) {
                errors.push(
                    `Missing property '@type' from item with @id=${item.uuid}`
                );
            }

            // stop here if item in skipChecks
            if (skipChecks.includes(item["@type"])) continue;

            // ensure each item except for the root dataset has a reverse property
            if (item["@type"] !== "RootDataset" && !item["@reverse"]) {
                errors.push(
                    `Orphaned item found @id=${item.uuid}, @type=${item["@type"]}`
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
        }
        return { data, errors };
    }

    assembleCrate({ data }) {
        data = cloneDeep(data);
        let rootDataset = this.getRootDataset({ data, fromGraph: true });
        data = updateIdentifierReferences({ data });
        data = mapIdentifiers({ data, rootDatasetUUID: rootDataset.uuid });
        data = removeType({ data });
        // console.log(JSON.stringify(data, null, 2));

        let elements = data.filter(
            (d) => `${d["@type"]}${d["@id"]}` !== "Dataset./"
        );
        rootDataset = this.getRootDataset({ data, fromGraph: false });

        let graph = [this.getCrateMetadataFileDescriptor()];
        graph = [...graph, rootDataset, ...elements];
        this.crate = {
            "@context": "https://w3id.org/ro/crate/1.0/context",
            "@graph": graph,
        };

        function updateIdentifierReferences({ data }) {
            data = data.map((element) => {
                return walkObject({
                    obj: element,
                    func: checkAndUpdateReference,
                });
            });
            return data;

            function checkAndUpdateReference({ obj, level }) {
                const target = data.filter((d) => d.uuid === obj.uuid)[0];
                if (!has(obj, "@id") && has(target, "@id")) {
                    obj["@id"] = target["@id"];
                }
                return obj;
            }
        }

        function mapIdentifiers({ data, rootDatasetUUID }) {
            return data.map((element) => {
                return walkObject({ obj: element, func: mapUuidToId });
            });

            function mapUuidToId({ obj, level }) {
                if (obj.uuid && !obj["@id"]) {
                    if (obj.uuid === rootDatasetUUID) {
                        obj["@id"] = "./";
                        obj["@type"] = "Dataset";
                    } else {
                        obj["@id"] = obj.uuid;
                    }
                }
                delete obj.uuid;
                return obj;
            }
        }

        function removeType({ data }) {
            return data.map((element) => {
                return walkObject({
                    obj: element,
                    func: removeTypeFromElement,
                    level: 0,
                });
            });
            function removeTypeFromElement({ obj, level }) {
                if (level !== 0 && obj["@type"]) delete obj["@type"];
                return obj;
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
            description:
                "Made with Describo: https://uts-eresearch.github.io/describo/",
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

function walkObject({ obj, func, level }) {
    obj = func({ obj, level });
    level += 1;
    for (let prop of Object.keys(obj)) {
        if (isPlainObject(obj[prop])) {
            obj[prop] = walkObject({
                obj: obj[prop],
                func,
                level,
            });
        } else if (isArray(obj[prop])) {
            obj[prop] = walkArray({ arr: obj[prop], func, level });
        }
    }
    return obj;
}

function walkArray({ arr, func, level }) {
    return arr.map((element) => {
        if (isPlainObject(element)) {
            return walkObject({ obj: element, func, level });
        } else if (isArray(element)) {
            return walkArray({ arr: element, func, level });
        } else {
            return element;
        }
    });
}
