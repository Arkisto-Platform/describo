import {
    compact,
    cloneDeep,
    groupBy,
    isPlainObject,
    isArray,
    isEmpty,
    has,
    uniqBy,
    invert,
} from "lodash";
import { writeFile, readJSON, pathExists, remove } from "fs-extra";
import { generateId } from "components/CrateCreator/tools";
import path from "path";
import isUrl from "validator/lib/isUrl";
import { reverse } from "dns";

const roCrateMetadataFile = "ro-crate-metadata";
const excludeFromDataStore = ["File", "Dataset"];

export default class CrateTool {
    constructor() {
        this.crate = undefined;
    }

    async writeCrate({ target, database }) {
        const items = this.crate["@graph"]
            .filter((i) => i["@id"] !== "/ro-crate-metadata.json")
            .filter((i) => !excludeFromDataStore.includes(i["@type"]));
        this.saveEntitiesToDataStore({ items, database });

        switch (target.type) {
            case "local":
                await writeToLocalFolder({
                    folder: target.folder,
                    crate: this.crate,
                });
                break;
        }
        if (
            await pathExists(
                path.join(target.folder, "ro-crate-metadata.jsonld")
            )
        ) {
            await remove(path.join(target.folder, "ro-crate-metadata.jsonld"));
        }

        async function writeToLocalFolder({ folder, crate }) {
            const file = path.join(folder, `${roCrateMetadataFile}.json`);
            await writeFile(file, JSON.stringify(crate, null, 2));
        }
    }

    async saveEntitiesToDataStore({ items, database }) {
        for (let item of items) {
            item = cloneDeep(item);
            delete item["@reverse"];
            for (let key of Object.keys(item)) {
                if (isArray(item[key])) {
                    item[key] = item[key].map((entry) => {
                        if (!has(entry, "@id")) return entry;
                    });
                    item[key] = compact(item[key]);
                } else if (isPlainObject(item[key])) {
                    if (!has(item[key], "@id")) delete item[key];
                }
                if (isEmpty(item[key])) delete item[key];
            }
            try {
                if ("@id" in item && "@type" in item && "name" in item) {
                    await database.put({ data: [item] });
                }
            } catch (error) {
                console.log(
                    `Couldn't write item.@id ${item["@id"]} to the store.`
                );
            }
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
        let context = {};
        if (!isArray(crate["@context"]))
            crate["@context"] = [crate["@context"]];
        crate["@context"].forEach((entry) => {
            if (isPlainObject(entry)) context = { ...context, ...entry };
        });

        // console.log(context);
        let data = crate["@graph"];
        data = data.filter((e) => {
            return ![
                `${roCrateMetadataFile}.json`,
                `/${roCrateMetadataFile}.json`,
                `${roCrateMetadataFile}.jsonld`,
                `/${roCrateMetadataFile}.jsonld`,
            ].includes(e["@id"]);
        });

        data = reverseDescriboTypeMappings({ data });
        data = mapQualifiedPropertiesFromContext({ data });
        data = removeLocalDefinitionObjects({ data });
        data = ensureNoDuplicatedReferences({ data });

        const rootDatasetUUID = generateId();
        data = mapIdentifiers({ data, rootDatasetUUID });
        // console.log(JSON.stringify(data, null, 2));
        data = mapReverse({
            data,
            rootDataset: this.getRootDataset({
                data,
                fromGraph: true,
            }),
        });
        // console.log(JSON.stringify(data, null, 2));
        ({ data, errors } = this.verify({ data }));
        return { data, errors };

        /*
         * Map @id to uuid
         */
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
                    // if (obj["@id"] === "./") delete obj["@id"];
                    delete obj["@id"];
                }
                return obj;
            }
        }

        /*
         * deduplicate references:
         * { author: [ { uuid: 'x' }, { uuid: 'x' }]}
         *   becomes:
         * { author: [ { uuid: 'x' }] }
         */
        function ensureNoDuplicatedReferences({ data }) {
            data.forEach((item) => {
                Object.keys(item).forEach((property) => {
                    if (property !== "@type" && isArray(item[property])) {
                        item[property] = uniqBy(item[property], "@id");
                    }
                });
            });
            return data;
        }

        /*
         * Ensure every item has @reverse links as required.
         */
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

        /*
         * Map context definitions back in to property names
         *
         * This is essential in order to be able to join the data back in
         *  to the profile definition which is where the fully qualified name is defined.
         */
        function mapQualifiedPropertiesFromContext({ data }) {
            data = data.map((element) => {
                return walkObject({
                    obj: element,
                    func: replaceQualifiedProperties,
                });
            });
            return data;

            function replaceQualifiedProperties({ obj, level }) {
                for (let property of Object.keys(obj)) {
                    if (has(context, property) && isUrl(context[property])) {
                        obj[context[property]] = cloneDeep(obj[property]);
                        delete obj[property];
                    }
                }
                return obj;
            }
        }

        /*
         * Remove definitions objects from the crate - these will get written
         *   back in from the profile when the crate is written out.
         */

        function removeLocalDefinitionObjects({ data }) {
            const invertedContext = invert(context);
            data = data.filter((element) => {
                if (!invertedContext[element["@id"]]) {
                    return element;
                }
            });
            return data;
        }

        /*
         * Reverse type mappings
         *
         * Map @type: ['GeoShape', 'Describo:GeoBox'] -> GeoBox
         */
        function reverseDescriboTypeMappings({ data }) {
            data = data.map((item) => {
                if (isArray(item["@type"])) {
                    const describoType = item["@type"].filter((i) =>
                        i.match(/^Describo:/)
                    );
                    if (describoType.length) {
                        item["@type"] = describoType[0].split(":")[1];
                    }
                }
                return item;
            });
            return data;
        }
    }

    assembleCrate({ data, profileInputs = [], typeDefinitions = {} }) {
        let context = {};
        let definitions = [];
        data = cloneDeep(data);
        let rootDataset = this.getRootDataset({
            data,
            fromGraph: true,
        });
        data = mapQualifiedPropertiesToContext({ data });
        data = writeLocalProfileDefinitions({ data });
        data = uniqBy(data, "uuid");
        data = updateIdentifierReferences({ data });
        data = mapIdentifiers({
            data,
            rootDatasetUUID: rootDataset.uuid,
        });
        data = removeType({ data });
        data = mapTypeDefinitions({ data });
        definitions = uniqBy(definitions, "@id");
        data = [...data, ...definitions];
        // console.log(context);
        // console.log(JSON.stringify(data, null, 2));

        let elements = data.filter(
            (d) => `${d["@type"]}${d["@id"]}` !== "Dataset./"
        );
        rootDataset = this.getRootDataset({
            data,
            fromGraph: false,
        });

        let graph = [this.getCrateMetadataFileDescriptor()];
        graph = [...graph, rootDataset, ...elements];
        // console.log(JSON.stringify(graph, null, 2));
        this.crate = {
            "@context": [
                "https://w3id.org/ro/crate/1.0/context",
                {
                    "@vocab": "https://schema.org/",
                    ...context,
                },
            ],
            "@graph": graph,
        };

        /*
         * Ensure references have @id links between each other
         *
         * { author: [{ @id: 'x'}]}},
         * { @id: 'x' }
         *
         */
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

        /*
         * Map uuid back to @id for export
         * Remove uuid property
         *
         */
        function mapIdentifiers({ data, rootDatasetUUID }) {
            return data.map((element) => {
                return walkObject({
                    obj: element,
                    func: mapUuidToId,
                });
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

        /*
         * Remove the @type property from links
         *
         * Remove @type from { ... author: [{ @id: 'x', @type: 'Person }]}
         *
         */
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

        /*
         * Walk the data and extract the property name from fully qualified properties.
         * Map the property and definition into the context
         *
         * Take: https://fqdn/name and construct @context:  { name: fqdn }
         */
        function mapQualifiedPropertiesToContext({ data }) {
            data = data.map((element) => {
                return walkObject({
                    obj: element,
                    func: extractQualifiedProperties,
                });
            });
            return data;

            function extractQualifiedProperties({ obj, level }) {
                for (let property of Object.keys(obj)) {
                    if (isUrl(property)) {
                        const propertyName = property.split("/").pop();
                        context[propertyName] = property;
                        obj[propertyName] = cloneDeep(obj[property]);
                        delete obj[property];
                    }
                    // console.log(obj);
                }
                return obj;
            }
        }

        /*
         * Extract and write any local property definitions to the crate
         */
        function writeLocalProfileDefinitions({ data }) {
            data = data.map((element) => {
                return walkObject({
                    obj: element,
                    func: extractDefinitions,
                });
            });
            return data;

            function extractDefinitions({ obj, level }) {
                let inputs = [];
                if (has(typeDefinitions, obj["@type"])) {
                    inputs = typeDefinitions[obj["@type"]].inputs;
                } else {
                    inputs = profileInputs;
                }
                if (inputs && inputs.length) {
                    for (let property of Object.keys(obj)) {
                        const input = inputs.filter(
                            (i) => i.property === property
                        )[0];
                        if (input && input.definition) {
                            context[property] = input.definition["@id"];
                            definitions.push(input.definition);
                        }
                    }
                }
                return obj;
            }
        }

        /*
         * Map types defined in the type definitions
         *
         * Map @type: GeoBox -> @type: ['GeoShape', 'Describo:GeoBox']
         */
        function mapTypeDefinitions({ data }) {
            data = data.map((item) => {
                const def = typeDefinitions[item["@type"]];
                if (def?.metadata?.mapToType) {
                    item["@type"] = [
                        def.metadata.mapToType,
                        `Describo:${item["@type"]}`,
                    ];
                }
                return item;
            });
            return data;
        }
    }

    getCrateMetadataFileDescriptor() {
        return {
            "@id": "ro-crate-metadata.json",
            "@type": "CreativeWork",
            about: {
                "@id": "./",
            },
            identifier: "ro-crate-metadata.json",
            conformsTo: {
                "@id": "https://w3id.org/ro/crate/1.0",
            },
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

    verify({ data }) {
        const skipChecks = ["CreativeWork", "CreateAction"];
        const elementsById = groupBy(data, "uuid");
        // console.log(JSON.stringify(elementsById, null, 2));
        let errors = [];
        for (let item of data) {
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

            // walk all items and make sure all references resolve
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

        // verify no two items have the same name and type
        let itemsGroupedByNameAndType = groupBy(
            data,
            (item) => `${item["@type"]}${item.name}`
        );
        Object.keys(itemsGroupedByNameAndType).forEach((key) => {
            if (itemsGroupedByNameAndType[key].length > 1) {
                let item = itemsGroupedByNameAndType[key][0];
                errors.push(
                    `There are two items in this crate with type '${item["@type"]}' and name '${item.name}.'`
                );
            }
        });
        return { data, errors };
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
