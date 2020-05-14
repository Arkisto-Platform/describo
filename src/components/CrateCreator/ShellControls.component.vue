<template>
    <div class="flex flex-col">
        <!-- controls-->
        <div class="flex flex-row w-full px-4 space-x-2">
            <div>
                <el-button
                    type="success"
                    size="small"
                    class="focus:outline-none focus:border-2 focus:border-green-600"
                    @click="view.addItem = true"
                >
                    <i class="fas fa-plus"></i> add item
                </el-button>
            </div>
            <div>
                <el-button
                    @click="view.dataInspector = true"
                    type="primary"
                    size="small"
                    class="focus:outline-none focus:border-2 focus:border-blue-600"
                >
                    <i class="fas fa-eye"></i> inspect data
                </el-button>
            </div>

            <div>
                <el-button
                    @click="view.crateLoadingErrors = true"
                    type="warning"
                    size="small"
                    class="focus:outline-none focus:border-2 focus:border-orange-600"
                    v-if="crateLoadingErrors.length"
                >
                    <i class="fas fa-eye"></i>
                    crate loading errors
                </el-button>
            </div>
            <div class="border-l pl-2 border-black cursor-pointer">
                <el-button @click="toggleCrateWrite" size="mini">
                    <div
                        v-show="!enableWriteToDisk"
                        class="pointer text-red-600 text-xl"
                    >
                        <i class="far fa-save"></i>
                        DRAFT: your changes are not being saved!
                    </div>
                    <div
                        v-show="enableWriteToDisk"
                        class="cursor-pointer text-green-600 text-xl"
                    >
                        <i class="far fa-save"></i> saving enabled
                    </div>
                </el-button>
            </div>
            <div class="flex flex-row text-xl pt-1">
                <div v-show="saving" class="text-orange-600">
                    <i class="fas fa-save"></i> saving the crate
                </div>
                <div v-show="saved" class="text-green-600">
                    <i class="fas fa-check"></i> saved
                </div>
            </div>
            <div class="flex-grow"></div>
            <div>
                <el-button
                    @click="view.crateExportDialog = true"
                    type="success"
                    size="small"
                    class="focus:outline-none focus:border-2 focus:border-green-600"
                >
                    <i class="fas fa-upload"></i>
                    export
                </el-button>
            </div>
        </div>
        <!-- end: controls-->

        <!-- data inspector drawer-->
        <data-inspector-component
            :drawer="view.dataInspector"
            @close="view.dataInspector = false"
        />
        <!-- end: data inspector drawer-->

        <!-- crate export drawer -->
        <crate-export-component
            :drawer="view.crateExportDialog"
            @close="view.crateExportDialog = false"
        />
        <!-- end: crate export drawer -->

        <!-- crate loading errors drawer -->
        <crate-loading-errors-component
            :drawer="view.crateLoadingErrors"
            :errors="crateLoadingErrors"
            @close="view.crateLoadingErrors = false"
        />
        <!-- end: crate loading errors drawer -->

        <!-- add item to the crate drawer -->
        <add-item-to-crate-component
            :drawer="view.addItem"
            @close="view.addItem = false"
        />
        <!-- end: add item to the crate drawer -->
    </div>
</template>

<script>
import DataInspectorComponent from "./shared/DataInspector.component.vue";
import CrateExportComponent from "./CrateExport/CrateExport.component.vue";
import CrateLoadingErrorsComponent from "./shared/CrateLoadingErrors.component.vue";
import AddItemToCrateComponent from "./shared/AddItemToCrate.component.vue";
import CrateTool from "components/CrateCreator/crate-tools";
const crateTool = new CrateTool();
import { debounce } from "lodash";

export default {
    components: {
        DataInspectorComponent,
        CrateExportComponent,
        CrateLoadingErrorsComponent,
        AddItemToCrateComponent,
    },
    data() {
        return {
            debounceWriteToDisk: debounce(this.writeCrateToDisk, 1000),
            view: {
                addItem: false,
                dataInspector: false,
                crateExportDialog: false,
                crateLoadingErrors: false,
            },
            saved: false,
            saving: false,
            crateLoadingErrors: [],
        };
    },
    computed: {
        graph: function() {
            return this.$store.state.graph;
        },
        enableWriteToDisk: function() {
            return this.$store.state.enableWriteToDisk;
        },
    },
    watch: {
        "$store.state.graph": function() {
            this.debounceWriteToDisk();
        },
        "$store.state.addNewItem": {
            handler: function() {
                const item = this.$store.state.addNewItem;
                if (item && item.itemId) {
                    this.view.addItem = true;
                }
            },
            deep: true,
        },
    },
    methods: {
        toggleCrateWrite() {
            const current = this.$store.state.enableWriteToDisk;
            this.saving = false;
            this.saved = false;
            this.$store.commit("setWriteToDisk", !current);
            if (this.enableWriteToDisk) this.debounceWriteToDisk();
        },
        async writeCrateToDisk() {
            this.crateLoadingErrors = crateTool.verify({
                data: this.$store.state.graph,
            }).errors;
            if (!this.enableWriteToDisk) return;

            this.error = undefined;
            this.saved = false;
            this.saving = true;
            try {
                this.valid = crateTool.verifyCrate({
                    data: this.$store.state.graph,
                    inputs: this.$store.state.profileInputs.inputs,
                });
                crateTool.assembleCrate({ data: this.$store.state.graph });
                await crateTool.writeCrate({
                    target: this.$store.state.target,
                });
                await new Promise((resolve) => setTimeout(resolve, 1500));
                this.saving = false;
                this.saved = true;
                await new Promise((resolve) => setTimeout(resolve, 1500));
                this.saved = false;
            } catch (error) {
                this.error = {
                    title: "There was a problem saving the crate.",
                    description: error.message,
                };
                this.saving = false;
                this.saved = false;
                this.$emit("error", error);
            }
        },
    },
};
</script>

<style lang="scss" scoped></style>
