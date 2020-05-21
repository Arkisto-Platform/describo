<template>
    <div class="flex flex-col">
        <el-pagination
            layout="prev, pager, next"
            :total="total"
            @current-change="loadItems"
        >
        </el-pagination>
        <el-table :data="items">
            <el-table-column label="" width="70">
                <template slot-scope="scope">
                    <el-button
                        type="danger"
                        @click="deleteItem(scope.row)"
                        size="small"
                    >
                        <i class="fas fa-trash-alt"></i>
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <pre>{{ scope.row }}</pre>
                </template>
            </el-table-column>
            <el-table-column prop="@id" label="@id" width="300">
            </el-table-column>
            <el-table-column prop="@type" label="@type" width="180">
            </el-table-column>
            <el-table-column prop="name" label="name"> </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            total: 0,
            page: 0,
            limit: 10,
            items: [],
        };
    },
    mounted() {
        this.loadItems();
    },
    methods: {
        async loadItems(page) {
            const database = this.$store.state.database;
            if (!database) {
                setTimeout(() => {
                    this.loadItems();
                }, 2000);
                return;
            }
            const results = await database.listLocalItems({
                offset: 0,
                limit: 10,
            });
            this.total = results.total;
            this.items = [...results.items];
        },
        async deleteItem(item) {
            const database = this.$store.state.database;
            await database.remove({ "@id": item["@id"] });
            this.loadItems();
        },
    },
};
</script>
