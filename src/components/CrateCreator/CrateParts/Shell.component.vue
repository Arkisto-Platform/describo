<template>
    <div class="flex flex-col">
        <div class="flex flex-row my-2">
            <div v-show="saving" class="text-orange-600 pt-2">
                <i class="fas fa-save"></i> saving the crate
            </div>
            <div v-show="saved" class="text-green-600 pt-2">
                <i class="fas fa-check"></i> saved
            </div>
        </div>
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
                        class="my-2 border-2 p-4"
                        @edit-part="editPart"
                        v-if="!selectedPart"
                    />
                    <dataset-component
                        :uuid="selectedPart.uuid"
                        @done="writeCrateToDisk"
                        @cancel="selectedPart = undefined"
                        v-if="
                            selectedPart && selectedPart['@type'] === 'Dataset'
                        "
                    />
                    <file-component
                        :uuid="selectedPart.uuid"
                        @done="writeCrateToDisk"
                        @cancel="selectedPart = undefined"
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
            error: false,
            saved: false,
            saving: false,
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
            this.writeCrateToDisk();
        },
        writeCrateToDisk() {
            this.selectedPart = undefined;
            this.saved = false;
            this.saving = true;
            crateTool.assembleCrate({ data: this.$store.state.graph });
            crateTool.writeCrate({ target: this.$store.state.target });
            setTimeout(() => {
                this.saving = false;
                this.saved = true;
            }, 1000);
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
