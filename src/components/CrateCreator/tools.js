import { uniqBy, isEmpty, isPlainObject } from "lodash";

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

export function linkParentAndItem({ store, parentId, itemId, property }) {
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
        if (typeDefinition.length) {
            multiple = typeDefinition[0].multiple || multiple;
        }
    } else {
        typeDefinition = store.getters.getTypeDefinition(parent["@type"]);
        if (typeDefinition) {
            typeDefinition.inputs.filter((i) => i.property === property);
            if (typeDefinition.length) {
                multiple = typeDefinition[0].multiple || multiple;
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
        console.log("here");
        parent[property] = { uuid: itemId, "@type": item["@type"] };
    }

    // set up the reverse link from the item
    if (!item["@reverse"]) item["@reverse"] = {};
    if (!item["@reverse"][property]) item["@reverse"][property] = [];
    if (isPlainObject(item["@reverse"][property]))
        item["@reverse"][property] = [item["@reverse"][property]];
    item["@reverse"][property].push({ uuid: parentId });
    store.commit("saveToGraph", parent);
    store.commit("saveToGraph", item);
}

export function unlinkParentAndItem({ store, parentId, itemId, property }) {
    let item = store.getters.getItemById(itemId);
    let parent = store.getters.getItemById(parentId);

    // remove the parent from the item
    if (item && item["@reverse"] && item["@reverse"][property]) {
        if (isPlainObject(item["@reverse"][property]))
            item["@reverse"][property] = [item["@reverse"][property]];
        item["@reverse"][property] = item["@reverse"][property].filter((i) => {
            return i.uuid !== parentId;
        });
        if (!item["@reverse"][property].length)
            delete item["@reverse"][property];
        if (isEmpty(item["@reverse"])) delete item["@reverse"];
        store.commit("saveToGraph", item);
        store.commit("removeFromGraph", item);
    }

    // remove the item from the parent
    if (property && parent[property]) {
        if (isPlainObject(parent[property]))
            parent[property] = [parent[property]];

        parent[property] = parent[property].filter((i) => i.uuid !== itemId);
        if (isEmpty(parent[property])) delete parent[property];
        store.commit("saveToGraph", parent);
    }

    return;
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
