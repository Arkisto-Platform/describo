<template>
    <div class="style-tree-browser overflow-scroll">
        <el-tree :data="data" :props="props" lazy :load="loadNode"></el-tree>
    </div>
</template>

<script>
import { FileTreeLoader } from "./file-tree-loader";
import path from "path";

export default {
    props: {
        folder: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            ftloader: new FileTreeLoader({ target: "local" }),
            data: [
                {
                    path: this.folder,
                    children: []
                }
            ],
            props: {
                children: "children",
                label: "path",
                isLeaf: "isLeaf"
            }
        };
    },
    watch: {
        folder: function() {
            this.loadRootNode({ path: this.folder });
        }
    },
    methods: {
        async loadRootNode(node) {
            this.data = [
                {
                    path: this.folder,
                    children: []
                }
            ];
        },
        async loadNode(node, resolve) {
            const parent = node.parent ? node.parent : this.folder;
            let content;
            const nodeData = node.data.path ? node.data : node.data[0];
            if (nodeData.path === this.folder) {
                content = await this.ftloader.load(nodeData.path);
            } else {
                content = await this.ftloader.load(
                    path.join(nodeData.parent, nodeData.path)
                );
            }
            return node.level === 0
                ? resolve([content])
                : resolve(content.children);
        }
    }
};
</script>

<style lang="scss" scoped>
.style-tree-browser {
    height: 300px;
}
</style>
