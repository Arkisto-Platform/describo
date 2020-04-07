import { generateId } from "components/CrateCreator/tools";
import { cloneDeep } from "lodash";
import { addReferenceToDataset, removeReferenceFromDataset } from "../helpers";

export const properties = {
    uuid: undefined,
    name: undefined,
};

export function save({ store, reference, person }) {
    let item = store.getters.getItemById(person.uuid);
    if (item) {
        // overwrite existing item
        const identifierId = item.identifier;
        person = {
            ...item,
            name: person.name,
            "@reverse": reference.uuid
                ? {
                      [reference.property]: { uuid: reference.uuid },
                  }
                : person["@reverse"],
        };
        store.commit("saveToGraph", person);
        addReferenceToDataset({
            store,
            reference,
            uuid: item.uuid,
            type: "Person",
        });
    } else {
        // doesn't already exist - go ahead and create it
        let id = person.uuid;
        if (
            !person.uuid.match(
                /^(http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
            )
        ) {
            id = `#${person.uuid}`;
        }
        person.uuid = id;
        createPerson({ store, reference, person });
        addReferenceToDataset({
            store,
            reference,
            uuid: person.uuid,
            type: "Person",
        });
    }

    function createPerson({ store, reference, person }) {
        const identifierId = generateId();

        // just go ahead and create it
        person = {
            uuid: person.uuid,
            "@type": "Person",
            name: person.name,
            identifier: identifierId,
            "@reverse": reference
                ? {
                      [reference.property]: { uuid: reference.uuid },
                  }
                : person["@reverse"],
        };
        store.commit("saveToGraph", person);

        const identifier = {
            uuid: identifierId,
            "@type": "PropertyValue",
            name: "other",
            value: person.uuid,
        };
        store.commit("saveToGraph", identifier);
    }
}

export function restore({ store, uuid }) {
    const person = store.getters.getItemById(uuid);
    const props = cloneDeep(properties);
    if (person) {
        props.mode = {
            visible: false,
            edit: false,
            create: false,
        };
        props.uuid = person.uuid;
        props.name = person.name;
        props["@reverse"] = person["@reverse"];
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

export function remove({ store, reference, person }) {
    // load the item so we get a complete internal state
    if (!person) return;
    person = store.getters.getItemById(person.uuid);
    // console.log(JSON.stringify(params, null, 2));

    if (!person) return;
    // rewrite the reverse property based on this state
    person["@reverse"] = {
        [reference.property]: { uuid: reference.uuid },
    };

    store.commit("removeFromGraph", person);

    if (!store.state.itemsById[person.uuid]) {
        // go ahead and remove all related things
        store.commit("removeFromGraph", { uuid: person.identifier });
    }
    removeReferenceFromDataset({ store, reference, uuid: person.uuid });
}
