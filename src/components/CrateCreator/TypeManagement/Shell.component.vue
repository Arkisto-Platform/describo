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
            <el-table-column prop="uuid" label="">
                <template slot-scope="scope">
                    <div class="bg-green-200 p-2 rounded-lg">
                        <div class="flex flex-col space-y-1">
                            <render-item-information-component
                                :uuid="scope.row.uuid"
                            />
                        </div>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { isEmpty, throttle } from "lodash";
import RenderItemInformationComponent from "components/CrateCreator/shared/RenderItemInformation.component.vue";

export default {
    components: {
        RenderItemInformationComponent,
    },
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
