<template>
    <div class="flex flex-row">
        <div class="flex flex-col w-full">
            <div class="my-2 pb-2 border-b-2" v-if="enableFileSelector">
                <div
                    class="text-lg text-gray-800 bg-yellow-200 text-center p-8"
                >
                    You must expand each subfolder to load the child nodes.
                    <br />If you don't you'll only get the folders.
                </div>
                <el-checkbox v-model="selectAllChildren"
                    >Select all children</el-checkbox
                >
            </div>
            <div class="overflow-scroll">
                <el-tree
                    ref="tree"
                    :props="props"
                    node-key="uuid"
                    :show-checkbox="enableFileSelector"
                    :check-strictly="!selectAllChildren"
                    :default-checked-keys="checkedNodes"
                    :default-expanded-keys="defaultExpandedKeys"
                    lazy
                    :load="loadNode"
                    @check="debouncedAddParts"
                ></el-tree>
            </div>
        </div>
    </div>
</template>

<script>
import Worker from "./file-tree.worker.js";
import path from "path";
import { flattenDeep, uniq, uniqBy, compact, debounce } from "lodash";

export default {
    props: {
        browseTarget: {
            type: Object,
        },
        enableFileSelector: {
            type: Boolean,
        },
        checkedNodes: {
            type: Array,
        },
    },
    data() {
        return {
            debouncedAddParts: debounce(this.addParts, 1000),
            target: this.browseTarget || this.$store.state.target,
            data: [
                {
                    path: "",
                    children: [],
                },
            ],
            props: {
                children: "children",
                label: "path",
                isLeaf: "isLeaf",
            },
            defaultExpandedKeys: [],
            selectAllChildren: false,
        };
    },
    methods: {
        async loadRootNode() {
            return await new Promise((resolve) => {
                const worker = new Worker();
                worker.postMessage({
                    target: this.target,
                    root: this.target.folder,
                    path: this.target.folder,
                    filterFiles: this.enableFileSelector,
                });
                worker.addEventListener("message", (m) => resolve(m.data));
            });
        },
        async loadNode(node, resolve) {
            let content;
            if (node.level === 0) {
                content = await this.loadRootNode();
                content.name = content.path;
                this.defaultExpandedKeys = [this.target.folder];
                return resolve([content]);
            } else if (node.level === 1) {
                return resolve(node.data.children);
            } else {
                const parentPath = node.parent.data.path;
                content = await new Promise((resolve) => {
                    const worker = new Worker();
                    worker.postMessage({
                        target: this.target,
                        root: this.target.folder,
                        path: path.join(this.target.folder, node.data.uuid),
                        filterFiles: this.enableFileSelector,
                    });
                    worker.addEventListener("message", (m) => resolve(m.data));
                });
                resolve(content.children || []);
            }
        },
        addParts() {
            let selectedNodes = this.$refs.tree.getCheckedNodes();
            selectedNodes = selectedNodes.filter((n) => n.path !== this.target);
            selectedNodes = selectedNodes.map((node) => node.uuid);
            selectedNodes = uniq(selectedNodes);
            selectedNodes = selectedNodes.filter((n) => n != "/");
            let nodes = [];

            selectedNodes.forEach((n) =>
                getNodeAndParent({ tree: this.$refs.tree, node: n })
            );
            nodes = flattenDeep(nodes);
            nodes = uniqBy(nodes, "uuid");
            this.$emit("selected-nodes", nodes);

            function getNodeAndParent({ tree, node }) {
                node = tree.getNode(node).data;
                nodes.push(node);
                if (node.parent !== "") {
                    let parent = tree.getNode(node.parent).data;
                    nodes.push(parent);
                    getNodeAndParent({ tree, node: parent });
                }
            }
        },
    },
};
</script>

<style lang="scss">
.el-tree-node__label {
    @apply text-lg text-gray-600 font-light;
}
</style>
