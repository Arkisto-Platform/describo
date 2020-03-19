<template>
    <div class="flex flex-col">
        <div class="flex flex-row">
            <div class="mr-2 pt-1">Select a profile definition:</div>
            <el-select class="style-select" v-model="selection">
                <el-option
                    v-for="(item, idx) in rootDatasetOptions"
                    :key="idx"
                    :label="item"
                    :value="item"
                ></el-option>
            </el-select>
            <div class="mx-4">
                <el-button type="success" @click="emitSelection">
                    <i class="fas fa-long-arrow-alt-right"></i>
                </el-button>
            </div>
        </div>
        <div class="my-2">About: {{selectionHelp}}</div>
    </div>
</template>

<script>
import ProfileLoader from "./profile-loader";

export default {
    data() {
        return {
            profile: undefined,
            selection: undefined,
            rootDatasetOptions: []
        };
    },
    computed: {
        selectionHelp: function() {
            if (this.profile && this.selection)
                return this.profile.RootDatasets[this.selection].metadata.about;
        }
    },
    async mounted() {
        const profileLoader = new ProfileLoader({
            name: this.$store.state.profile
        });
        const { profile } = await profileLoader.load();
        this.rootDatasetOptions = Object.keys(profile.RootDatasets);
        this.profile = profile;
    },
    methods: {
        emitSelection() {
            this.$emit("load-selection", this.selection);
        }
    }
};
</script>

<style lang="scss" scoped>
.style-select {
    width: 500px;
}
</style>
