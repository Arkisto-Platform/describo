import { generateId } from "components/CrateCreator/tools";
import path from "path";
import { parseISO } from "date-fns";
import { cloneDeep, compact } from "lodash";

export function writeParts({ store, nodes }) {
    // get the root dataset
    const rootDataset = cloneDeep(
        store.state.graph.filter(e => e["@type"] === "RootDataset")[0]
    );

    // remove existing parts
    if (rootDataset.hasPart) {
        rootDataset.hasPart.forEach(part =>
            store.commit("removeFromGraph", part)
        );
    }
    let files = store.state.graph.filter(e => e["@type"] === "File");
    files.forEach(file => store.commit("removeFromGraph", file));

    const target = store.state.target;
    let identifiers;
    switch (target.type) {
        case "local":
            identifiers = writeLocalFilesToGraph({
                store,
                folder: target.folder,
                nodes
            });
    }

    // get all datasets and tie them to the root dataset
    const datasets = cloneDeep(
        store.state.graph.filter(e => e["@type"] === "Dataset")
    );
    files = cloneDeep(store.state.graph.filter(e => e["@type"] === "File"));
    rootDataset.hasPart = datasets.map(d => {
        return {
            uuid: d.uuid
        };
    });
    store.commit("saveToGraph", rootDataset);

    datasets.forEach(dataset => {
        dataset.hasPart = files
            .filter(f => f.parent === dataset.uuid)
            .map(f => {
                return {
                    uuid: f.uuid
                };
            });
        store.commit("saveToGraph", dataset);
    });
}

function writeLocalFilesToGraph({ store, folder, nodes }) {
    let identifiers = nodes.map(node => {
        if (node.isLeaf) {
            node = {
                uuid: node.uuid,
                name: node.path,
                parent: node.parent,
                "@type": "File",
                contentSize: node.size,
                dateModified: parseISO(node.modTime).toISOString()
            };
            store.commit("saveToGraph", node);
            return node["@id"];
        } else if (node.isDir) {
            node = {
                uuid: node.uuid,
                name: node.path,
                parent: node.parent,
                "@type": "Dataset",
                dateModified: parseISO(node.modTime).toISOString(),
                hasPart: []
            };
            store.commit("saveToGraph", node);
            return node["@id"];
        }
    });
    return compact(identifiers);
}
