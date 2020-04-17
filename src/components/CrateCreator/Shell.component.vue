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

        <div class="flex flex-col" v-if="!error">
            <!-- controls-->
            <div class="flex flex-row">
                <root-dataset-selector-component
                    v-if="showRootDatasetSelector"
                    :profile="profile"
                    @load-selection="loadSelection"
                />
                <div
                    class="flex flex-row w-full px-4"
                    v-if="!showRootDatasetSelector"
                >
                    <el-button
                        @click="view.dataInspector = true"
                        type="primary"
                        size="small"
                    >
                        <i class="fas fa-eye"></i> inspect the data
                    </el-button>
                    <el-button
                        @click="view.crateLoadingErrors = true"
                        type="warning"
                        size="small"
                        v-if="crateLoadingErrors.length"
                    >
                        <i class="fas fa-eye"></i>
                        crate loading errors
                    </el-button>
                    <div class="flex-grow"></div>
                    <el-button
                        @click="view.crateExport = true"
                        type="success"
                        size="small"
                    >
                        <i class="fas fa-upload"></i>
                        export crate
                    </el-button>
                </div>
            </div>

            <!-- data inspector drawer-->
            <data-inspector-component
                :drawer="view.dataInspector"
                @close="view.dataInspector = false"
            />

            <!-- crate export drawer -->
            <crate-export-component
                :drawer="view.crateExportDialog"
                @close="view.crateExport = false"
            />

            <!-- crate loading errors drawer -->
            <crate-loading-errors-component
                :drawer="view.crateLoadingErrors"
                :errors="crateLoadingErrors"
                @close="view.crateLoadingErrors = false"
            />

            <!-- loading indicator -->
            <el-progress
                class="my-2"
                :percentage="percentageLoaded"
                v-if="percentageLoaded !== 0"
            ></el-progress>

            <!-- tabs -->
            <el-tabs
                v-model="activeTab"
                tab-position="left"
                class="mt-4 border-t-2 pt-4"
                v-if="ready && !showRootDatasetSelector"
            >
                <el-tab-pane
                    label="RO-Crate Root Dataset"
                    name="crate"
                    class="m-2"
                >
                    <root-dataset-component v-if="activeTab === 'crate'" />
                </el-tab-pane>
                <el-tab-pane label="Crate Contents" name="parts">
                    <crate-parts-component v-if="activeTab === 'parts'" />
                </el-tab-pane>
                <!-- <el-tab-pane label="People" name="people">
                    <type-management-component
                        type="Person"
                        v-if="activeTab === 'people'"
                    />
                </el-tab-pane>
                <el-tab-pane label="Organisations" name="organisations">
                    <type-management-component
                        type="Organisation"
                        v-if="activeTab === 'organisations'"
                    />
                </el-tab-pane>
                <el-tab-pane label="Contact Points" name="contactPoints">
                    <type-management-component
                        type="ContactPoint"
                        v-if="activeTab === 'contactPoints'"
                    />
                </el-tab-pane> -->
                <el-tab-pane
                    :label="type"
                    :name="type"
                    v-for="(type, idx) of types"
                    :key="idx"
                >
                    <type-management-component
                        :type="type"
                        v-if="activeTab === type"
                    />
                </el-tab-pane>
            </el-tabs>
        </div>
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
import ProfileLoader from "./profile-loader";
import RootDatasetComponent from "./SectionComponents/RootDataset/Shell.component.vue";
import CratePartsComponent from "./SectionComponents/CrateParts/Shell.component.vue";
import RootDatasetSelectorComponent from "./SectionComponents/RootDatasetSelector.component.vue";
import TypeManagementComponent from "./SectionComponents/TypeManagement/Shell.component.vue";
import DataInspectorComponent from "./SectionComponents/DataInspector.component.vue";
import CrateExportComponent from "./SectionComponents/CrateExport/CrateExport.component.vue";
import CrateLoadingErrorsComponent from "./SectionComponents/CrateLoadingErrors.component.vue";
import CrateTool from "components/CrateCreator/crate-tools";

export default {
    components: {
        RootDatasetComponent,
        CratePartsComponent,
        TypeManagementComponent,
        RootDatasetSelectorComponent,
        DataInspectorComponent,
        CrateExportComponent,
        CrateLoadingErrorsComponent,
    },
    data() {
        return {
            view: {
                dataInspector: false,
                crateExportDialog: false,
                crateLoadingErrors: false,
            },
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
            this.$store.commit("reset");
            const profileLoader = new ProfileLoader({
                name: this.$store.state.profile,
            });
            const { profile } = await profileLoader.load();
            let { valid, errors } = profileLoader.verify();
            if (!valid) {
                this.error = `The profile is invalid and can't be loaded.`;
                return;
            }
            this.profile = cloneDeep(profile);
            const DatasetTypes = Object.keys(profile);
            if (DatasetTypes.length > 1) {
                this.showRootDatasetSelector = true;
            } else {
                const selection = DatasetTypes.pop();
                this.loadSelection(selection);
            }
        },
        async loadSelection(selection) {
            if (!selection) return;

            let rootDatasetName = {};
            const profile = cloneDeep(this.profile[selection]);
            this.$store.commit("saveProfileInputs", profile.inputs);

            try {
                const crateTool = new CrateTool();
                let { data, errors } = await crateTool.readCrate({
                    target: this.$store.state.target,
                });
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
            } catch (error) {
                this.error = error.message;
            }
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

<style lang="scss" scoped>
.set-tab-height {
    height: calc(100vh - 270px);
}
</style>
