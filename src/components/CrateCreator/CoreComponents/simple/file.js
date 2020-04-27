import { generateId } from "components/CrateCreator/tools";
import { cloneDeep } from "lodash";

export const properties = {
    id: undefined,
    name: undefined,
    description: undefined,
    parent: undefined,
    contentSize: undefined,
    dateModified: undefined
};

export function save({ store, file }) {
    store.commit("saveToGraph", file);
}

export function restore({ store, id }) {
    const file = cloneDeep(store.state.itemsById[id]);
    let props = cloneDeep(properties);
    if (file) {
        props = { ...props, ...file };
        return props;
    }
}
