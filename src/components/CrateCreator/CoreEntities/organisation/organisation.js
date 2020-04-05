import { generateId } from "components/CrateCreator/tools";
import { cloneDeep } from "lodash";
import { addReferenceToDataset, removeReferenceFromDataset } from "../helpers";

export const properties = {
    uuid: undefined,
    name: undefined,
    description: undefined
};

export function save({ store, reference, organisation }) {
    let item = store.getters.getItemById(organisation.uuid);
    if (item) {
        // overwrite existing item
        organisation = {
            ...item,
            name: organisation.name,
            description: organisation.description,
            "@reverse": reference.uuid
                ? {
                      [reference.property]: { uuid: reference.uuid }
                  }
                : organisation["@reverse"]
        };
        store.commit("saveToGraph", organisation);
        addReferenceToDataset({
            store,
            reference,
            uuid: item.uuid,
            type: "Organisation"
        });
    } else {
        // doesn't already exist - go ahead and create it
        createOrganisation({ store, reference, organisation });
        addReferenceToDataset({
            store,
            reference,
            uuid: organisation.uuid,
            type: "Organisation"
        });
    }

    function createOrganisation({ store, reference, organisation }) {
        const identifierId = generateId();

        // just go ahead and create it
        organisation = {
            uuid: organisation.uuid,
            "@type": "Organisation",
            name: organisation.name,
            description: organisation.description,
            identifier: identifierId,
            "@reverse": reference
                ? {
                      [reference.property]: { uuid: reference.uuid }
                  }
                : organisation["@reverse"]
        };
        store.commit("saveToGraph", organisation);

        const identifier = {
            uuid: identifierId,
            "@type": "PropertyValue",
            name: isRORIdentifier(organisation.uuid) ? "ROR" : "other",
            value: organisation.uuid
        };
        store.commit("saveToGraph", identifier);
    }
}

export function restore({ store, uuid }) {
    const organisation = store.getters.getItemById(uuid);
    const props = cloneDeep(properties);
    if (organisation) {
        props.mode = {
            visible: false,
            edit: false,
            create: false
        };
        props.uuid = organisation.uuid;
        props.name = organisation.name;
        props.description = organisation.description;
        props["@reverse"] = organisation["@reverse"];
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

export function remove({ store, reference, organisation }) {
    if (!organisation) return;

    // load the item so we get a complete internal state
    organisation = store.getters.getItemById(organisation.uuid);
    // console.log(JSON.stringify(organisation, null, 2));

    if (!organisation) return;
    // rewrite the reverse property based on this state
    organisation["@reverse"] = {
        [reference.property]: { uuid: reference.uuid }
    };

    // remove it
    store.commit("removeFromGraph", organisation);

    if (!store.state.itemsById[organisation.uuid]) {
        // go ahead and remove all related things
        store.commit("removeFromGraph", { uuid: organisation.identifier });
    }
    removeReferenceFromDataset({ store, reference, uuid: organisation.uuid });
}

function isRORIdentifier(value) {
    return value.match("https://ror.org");
}
