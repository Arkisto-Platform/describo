import { uniqBy, isEmpty, isPlainObject, isArray, compact } from "lodash";

function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export function generateId() {
    return `#${uuidv4()}`;
}

export function getParams({ properties, reference }) {
    let params = Object.keys(properties).map((p) => {
        return { k: p, v: properties[p] };
    });
    params = params.reduce((map, obj) => ((map[obj.k] = obj.v), map), {});
    params.reference = reference;
    return params;
}

export function validateIdentifier(uuid) {
    if (
        !uuid.match(
            /^(http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i
        ) &&
        !uuid.match("^#.*")
    ) {
        id = `#${uuid}`;
    }
}

export function linkItemToParent({ store, parentId, itemId, property }) {
    let item = store.getters.getItemById(itemId);
    let parent = store.getters.getItemById(parentId);

    // look up the property def in the parent and figure out whether to
    //   add this as a multiple or single
    let multiple = true;
    let typeDefinition;
    if (parent["@type"] === "RootDataset") {
        typeDefinition = store.getters
            .getProfile()
            .filter((i) => i.property === property);
        if (typeDefinition.length && "multiple" in typeDefinition[0]) {
            multiple = typeDefinition[0].multiple;
        }
    } else {
        typeDefinition = store.getters.getTypeDefinition(parent["@type"]);
        if (typeDefinition) {
            typeDefinition.inputs.filter((i) => i.property === property);
            if (typeDefinition.length && "multiple" in typeDefinition[0]) {
                multiple = typeDefinition[0].multiple;
            }
        }
    }
    // set up the parent
    if (property && !parent[property]) parent[property] = [];
    if (multiple) {
        if (isPlainObject(parent[property])) {
            parent[property] = [parent[property]];
        }
        parent[property].push({ uuid: itemId, "@type": item["@type"] });
        parent[property] = uniqBy(parent[property], "uuid");
    } else {
        parent[property] = { uuid: itemId, "@type": item["@type"] };
    }

    // set up the reverse link from the item
    if (!item["@reverse"]) item["@reverse"] = {};
    if (!item["@reverse"][property]) item["@reverse"][property] = [];
    if (isPlainObject(item["@reverse"][property]))
        item["@reverse"][property] = [item["@reverse"][property]];
    item["@reverse"][property].push({ uuid: parentId });
    item["@reverse"][property] = uniqBy(item["@reverse"][property], "uuid");

    // commit the updated parent and item
    store.commit("saveToGraph", parent);
    store.commit("saveToGraph", item);
}

export function unlinkItemFromParentAndChildren({
    store,
    parentId,
    itemId,
    property,
}) {
    // console.log(JSON.stringify(store.state.graph, null, 2));
    let item = store.getters.getItemById(itemId);
    let parent = store.getters.getItemById(parentId);

    // remove the parent from the item
    if (item && item["@reverse"] && item["@reverse"][property]) {
        if (isPlainObject(item["@reverse"][property])) {
            // item["@reverse"][property] = [item["@reverse"][property]];
            delete item["@reverse"][property];
        } else {
            item["@reverse"][property] = item["@reverse"][property].filter(
                (i) => {
                    return i.uuid !== parentId;
                }
            );
        }
        if (isEmpty(item["@reverse"][property])) {
            delete item["@reverse"][property];
        }
        if (isEmpty(item["@reverse"])) delete item["@reverse"];

        // if the item is pointing to other items - children - remove it from them
        for (let key of Object.keys(item)) {
            if (key === "@reverse") continue;
            if (isPlainObject(item[key]) && "uuid" in item[key]) {
                const reference = store.getters.getItemById(item[key].uuid);
                reference["@reverse"][key] = reference["@reverse"][key].filter(
                    (i) => i.uuid !== item.uuid
                );
                store.commit("saveToGraph", reference);
                delete item[key];
            } else if (isArray(item[key])) {
                item[key] = item[key].map((element) => {
                    if (isPlainObject(element) && "uuid" in element) {
                        const reference = store.getters.getItemById(
                            element.uuid
                        );
                        reference["@reverse"][key] = reference["@reverse"][
                            key
                        ].filter((i) => i.uuid !== item.uuid);
                        store.commit("saveToGraph", reference);
                    } else {
                        return element;
                    }
                });
                item[key] = compact(item[key]);
                if (isEmpty(item[key])) delete item[key];
            }
        }

        store.commit("saveToGraph", item);
        try {
            store.commit("removeFromGraph", item);
        } catch (error) {
            // item still linked to something
        }
    }

    // remove the item from the parent
    if (property && parent[property]) {
        if (
            isPlainObject(parent[property]) &&
            parent[property].uuid === itemId
        ) {
            parent[property] = {};
        } else if (isArray(parent[property])) {
            parent[property] = parent[property].filter(
                (i) => i.uuid !== itemId
            );
        }
        if (isEmpty(parent[property])) delete parent[property];
        store.commit("saveToGraph", parent);
    }
    // console.log(JSON.stringify(store.state.graph, null, 2));

    return;
}
