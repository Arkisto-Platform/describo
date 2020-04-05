import { uniqBy, isArray, isObject } from "lodash";

export function addReferenceToDataset({ store, reference, uuid, type }) {
    if (!reference.uuid) return;
    let dataset = store.getters.getItemById(reference.uuid);
    const property = reference.property;

    if (isArray(dataset[property])) {
        dataset[property].push({ uuid, "@type": type });
        dataset[property] = uniqBy(dataset[property], "uuid");
    } else if (!dataset[property]) {
        dataset[property] = [{ uuid, "@type": type }];
    }
    store.commit("saveToGraph", dataset);
}

export function removeReferenceFromDataset({ store, reference, uuid }) {
    if (!reference.uuid) return;
    let dataset = store.getters.getItemById(reference.uuid);
    const property = reference.property;

    if (isArray(dataset[property])) {
        dataset[property] = dataset[property].filter(i => i.uuid !== uuid);
        dataset[property] = uniqBy(dataset[property], "uuid");
    } else if (isObject(dataset[property])) {
        if (dataset[property].uuid === uuid) dataset[property] = {};
    }
    store.commit("saveToGraph", dataset);
}
