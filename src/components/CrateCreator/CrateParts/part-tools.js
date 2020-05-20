import { generateId } from "components/CrateCreator/tools";
import path from "path";
import { parseISO } from "date-fns";
import { cloneDeep, compact, orderBy, groupBy } from "lodash";
import {
    linkItemToParent,
    unlinkItemFromParentAndChildren,
} from "components/CrateCreator/tools";

export function writeParts({ store, nodes }) {
    // get the root dataset
    const rootDataset = store.getters.getItemsByType("RootDataset")[0];
    const existingDatasetIds = nodes.filter((n) => n.isDir).map((n) => n.uuid);
    const existingFileIds = nodes.filter((n) => n.isLeaf).map((n) => n.uuid);

    // remove existing files if not in new set
    let files = store.getters.getItemsByType("File");
    files.forEach((file) => {
        if (!existingFileIds.includes(file.uuid) && "@reverse" in file) {
            for (let property of Object.keys(file["@reverse"])) {
                file["@reverse"][property].forEach((reference) => {
                    unlinkItemFromParentAndChildren({
                        store,
                        parentId: reference.uuid,
                        itemId: file.uuid,
                        property,
                    });
                });
            }
        }
    });

    // remove existing datasets if not in new set
    let datasets = store.getters.getItemsByType("Dataset");
    datasets.forEach((dataset) => {
        if (
            !existingDatasetIds.includes(dataset.uuid) &&
            "@reverse" in dataset
        ) {
            for (let property of Object.keys(dataset["@reverse"])) {
                dataset["@reverse"][property].forEach((reference) => {
                    unlinkItemFromParentAndChildren({
                        store,
                        parentId: reference.uuid,
                        itemId: dataset.uuid,
                        property,
                    });
                });
            }
        }
        if (
            !existingDatasetIds.includes(dataset.uuid) && !dataset['@reverse']
        ) {
            store.commit('removeFromGraph', dataset)
        }
    });

    // create and link datasets
    datasets = orderBy(
        nodes.filter((n) => n.isDir),
        "uuid"
    );
    createNodes({ store, nodes: datasets, rootDataset });

    // create and link files
    files = orderBy(
        nodes.filter((n) => n.isLeaf),
        "uuid"
    );
    createNodes({ store, nodes: files, rootDataset });

    function createNodes({ store, nodes, rootDataset }) {
        for (let node of nodes) {
            const parent = node.parent || rootDataset.uuid;
            node = {
                uuid: node.uuid,
                name: node.path,
                "@type": node.isDir ? "Dataset" : "File",
                dateModified: node.modTime
                    ? parseISO(node.modTime).toISOString()
                    : undefined,
            };
            store.commit("saveToGraph", node);
            linkItemToParent({
                store,
                parentId: parent,
                itemId: node.uuid,
                property: "hasPart",
            });
        }
    }
}
