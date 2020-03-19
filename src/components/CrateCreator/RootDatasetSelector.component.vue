<template>
    <div>
        <el-select
            class="style-select"
            v-model="selection"
            placeholder="Select a root dataset to constuct"
            @change="emitSelection"
        >
            <el-option
                v-for="(item, idx) in rootDatasetOptions"
                :key="idx"
                :label="item"
                :value="item"
            ></el-option>
        </el-select>
    </div>
</template>

<script>
import ProfileLoader from "./profile-loader";

export default {
    data() {
        return {
            rootDatasetOptions: [],
            selection: undefined
        };
    },
    async mounted() {
        const profileLoader = new ProfileLoader({
            name: this.$store.state.profile
        });
        const { profile } = await profileLoader.load();
        this.rootDatasetOptions = Object.keys(profile.RootDatasets);
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
