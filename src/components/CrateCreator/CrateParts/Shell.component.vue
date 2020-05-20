<template>
    <div class="flex flex-col">
        <el-tabs type="border-card" v-model="activeTab">
            <el-tab-pane label="Manage Content" name="manage">
                <file-tree-component
                    class="style-tree-component overflow-scroll"
                    :enable-file-selector="true"
                    :checked-nodes="checkedNodes"
                    @selected-nodes="addNodesToCrate"
                />
            </el-tab-pane>
            <el-tab-pane label="Describe Content" name="describe">
                <div class="flex flex-col">
                    <parts-list-component
                        :class="{ 'invisible h-0': selectedPart, 'h-full my-2 border-2 p-4': !selectedPart }"
                        @edit-part="editPart"
                    />
                    <dataset-component
                        :uuid="selectedPart.uuid"
                        @done="selectedPart = undefined"
                        v-if="
                            selectedPart && selectedPart['@type'] === 'Dataset'
                        "
                    />
                    <file-component
                        :uuid="selectedPart.uuid"
                        @done="selectedPart = undefined"
                        v-if="selectedPart && selectedPart['@type'] === 'File'"
                    />
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import FileTreeComponent from "components/FileTree/FileTree.component.vue";
import PartsListComponent from "./PartsList.component.vue";
import FileComponent from "components/CrateCreator/CoreComponents/simple/File.component.vue";
import DatasetComponent from "components/CrateCreator/CoreComponents/simple/Dataset.component.vue";
import CrateTool from "components/CrateCreator/crate-tools";
const crateTool = new CrateTool();

import { writeParts } from "./part-tools";

export default {
    components: {
        FileTreeComponent,
        PartsListComponent,
        FileComponent,
        DatasetComponent,
    },
    data() {
        return {
            activeTab: "manage",
            selectedPart: undefined,
        };
    },
    computed: {
        checkedNodes: function() {
            const state = this.$store.state.itemsByType;
            let parts = state.File ? state.File : [];
            parts = state.Dataset ? [...parts, ...state.Dataset] : parts;
            return parts.map((p) => p.uuid);
        },
    },
    methods: {
        addNodesToCrate(nodes) {
            writeParts({ store: this.$store, nodes });
        },
        editPart(part) {
            this.selectedPart = part;
        },
    },
};
</script>

<style lang="scss" scoped>
.style-tree-component {
    height: 600px;
}
</style>
