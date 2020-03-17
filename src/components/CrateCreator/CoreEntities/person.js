import { generateId } from "components/CrateCreator/tools";
import { cloneDeep } from "lodash";

export const properties = {
    id: undefined,
    idType: "ORCID",
    identifierId: undefined,
    name: undefined
};

export function save({ store, params }) {
    const person = {
        uuid: params.uuid,
        "@id": params.id,
        "@type": "Person",
        name: params.name,
        identifier: params.identifierId,
        reference: [params.reference]
    };
    store.commit("saveToGraph", person);

    const identifier = {
        uuid: params.identifierId,
        "@id": params.identifierId,
        "@type": "PropertyValue",
        name: params.idType,
        value: params.id
    };
    store.commit("saveToGraph", identifier);
}

export function restore({ store, id }) {
    const person = cloneDeep(store.state.itemsById[id]);
    const props = cloneDeep(properties);
    if (person) {
        const identifier = cloneDeep(store.state.itemsById[person.identifier]);

        props.uuid = person.uuid;
        props.id = person["@id"];
        props.name = person.name;
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
    store.commit("removeFromGraph", {
        uuid: params.uuid,
        reference: params.reference
    });
    if (!store.state.itemsById[params.uuid]) {
        // go ahead and remove all related things
        store.commit("removeFromGraph", { uuid: params.identifierId });
    }
}
