<template>
    <div class="flex flex-row">
        <div class="flex flex-col w-full">
            <div v-if="enableFileSelector">
                <el-button @click="addParts" type="success">
                    update crate content
                    <!-- <i class="fas fa-long-arrow-alt-right"></i> -->
                </el-button>
            </div>
            <div class="my-2 pb-2 border-b-2" v-if="enableFileSelector">
                <el-checkbox v-model="selectAllChildren"
                    >Select all children</el-checkbox
                >
                <div class="text-sm text-gray-600">
                    Note: you must expand each subfolder to load the children
                    when selecting all. Otherwise, you'll only get the folders.
                </div>
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
                ></el-tree>
            </div>
            <!-- :default-expand-all="true" -->
        </div>
    </div>
</template>

<script>
// import FileTreeLoader from "./file-tree-loader";
import Worker from "./file-tree.worker.js";
import path from "path";
import { flattenDeep, uniq, compact } from "lodash";

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
            target: this.browseTarget || this.$store.state.target,
            // ftloader: new FileTreeLoader({
            //     target: this.browseTarget || this.$store.state.target
            // }),
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
            selectAllChildren: true,
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
                const parentPath = node.parent.data.path || "";
                content = await new Promise((resolve) => {
                    const worker = new Worker();
                    worker.postMessage({
                        target: this.target,
                        root: this.target.folder,
                        path: path.join(parentPath, node.data.path),
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
            selectedNodes = selectedNodes.map((node) => [
                node.uuid,
                node.parent,
            ]);
            selectedNodes = flattenDeep(selectedNodes);
            selectedNodes = uniq(selectedNodes);
            selectedNodes = compact(selectedNodes);
            selectedNodes = selectedNodes.filter((n) => n != "/");
            selectedNodes = selectedNodes.map(
                (node) => this.$refs.tree.getNode(node).data
            );
            this.$emit("selected-nodes", selectedNodes);
        },
    },
};
</script>

<style lang="scss" scoped></style>
