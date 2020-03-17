import { generateId } from "components/CrateCreator/tools";
import { cloneDeep } from "lodash";

export const properties = {
    id: undefined,
    name: undefined,
    visible: true
};

export function save({ store, params }) {
    // params = params.reduce((map, obj) => ((map[obj.k] = obj.v), map), {});
    // const organisation = {
    //     "@id": params.id,
    //     "@type": "Organisation",
    //     name: params.name,
    //     identifier: params.identifierId
    // };
    // const identifier = {
    //     "@id": params.identifierId,
    //     "@type": "PropertyValue",
    //     name: params.idType,
    //     value: params.id
    // };
    // store.commit("saveToGraph", person);
    // store.commit("saveToGraph", identifier);
}

export function restore({ store, id }) {
    const organisation = cloneDeep(store.state.itemsById[id]);
    const props = cloneDeep(properties);
    if (organisation) {
        props.uuid = organisation.uuid;
        props.id = organisation["@id"];
        props.name = organisation.name;
        props.visible = false;
        return props;
    } else {
        props.uuid = id;
        props.visible = true;
        return props;
    }
}
