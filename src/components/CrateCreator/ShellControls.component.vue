<template>
    <div class="flex flex-col">
        <!-- controls-->
        <div class="flex flex-row w-full px-4 space-x-2">
            <div>
                <el-button
                    type="success"
                    size="small"
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
                >
                    <i class="fas fa-eye"></i> inspect data
                </el-button>
            </div>

            <div>
                <el-button
                    @click="view.crateLoadingErrors = true"
                    type="warning"
                    size="small"
                    v-if="crateLoadingErrors.length"
                >
                    <i class="fas fa-eye"></i>
                    crate loading errors
                </el-button>
            </div>
            <div class="flex-grow"></div>
            <div>
                <el-button
                    @click="view.crateExportDialog = true"
                    type="success"
                    size="small"
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
import {
    cloneDeep,
    isObject,
    isPlainObject,
    isArray,
    groupBy,
    round,
} from "lodash";
import DataInspectorComponent from "./shared/DataInspector.component.vue";
import CrateExportComponent from "./CrateExport/CrateExport.component.vue";
import CrateLoadingErrorsComponent from "./shared/CrateLoadingErrors.component.vue";
import AddItemToCrateComponent from "./shared/AddItemToCrate.component.vue";

export default {
    props: {
        crateLoadingErrors: {
            type: Array,
            required: true,
        },
    },
    components: {
        DataInspectorComponent,
        CrateExportComponent,
        CrateLoadingErrorsComponent,
        AddItemToCrateComponent,
    },
    data() {
        return {
            view: {
                addItem: false,
                dataInspector: false,
                crateExportDialog: false,
                crateLoadingErrors: false,
            },
        };
    },
    methods: {},
};
</script>

<style lang="scss" scoped></style>
