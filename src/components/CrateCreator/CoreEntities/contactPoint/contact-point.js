import { generateId } from "components/CrateCreator/tools";
import { cloneDeep } from "lodash";
import { addReferenceToDataset, removeReferenceFromDataset } from "../helpers";

export const properties = {
    uuid: undefined,
    name: undefined
};

export function save({ store, reference, contactPoint }) {
    // console.log(
    //     "save",
    //     JSON.stringify(reference, null, 2),
    //     JSON.stringify(contactPoint, null, 2)
    // );
    let item = store.getters.getItemById(contactPoint.uuid);
    if (item) {
        // overwrite existing item
        contactPoint = {
            ...item,
            name: contactPoint.name,
            email: contactPoint.email,
            identifier: contactPoint.email,
            url: contactPoint.url,
            "@reverse": reference.uuid
                ? {
                      [reference.property]: { uuid: reference.uuid }
                  }
                : contactPoint["@reverse"]
        };
        store.commit("saveToGraph", contactPoint);
        addReferenceToDataset({
            store,
            reference,
            uuid: contactPoint.uuid,
            type: "ContactPoint"
        });
    } else {
        // doesn't already exist - go ahead and create it
        // just go ahead and create it
        contactPoint = {
            uuid: contactPoint.email,
            "@type": "ContactPoint",
            contactType: "customer service",
            email: contactPoint.email,
            name: contactPoint.name,
            identifier: contactPoint.email,
            url: contactPoint.url,
            "@reverse": reference
                ? {
                      [reference.property]: { uuid: reference.uuid }
                  }
                : contactPoint["@reverse"]
        };
        store.commit("saveToGraph", contactPoint);
        addReferenceToDataset({
            store,
            reference,
            uuid: contactPoint.uuid,
            type: "ContactPoint"
        });
    }
}

export function restore({ store, uuid }) {
    // console.log("restore", JSON.stringify(uuid, null, 2));
    const contactPoint = store.getters.getItemById(uuid);
    let props = cloneDeep(properties);
    if (contactPoint) {
        props.mode = {
            visible: false,
            edit: false,
            create: false
        };
        props = { ...props, ...contactPoint };
        return props;
    } else {
        props.mode = {
            visible: true,
            edit: false,
            create: true
        };
        props.uuid = uuid;
        return props;
    }
}

export function remove({ store, reference, contactPoint }) {
    // console.log(
    //     "remove",
    //     JSON.stringify(reference, null, 2),
    //     JSON.stringify(contactPoint, null, 2)
    // );
    // load the item so we get a complete internal state
    if (!contactPoint) return;
    contactPoint = store.getters.getItemById(contactPoint.uuid);
    // console.log(JSON.stringify(params, null, 2));

    if (!contactPoint) return;
    // rewrite the reverse property based on this state
    contactPoint["@reverse"] = {
        [reference.property]: { uuid: reference.uuid }
    };

    store.commit("removeFromGraph", contactPoint);
    removeReferenceFromDataset({ store, reference, uuid: contactPoint.uuid });
}
