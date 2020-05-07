<template>
    <div class="flex flex-col">
        <div class="flex flex-row">
            <div class="flex flex-col">
                <el-input
                    placeholder="Filter items"
                    v-model="filterItems"
                ></el-input>
                <div class="text-sm text-gray-600">
                    This filter supports simple regular expressions.
                </div>
            </div>
            <div class="flex-grow"></div>
            <el-pagination
                v-if="total > pageSize"
                layout="prev, pager, next"
                :page-size="pageSize"
                :total="total"
                @current-change="currentChange"
            >
            </el-pagination>
        </div>

        <el-table :data="parts" class="cursor-pointer" @row-click="editPart">
            <el-table-column prop="" label="Actions" width="80">
                <template slot-scope="scope">
                    <el-button
                        type="success"
                        @click="editPart(scope.row)"
                        size="small"
                    >
                        <i class="fas fa-edit"></i>
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="uuid" label="Identifier" width="600">
                <template slot-scope="scope">
                    <div class="bg-green-200 px-2 py-1 rounded-lg">
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
            <el-table-column prop="" label="Type" width="80" align="center">
                <template slot-scope="scope" class="text-center">
                    <div
                        v-show="scope.row['@type'] === 'Dataset'"
                        class="text-center"
                    >
                        <i class="fas fa-folder fa-2x text-red-400"></i>
                    </div>
                    <div
                        v-show="scope.row['@type'] === 'File'"
                        class="text-center"
                    >
                        <i class="fas fa-file fa-2x text-green-400"></i>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { orderBy } from "lodash";
export default {
    data() {
        return {
            total: 0,
            page: 0,
            pageSize: 5,
            filterItems: undefined,
        };
    },
    computed: {
        parts: function() {
            const itemsByType = this.$store.state.itemsByType;
            let parts = itemsByType["File"] || [];
            parts = itemsByType["Dataset"]
                ? [...parts, ...itemsByType["Dataset"]]
                : parts;
            parts = parts.filter((part) => part.uuid.match(this.filterItems));
            this.total = parts.length;
            return orderBy(parts, ["@type", "uuid"]).slice(
                this.page * this.pageSize,
                this.page * this.pageSize + this.pageSize
            );
        },
    },
    methods: {
        editPart(part) {
            this.$emit("edit-part", part);
        },
        currentChange(page) {
            this.page = page - 1;
        },
    },
};
</script>
