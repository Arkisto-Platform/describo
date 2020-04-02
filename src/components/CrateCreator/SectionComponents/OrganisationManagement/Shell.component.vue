<template>
    <div>
        <el-table :data="organisations" class="w-full">
            <el-table-column
                prop="uuid"
                label="Identifier"
                width="320"
            ></el-table-column>
            <el-table-column prop="name" label="Name"></el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    computed: {
        organisations: function() {
            try {
                return this.$store.state.itemsByType.Organisation;
            } catch (error) {
                return [];
            }
        }
    }
};
</script>

<style lang="scss" scoped></style>
