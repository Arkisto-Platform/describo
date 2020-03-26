<template>
    <div class="flex flex-row">
        <div class="flex flex-col w-3/4">
            <div class="my-2 pb-2 border-b-2" v-if="enableFileSelector">
                <el-checkbox v-model="selectAllChildren"
                    >Select all children</el-checkbox
                >
            </div>

            <el-tree
                ref="tree"
                :data="data"
                :props="props"
                lazy
                node-key="name"
                :load="loadNode"
                :show-checkbox="enableFileSelector"
                :check-strictly="!selectAllChildren"
                :default-checked-keys="checkedNodes"
                :default-expanded-keys="defaultExpandedKeys"
                :default-expand-all="true"
            ></el-tree>
        </div>
        <div class="mx-2" v-if="enableFileSelector">
            <el-button @click="addParts" type="success">
                add selections
                <i class="fas fa-long-arrow-alt-right"></i>
            </el-button>
        </div>
    </div>
</template>

<script>
import FileTreeLoader from "./file-tree-loader";
import path from "path";
import { flattenDeep, uniq, compact } from "lodash";

export default {
    props: {
        browseTarget: {
            type: Object
        },
        enableFileSelector: {
            type: Boolean
        },
        checkedNodes: {
            type: Array
        }
    },
    data() {
        return {
            target: this.browseTarget || this.$store.state.target,
            ftloader: new FileTreeLoader({
                target: this.browseTarget || this.$store.state.target
            }),
            data: [
                {
                    path: "",
                    children: []
                }
            ],
            props: {
                children: "children",
                label: "path",
                isLeaf: "isLeaf"
            },
            defaultExpandedKeys: [],
            selectAllChildren: false
        };
    },
    methods: {
        async loadRootNode(node) {
            this.data = [
                {
                    path: this.folder
                }
            ];
        },
        async loadNode(node, resolve) {
            const nodePath = node.data.path || node.data[0].path;
            let content;
            if (!nodePath) {
                content = await this.ftloader.load({
                    path: this.target.folder,
                    root: this.target.folder
                });
                // this.defaultExpandedKeys = [content.path];
                resolve([content]);
            } else {
                const parentPath = node.parent.data.path || "";
                content = await this.ftloader.load({
                    root: this.target.folder,
                    path: path.join(parentPath, nodePath)
                });
                resolve(content.children || []);
            }
        },
        addParts() {
            let selectedNodes = this.$refs.tree.getCheckedNodes();
            selectedNodes = selectedNodes.filter(n => n.path !== this.target);
            selectedNodes = selectedNodes.map(node => [
                node.name,
                node.parent.split("/").pop()
            ]);
            selectedNodes = flattenDeep(selectedNodes);
            selectedNodes = uniq(selectedNodes);
            selectedNodes = compact(selectedNodes);
            selectedNodes = selectedNodes.map(
                node => this.$refs.tree.getNode(node).data
            );
            selectedNodes = selectedNodes.map(node => {
                return {
                    ...node,
                    uuid: path.join(node.parent, node.path)
                };
            });
            this.$emit("selected-nodes", selectedNodes);
        }
    }
};
</script>

<style lang="scss" scoped></style>
