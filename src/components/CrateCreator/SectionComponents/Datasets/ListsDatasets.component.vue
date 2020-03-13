<template>
    <el-table :data="datasets" class="style-table">
        <el-table-column prop="" label="Actions" width="100">
            <template slot-scope="scope">
                <el-button type="primary" @click="editDataset(scope.row)">
                    <i class="fas fa-edit"></i>
                </el-button>
            </template>
        </el-table-column>
        <!-- <el-table-column prop="@id" label="@id" width="350">
            </el-table-column> -->
        <el-table-column prop="name" label="Name">
            <template slot-scope="scope">
                {{ scope.row.name }}
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    data() {
        return {};
    },
    computed: {
        datasets: function() {
            return this.$store.state.graph.filter(
                item => item["@type"] === "Dataset"
            );
        }
    },
    methods: {
        editDataset(dataset) {
            this.$emit("edit-dataset", dataset);
        }
    }
};
</script>

<style lang="scss" scoped>
.style-table {
    width: 1000px;
}
</style>
