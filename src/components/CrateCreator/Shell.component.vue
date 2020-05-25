<template>
    <div class="flex flex-col">
        <div v-if="error">
            <el-alert
                :title="error"
                type="error"
                effect="dark"
                :center="true"
                :closable="false"
            ></el-alert>
        </div>

        <root-dataset-selector-component
            v-if="showRootDatasetSelector"
            @load-selection="loadSelection"
        />
        <div v-else>
            <shell-controls-component @error="(e) => (error = e)" />
        </div>
        <!-- loading indicator -->
        <el-progress
            class="my-2"
            :percentage="percentageLoaded"
            v-if="percentageLoaded !== 0"
        ></el-progress>
        <!-- end: loading indicator -->

        <!-- tabs -->
        <el-tabs
            v-model="activeTab"
            :stretch="true"
            tab-position="left"
            class="mt-4 border-t-2 pt-4"
            v-if="ready && !showRootDatasetSelector"
        >
            <el-tab-pane label="Root Dataset" name="crate" class="m-2">
                <span
                    slot="label"
                    class="flex flex-row text-lg font-light"
                    :class="{
                        'text-blue-600 hover:text-orange-600':
                            activeTab !== 'crate',
                        'text-2xl text-orange-600': activeTab === 'crate',
                    }"
                >
                    <div class="mr-2 w-6 text-center">
                        <i class="fas fa-home"></i>
                    </div>
                    <div>
                        Root Dataset
                    </div>
                </span>
                <root-dataset-component v-if="activeTab === 'crate'" />
            </el-tab-pane>

            <el-tab-pane label="Crate Contents" name="parts">
                <span
                    slot="label"
                    class="flex flex-row text-lg font-light"
                    :class="{
                        'text-blue-600 hover:text-orange-600':
                            activeTab !== 'parts',
                        'text-2xl text-orange-600': activeTab === 'parts',
                    }"
                >
                    <div class="mr-2 w-6 text-center">
                        <i class="fas fa-archive"></i>
                    </div>
                    <div>
                        Crate Contents
                    </div>
                </span>
                <crate-parts-component v-if="activeTab === 'parts'" />
            </el-tab-pane>

            <el-tab-pane
                :label="type"
                :name="type"
                v-for="type of types"
                :key="type"
            >
                <span slot="label" class="text-lg text-gray-700 font-light">
                    <shell-tab-label-component
                        :type="type"
                        :selected="activeTab === type"
                    />
                </span>
                <type-management-component
                    :type="type"
                    v-if="activeTab === type"
                />
            </el-tab-pane>
        </el-tabs>
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
import { generateId } from "components/CrateCreator/tools";
import RootDatasetComponent from "./RootDataset/Shell.component.vue";
import CratePartsComponent from "./CrateParts/Shell.component.vue";
import TypeManagementComponent from "./TypeManagement/Shell.component.vue";
import RootDatasetSelectorComponent from "./shared/RootDatasetSelector.component.vue";
import ShellControlsComponent from "./ShellControls.component.vue";
import ShellTabLabelComponent from "./ShellTabLabel.component.vue";
import CrateTool from "components/CrateCreator/crate-tools";

export default {
    components: {
        RootDatasetComponent,
        CratePartsComponent,
        TypeManagementComponent,
        RootDatasetSelectorComponent,
        ShellControlsComponent,
        ShellTabLabelComponent,
    },
    data() {
        return {
            rootDatasetProfile: {},
            showRootDatasetSelector: false,
            activeTab: "crate",
            ready: false,
            error: undefined,
            crateLoadingErrors: [],
            percentageLoaded: 0,
        };
    },
    computed: {
        types: function() {
            return Object.keys(this.$store.state.itemsByType)
                .filter((t) => t !== "RootDataset")
                .sort();
        },
    },
    beforeMount() {
        this.loadProfile();
    },
    methods: {
        async loadProfile() {
            const DatasetTypes = Object.keys(this.$store.state.profile.items);
            if (DatasetTypes.length > 1) {
                this.showRootDatasetSelector = true;
            } else {
                const selection = DatasetTypes.pop();
                this.loadSelection(selection);
            }
        },
        async loadSelection(selection) {
            if (!selection) return;
            this.$store.commit("reset");
            this.$store.commit("setActiveProfileType", selection);

            let rootDatasetName = {};
            const crateTool = new CrateTool();
            let data, errors;
            try {
                ({ data, errors } = await crateTool.readCrate({
                    target: this.$store.state.target,
                }));
            } catch (error) {
                console.log(error);
            }
            if (data) {
                errors = await this.loadCrateDataIntoStore({
                    data,
                    errors,
                });
                this.crateLoadingErrors = [...errors];
            } else {
                let rootDataset = {
                    uuid: generateId(),
                    "@type": "RootDataset",
                };
                this.$store.commit("saveToGraph", rootDataset);
            }
            this.showRootDatasetSelector = false;
            this.ready = true;
        },
        async loadCrateDataIntoStore({ data, errors }) {
            const updateProgress = data.length > 10;
            const dataLength = data.length;
            for (let [idx, element] of data.entries()) {
                if (updateProgress && idx % 10 === 0) {
                    this.percentageLoaded = round((idx / dataLength) * 100);
                }
                await new Promise((resolve) => setTimeout(resolve, 5));
                try {
                    this.$store.commit("saveToGraph", element);
                } catch (error) {
                    errors.push(`${error.message}: ${JSON.stringify(element)}`);
                }
            }
            this.percentageLoaded = 0;
            return errors;
        },
    },
};
</script>

<style lang="scss" scoped></style>
