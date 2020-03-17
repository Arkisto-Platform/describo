<template>
    <div class="flex flex-col">
        <el-button @click="loadProfile">reset</el-button>

        <el-tabs
            tab-position="left"
            :stretch="true"
            class="mt-4 border-t-2 pt-4"
            @tab-click="tab => (activeTab = tab.label)"
            v-if="ready"
        >
            <el-tab-pane
                label="RO-Crate Root Dataset"
                class="overflow-scroll set-tab-height m-2"
            >
                <root-dataset-component
                    :profile="profile"
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

export default {
    components: {
        RootDatasetComponent
    },
    data() {
        return {
            profile: {},
            dataTypes: [],
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
            this.profile = cloneDeep(profile);
            this.dataTypes = Object.keys(this.profile.DataTypes);
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
