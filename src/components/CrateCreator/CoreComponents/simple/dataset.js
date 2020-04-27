import { generateId } from "components/CrateCreator/tools";
import { cloneDeep } from "lodash";

export const properties = {
    id: undefined,
    name: undefined,
    parent: undefined,
    dateModified: undefined
};

export function save({ store, dataset }) {
    store.commit("saveToGraph", dataset);
}

export function restore({ store, id }) {
    const dataset = cloneDeep(store.state.itemsById[id]);
    let props = cloneDeep(properties);
    if (dataset) {
        props = { ...props, ...dataset };
        return props;
    }
}
