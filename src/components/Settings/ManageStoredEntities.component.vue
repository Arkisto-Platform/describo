<template>
    <div class="flex flex-col">
        <div class="flex flex-row space-x-2">
            <el-select
                class="w-64"
                v-model="type"
                placeholder="Filter results by @type"
                @change="loadItems"
                :clearable="true"
            >
                <el-option
                    v-for="item in options"
                    :key="item"
                    :label="item"
                    :value="item"
                >
                </el-option>
            </el-select>
            <el-input
                class="w-64"
                placeholder="Filter names matching"
                v-model="filter"
                :clearable="true"
                @input="loadItems"
                @change="loadItems"
            ></el-input>
            <div class="flex-grow"></div>
            <el-pagination
                layout="prev, pager, next"
                :page-size="pageSize"
                :total="total"
                @current-change="currentChange"
            >
            </el-pagination>
        </div>
        <el-table :data="items" size="medium">
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
            <el-table-column prop="@id" label="@id" width="350">
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
            total: undefined,
            page: 0,
            pageSize: 10,
            items: [],
            type: undefined,
            filter: undefined,
            options: [],
        };
    },
    mounted() {
        this.loadItems();
        this.loadLocalTypes();
    },
    methods: {
        async loadLocalTypes() {
            const database = this.$store.state.database;
            if (!database) {
                setTimeout(() => {
                    this.loadItems();
                }, 2000);
                return;
            }
            this.options = await database.getTypes({ local: true });
        },
        async loadItems(page) {
            const database = this.$store.state.database;
            if (!database) {
                setTimeout(() => {
                    this.loadItems();
                }, 2000);
                return;
            }
            const results = await database.listLocalItems({
                offset: this.page * this.pageSize,
                limit: this.pageSize,
                "@type": this.type,
                filter: this.filter,
            });
            this.total = results.total;
            this.items = [...results.items];
        },
        async deleteItem(item) {
            const database = this.$store.state.database;
            await database.remove({ "@id": item["@id"] });
            this.loadItems();
        },
        currentChange(page) {
            this.page = page - 1;
            this.loadItems();
        },
    },
};
</script>
