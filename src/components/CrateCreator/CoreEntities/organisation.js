import { generateId } from "components/CrateCreator/tools";
import { cloneDeep } from "lodash";

export const properties = {
    id: undefined,
    idType: "ORCID",
    identifierId: undefined,
    name: undefined,
    visible: true
};

export function save({ store, params }) {
    params = params.reduce((map, obj) => ((map[obj.k] = obj.v), map), {});
    const person = {
        "@id": params.id,
        "@type": "Organisation",
        name: params.name,
        identifier: params.identifierId
    };

    const identifier = {
        "@id": params.identifierId,
        "@type": "PropertyValue",
        name: params.idType,
        value: params.id
    };
    store.commit("saveToGraph", person);
    store.commit("saveToGraph", identifier);
}

export function restore({ store, id }) {
    const organisation = cloneDeep(store.state.itemsById[id]);
    const props = cloneDeep(properties);
    if (person) {
        const identifier = cloneDeep(store.state.itemsById[person.identifier]);

        props.id = organisation["@id"];
        props.name = organisation.name;
        props.identifierId = identifier["@id"];
        props.idType = identifier.name;
        props.value = identifier.value;
        props.visible = false;
        console.log(JSON.stringify(props, null, 2));
        return props;
    } else {
        props.id = id;
        props.identifierId = generateId();
        props.visible = true;
        console.log(JSON.stringify(props, null, 2));
        return props;
    }
}
