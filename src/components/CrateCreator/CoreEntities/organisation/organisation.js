import {
    linkParentAndItem,
    unlinkParentAndItem,
} from "components/CrateCreator/tools";
import { cloneDeep } from "lodash";

export const properties = {
    uuid: undefined,
    name: undefined,
    description: undefined,
};

export function save({ store, parentId, property, organisation }) {
    let item = store.getters.getItemById(organisation.uuid);
    if (item) {
        organisation = {
            ...item,
            name: organisation.name,
            description: organisation.description,
        };
    } else {
        organisation = {
            uuid: organisation.uuid,
            "@type": "Organisation",
            name: organisation.name,
            description: organisation.description,
        };
    }
    store.commit("saveToGraph", organisation);
    linkParentAndItem({
        store,
        parentId: parentId,
        itemId: organisation.uuid,
        property: property,
    });
}

export function restore({ store, uuid }) {
    const organisation = store.getters.getItemById(uuid);
    const props = cloneDeep(properties);
    if (organisation) {
        props.uuid = organisation.uuid;
        props.name = organisation.name;
        props.description = organisation.description;
        props["@reverse"] = organisation["@reverse"];
        return props;
    } else {
        props.uuid = uuid;
        return props;
    }
}

export function remove({ store, parentId, property, organisation }) {
    if (!organisation) return;

    // load the item so we get a complete internal state
    organisation = store.getters.getItemById(organisation.uuid);
    // console.log(JSON.stringify(organisation, null, 2));

    if (!organisation) return;
    unlinkParentAndItem({
        store,
        parentId,
        itemId: organisation.uuid,
        property,
    });

    // remove it
    store.commit("removeFromGraph", organisation);
}
