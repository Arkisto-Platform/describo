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

    // remove existing files
    let files = store.getters.getItemsByType("File");
    files.forEach((file) => {
        unlinkItemFromParentAndChildren({
            store,
            parentId: file["@reverse"].hasPart[0].uuid,
            itemId: file.uuid,
            property: "hasPart",
        });
    });

    // remove existing datasets
    let datasets = store.getters.getItemsByType("Dataset");
    datasets.forEach((dataset) => {
        unlinkItemFromParentAndChildren({
            store,
            parentId: rootDataset.uuid,
            itemId: dataset.uuid,
            property: "hasPart",
        });
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
                dateModified: parseISO(node.modTime).toISOString(),
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
