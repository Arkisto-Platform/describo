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
                        @click="dataInspector = true"
                        type="primary"
                        size="small"
                    >
                        <i class="fas fa-eye"></i> inspect the data
                    </el-button>
                    <div class="flex-grow"></div>
                    <el-button
                        @click="crateExport = true"
                        type="success"
                        size="small"
                    >
                        <i class="fas fa-upload"></i>
                        export crate
                    </el-button>
                </div>
            </div>
            <data-inspector-component
                :drawer="dataInspector"
                @close="dataInspector = false"
            />
            <crate-export-component
                :drawer="crateExport"
                @close="crateExport = false"
            />
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
                <el-tab-pane label="Contents" name="parts">
                    <crate-parts-component v-if="activeTab === 'parts'" />
                </el-tab-pane>
                <el-tab-pane label="People" name="people">
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
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import { cloneDeep, isObject, isPlainObject, isArray } from "lodash";
import { generateId } from "components/CrateCreator/tools";
import ProfileLoader from "./profile-loader";
import RootDatasetComponent from "./SectionComponents/RootDataset/Shell.component.vue";
import CratePartsComponent from "./SectionComponents/CrateParts/Shell.component.vue";
import RootDatasetSelectorComponent from "./SectionComponents/RootDatasetSelector.component.vue";
import TypeManagementComponent from "./SectionComponents/TypeManagement/Shell.component.vue";
import DataInspectorComponent from "./SectionComponents/DataInspector.component.vue";
import CrateExportComponent from "./SectionComponents/CrateExport/CrateExport.component.vue";
import CrateTool from "components/CrateCreator/crate-tools";

export default {
    components: {
        RootDatasetComponent,
        CratePartsComponent,
        TypeManagementComponent,
        RootDatasetSelectorComponent,
        DataInspectorComponent,
        CrateExportComponent,
    },
    data() {
        return {
            dataInspector: false,
            crateExport: false,
            rootDatasetProfile: {},
            showRootDatasetSelector: false,
            activeTab: "crate",
            ready: false,
            error: undefined,
        };
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
                const crate = await crateTool.readCrate({
                    target: this.$store.state.target,
                });
                if (crate) {
                    crate.forEach((element) => {
                        this.$store.commit("saveToGraph", element);
                    });
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
    },
};
</script>

<style lang="scss" scoped>
.set-tab-height {
    height: calc(100vh - 270px);
}
</style>
