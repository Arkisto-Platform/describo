<template>
    <div>
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
                    <div class="text-lg gray-600">name:{{ item.name }}</div>
                    <div class="flex-grow"></div>
                    <div class="text-xs">id: {{ item["@id"] }}</div>
                </div>
            </el-option>
        </el-select>
        <div v-if="!entries || !entries.length">
            No {{ type }} entries available yet.
        </div>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            selection: undefined
        };
    },
    computed: {
        entries: function() {
            return this.$store.state.itemsByType[this.type];
        }
    },
    methods: {
        emitSelection() {
            const selection = this.entries.filter(
                e => e.uuid === this.selection
            )[0];
            this.$emit("selection", selection);
        }
    }
};
</script>

<style lang="scss" scoped></style>
