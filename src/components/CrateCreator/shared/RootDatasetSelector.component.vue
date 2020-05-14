<template>
    <div class="flex flex-col items-center w-full">
        <div class="flex flex-row py-10">
            <div class="mr-2 pt-1">Select a profile definition:</div>
            <el-select
                class="style-select"
                v-model="selection"
                size="small"
                clearable
            >
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
                    class="focus:outline-none focus:border-2 focus:border-blue-600"
                >
                    <i class="fas fa-long-arrow-alt-right"></i>
                </el-button>
            </div>
        </div>
        <div
            class="my-4 p-8 w-3/4 text-gray-800 text-center bg-yellow-200"
            v-if="selection"
        >
            {{ selectionHelp }}
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selection: undefined,
            rootDatasetOptions: [],
        };
    },
    computed: {
        selectionHelp: function() {
            return this.$store.state.profile.items[this.selection].metadata
                .about;
        },
    },
    async mounted() {
        this.rootDatasetOptions = Object.keys(this.$store.state.profile.items);
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
