import { generateId } from "components/CrateCreator/tools";
import { cloneDeep } from "lodash";
import { addReferenceToDataset, removeReferenceFromDataset } from "../helpers";

export const properties = {
    uuid: undefined,
    name: undefined,
};

export function save({ store, type, reference, item }) {
    let storeItem = store.getters.getItemById(item.uuid);
    if (storeItem) {
        // overwrite existing item
        item = {
            ...storeItem,
            name: item.name,
            "@reverse": reference.uuid
                ? {
                      [reference.property]: { uuid: reference.uuid },
                  }
                : item["@reverse"],
        };
        store.commit("saveToGraph", item);
        addReferenceToDataset({
            store,
            reference,
            uuid: item.uuid,
            type,
        });
    } else {
        // doesn't already exist - go ahead and create it
        let id = item.uuid;
        if (
            !item.uuid.match(
                /^(http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i
            ) &&
            !item.uuid.match("^#.*")
        ) {
            id = `#${item.uuid}`;
        }
        item.uuid = id;
        createItem({ store, reference, type, item });
        addReferenceToDataset({
            store,
            reference,
            uuid: item.uuid,
            type: type,
        });
    }

    function createItem({ store, reference, type, item }) {
        // just go ahead and create it
        item = {
            uuid: item.uuid,
            "@type": type,
            name: item.name,
            "@reverse": reference
                ? {
                      [reference.property]: { uuid: reference.uuid },
                  }
                : item["@reverse"],
        };
        store.commit("saveToGraph", item);
    }
}

export function restore({ store, uuid }) {
    const item = store.getters.getItemById(uuid);
    const props = cloneDeep(properties);
    if (item) {
        props.mode = {
            visible: false,
            edit: false,
            create: false,
        };
        props.uuid = item.uuid;
        props.name = item.name;
        props["@reverse"] = item["@reverse"];
        return props;
    } else {
        props.mode = {
            visible: true,
            edit: false,
            create: true,
        };
        props.uuid = uuid;
        return props;
    }
}

export function remove({ store, reference, item }) {
    // load the item so we get a complete internal state
    if (!item) return;
    item = store.getters.getItemById(item.uuid);
    // console.log(JSON.stringify(params, null, 2));

    if (!item) return;
    // rewrite the reverse property based on this state
    item["@reverse"] = {
        [reference.property]: { uuid: reference.uuid },
    };

    store.commit("removeFromGraph", item);
    removeReferenceFromDataset({ store, reference, uuid: item.uuid });
}
