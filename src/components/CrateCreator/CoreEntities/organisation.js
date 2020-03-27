import { generateId } from "components/CrateCreator/tools";
import { cloneDeep } from "lodash";

export const properties = {
    id: undefined,
    idType: "Research Organization Registry (ROR)",
    name: undefined,
    identifierId: undefined
};

export function save({ store, params }) {
    const organisation = {
        uuid: params.uuid,
        "@id": params.uuid,
        "@type": "Organisation",
        name: params.name,
        identifier: params.identifierId,
        "@reverse": {
            [params.reference.property]: { "@id": params.reference.id }
        }
    };
    store.commit("saveToGraph", organisation);

    const identifier = {
        uuid: params.identifierId,
        "@id": params.identifierId,
        "@type": "PropertyValue",
        name: "ROR",
        value: params.uuid
    };
    store.commit("saveToGraph", identifier);
}

export function restore({ store, id }) {
    const organisation = cloneDeep(store.state.itemsById[id]);
    const props = cloneDeep(properties);
    if (organisation) {
        const identifier = cloneDeep(
            store.state.itemsById[organisation.identifier]
        );
        props.uuid = organisation.uuid;
        props.id = organisation["@id"];
        props.name = organisation.name;
        props.identifierId = identifier["@id"];
        props.idType = identifier.name;
        props.value = identifier.value;
        props.visible = false;
        return props;
    } else {
        props.uuid = id;
        props.identifierId = generateId();
        props.visible = true;
        return props;
    }
}

export function remove({ store, params }) {
    params["@reverse"] = {
        [params.reference.property]: { "@id": params.reference.id }
    };
    store.commit("removeFromGraph", params);

    if (!store.state.itemsById[params.uuid]) {
        // go ahead and remove all related things
        store.commit("removeFromGraph", { uuid: params.identifierId });
    }
}
