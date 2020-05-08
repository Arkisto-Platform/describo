<template>
    <div class="flex flex-col items-center w-full">
        <div class="flex flex-row">
            <div class="mr-2 pt-1">Select a profile definition:</div>
            <el-select class="style-select" v-model="selection" size="small">
                <el-option
                    v-for="(item, idx) in rootDatasetOptions"
                    :key="idx"
                    :label="item"
                    :value="item"
                ></el-option>
            </el-select>
            <div class="mx-4">
                <el-button
                    type="primary"
                    @click="emitSelection"
                    :disabled="!selection"
                    size="small"
                >
                    <i class="fas fa-long-arrow-alt-right"></i>
                </el-button>
            </div>
        </div>
        <div
            class="my-4 p-8 w-3/4 text-gray-700 border-2 border-gray-200 text-center"
        >
            About: {{ selectionHelp }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        profile: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            selection: undefined,
            rootDatasetOptions: [],
        };
    },
    computed: {
        selectionHelp: function() {
            if (this.profile && this.selection)
                return this.profile[this.selection].metadata.about;
        },
    },
    async mounted() {
        this.rootDatasetOptions = Object.keys(this.profile);
    },
    methods: {
        emitSelection() {
            this.$emit("load-selection", this.selection);
        },
    },
};
</script>

<style lang="scss" scoped>
.style-select {
    width: 500px;
}
</style>
