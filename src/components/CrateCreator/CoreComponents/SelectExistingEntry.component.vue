<template>
    <div class="flex flex-col my-4">
        <div class="text-sm text-gray-600">
            Select a {{ type.toLowerCase() }} that is a part of this crate.
        </div>
        <el-select
            v-model="selection"
            placeholder="Select"
            class="w-full"
            @change="emitSelection"
            v-if="entries && entries.length"
        >
            <el-option
                v-for="item in entries"
                :key="item.uuid"
                :label="item.name"
                :value="item.uuid"
            >
                <div class="flex flex-row">
                    <div class="text-lg gray-600">{{ item.name }}</div>
                    <div class="flex-grow"></div>
                    <div class="text-xs">id: {{ item.uuid }}</div>
                </div>
            </el-option>
        </el-select>
        <div
            v-if="!entries || !entries.length"
            class="text-gray-800 font-light"
        >
            No entries of type '{{ type }}' available yet.
        </div>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            selection: undefined,
        };
    },
    computed: {
        entries: function() {
            return this.$store.state.itemsByType[this.type];
        },
    },
    methods: {
        emitSelection() {
            const selection = this.entries.filter(
                (e) => e.uuid === this.selection
            )[0];
            this.$emit("selection", selection);
        },
    },
};
</script>

<style lang="scss" scoped></style>
