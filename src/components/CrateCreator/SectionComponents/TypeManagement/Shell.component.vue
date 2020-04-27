<template>
    <div>
        <el-pagination
            v-if="total > pageSize + 1"
            layout="prev, pager, next"
            :page-size="pageSize"
            :total="total"
            @current-change="currentChange"
        >
        </el-pagination>
        <el-table :data="items" class="w-full">
            <el-table-column
                prop="uuid"
                label="Identifier"
                width="500"
            ></el-table-column>
            <el-table-column prop="name" label="Name"></el-table-column>
            <el-table-column prop="name" label="Actions" width="180">
                <template slot-scope="scope">
                    <el-button type="success" @click="editItem(scope.row)">
                        <i class="fas fa-edit"></i>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { isEmpty } from "lodash";
export default {
    props: {
        type: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            item: {},
            profileInputs: [],
            enableRemove: false,
            total: undefined,
            pageSize: 5,
            page: 0,
        };
    },
    computed: {
        items: function() {
            try {
                const items = this.$store.state.itemsByType[this.type];
                this.total = items.length;
                return items.slice(
                    this.page * this.pageSize,
                    this.page * this.pageSize + this.pageSize
                );
            } catch (error) {
                return [];
            }
        },
    },
    methods: {
        isCustomComponent(type) {
            return isCustomComponent(type);
        },
        editItem(item) {
            this.$store.commit("addNewItem", {
                itemId: item.uuid,
                parentId: undefined,
                property: undefined,
            });
        },
        currentChange(page) {
            this.page = page - 1;
        },
    },
};
</script>

<style lang="scss" scoped></style>
