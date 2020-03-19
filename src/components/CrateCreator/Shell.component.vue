<template>
    <div class="flex flex-col">
        <div class="flex flex-row">
            <root-dataset-selector-component
                v-if="showRootDatasetSelector"
                @load-selection="loadSelection"
            />
            <div class="flex-grow"></div>
            <div>
                <el-button @click="loadProfile" type="danger">
                    <i class="fas fa-trash-alt"></i> reset
                </el-button>
            </div>
        </div>
        <el-tabs
            tab-position="left"
            :stretch="true"
            class="mt-4 border-t-2 pt-4"
            @tab-click="tab => (activeTab = tab.label)"
            v-if="ready && !showRootDatasetSelector"
        >
            <el-tab-pane label="RO-Crate Root Dataset" class="overflow-scroll set-tab-height m-2">
                <root-dataset-component
                    :profile="rootDatasetProfile"
                    v-if="activeTab === 'RO-Crate Root Dataset'"
                ></root-dataset-component>
            </el-tab-pane>
            <el-tab-pane label="People"></el-tab-pane>
            <el-tab-pane label="Organisations"></el-tab-pane>
            <el-tab-pane label="Parts"></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { cloneDeep } from "lodash";
import ProfileLoader from "./profile-loader";
import RootDatasetComponent from "./SectionComponents/RootDataset/Shell.component.vue";
import RootDatasetSelectorComponent from "./RootDatasetSelector.component.vue";

export default {
    components: {
        RootDatasetComponent,
        RootDatasetSelectorComponent
    },
    data() {
        return {
            profile: {},
            rootDatasetProfile: {},
            showRootDatasetSelector: false,
            activeTab: "RO-Crate Root Dataset",
            ready: false
        };
    },
    beforeMount() {
        this.loadProfile();
    },
    methods: {
        async loadProfile() {
            const profileLoader = new ProfileLoader({
                name: this.$store.state.profile
            });
            const { profile } = await profileLoader.load();
            this.profile = profile;
            if (Object.keys(profile.RootDatasets).length > 1) {
                this.showRootDatasetSelector = true;
            } else {
                this.loadSelection();
            }
        },
        loadSelection(selection) {
            let rootDatasetName = {};
            let inputs = [];
            if (!selection) {
                selection = Object.keys(this.profile.RootDatasets).pop();
            }
            if (!selection) return;
            selection = this.profile.RootDatasets[selection];
            let profile = { ...selection };
            this.showRootDatasetSelector = false;
            this.rootDatasetProfile = cloneDeep(profile);
            this.ready = true;
            this.$store.commit("reset");
        }
    }
};
</script>

<style lang="scss" scoped>
.set-tab-height {
    height: calc(100vh - 400px);
}
</style>
