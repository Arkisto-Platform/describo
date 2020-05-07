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
        <el-table
            :data="items"
            class="w-full"
            @row-click="throttledEditItem"
            row-class-name="cursor-pointer"
        >
            <el-table-column prop="name" label="Actions" width="80">
                <template slot-scope="scope">
                    <el-button
                        type="success"
                        @click="throttledEditItem(scope.row)"
                        size="small"
                    >
                        <i class="fas fa-edit"></i>
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="uuid" label="Identifier" width="600">
                <template slot-scope="scope">
                    <div class="bg-green-200 p-2 rounded-lg">
                        <div class="flex flex-col space-y-1">
                            <div class="text-gray-600 text-xs">
                                @id&nbsp;
                                {{ scope.row.uuid }}
                            </div>
                            <div class="text-gray-800 text-base">
                                {{ scope.row["@type"] }}:
                                {{ scope.row.name }}
                            </div>
                        </div>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { isEmpty, throttle } from "lodash";
export default {
    props: {
        type: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            throttledEditItem: throttle(this.editItem, 1000),
            item: {},
            profileInputs: [],
            enableRemove: false,
            total: undefined,
            pageSize: 10,
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
