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
            :profile="profile"
            @load-selection="loadSelection"
        />
        <div v-else>
            <shell-controls-component
                :crate-loading-errors="crateLoadingErrors"
            />
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
            <el-tab-pane label="RO-Crate Root Dataset" name="crate" class="m-2">
                <root-dataset-component v-if="activeTab === 'crate'" />
            </el-tab-pane>
            <el-tab-pane label="Crate Contents" name="parts">
                <crate-parts-component v-if="activeTab === 'parts'" />
            </el-tab-pane>
            <el-tab-pane
                :label="type"
                :name="type"
                v-for="type of types"
                :key="type"
            >
                <span slot="label">
                    <span v-show="type === 'ContactPoint'">
                        <i class="fas fa-address-book"></i>
                    </span>
                    <span v-show="type === 'Person'">
                        <i class="fas fa-user"></i>
                    </span>
                    <span v-show="type === 'Organisation'">
                        <i class="fas fa-university"></i>
                    </span>
                    {{ type }}
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
import ProfileLoader from "./profile-loader";
import RootDatasetComponent from "./RootDataset/Shell.component.vue";
import CratePartsComponent from "./CrateParts/Shell.component.vue";
import TypeManagementComponent from "./TypeManagement/Shell.component.vue";
import RootDatasetSelectorComponent from "./shared/RootDatasetSelector.component.vue";
import ShellControlsComponent from "./ShellControls.component.vue";
import CrateTool from "components/CrateCreator/crate-tools";

export default {
    components: {
        RootDatasetComponent,
        CratePartsComponent,
        TypeManagementComponent,
        RootDatasetSelectorComponent,
        ShellControlsComponent,
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
        addNewItem: function() {
            const newItem = this.$store.state.addNewItem;
            return newItem;
        },
    },
    beforeMount() {
        this.loadProfile();
    },
    watch: {
        addNewItem: {
            handler: function() {
                if (this.addNewItem && this.addNewItem.itemId) {
                    this.view.addItem = true;
                }
            },
            deep: true,
        },
    },
    methods: {
        async loadProfile() {
            this.$store.commit("reset");
            const profileLoader = new ProfileLoader({
                name: this.$store.state.profile,
            });

            // load the profile
            const { profile } = await profileLoader.load();

            // get and store the type definitions
            const typeDefinitions = await profileLoader.loadTypeDefinitions();
            this.$store.commit("saveTypeDefinitions", typeDefinitions);

            // verify the profile
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
            this.$store.commit("saveProfileInputs", profile);

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

<style lang="scss" scoped>
.set-tab-height {
    height: calc(100vh - 270px);
}
</style>
