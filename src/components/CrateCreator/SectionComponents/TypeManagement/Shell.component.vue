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
                width="320"
            ></el-table-column>
            <el-table-column prop="name" label="Name"></el-table-column>
            <el-table-column prop="name" label="Actions" width="180">
                <template slot-scope="scope">
                    <el-button type="success" @click="editEntity(scope.row)">
                        <i class="fas fa-edit"></i>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="mt-4">
            <render-item-component
                v-if="entity"
                class="m-1"
                :template="template"
                reference=""
                :data="entity"
                :mode="mode"
                @done="entity = undefined"
            />
        </div>
    </div>
</template>

<script>
import RenderItemComponent from "components/CrateCreator/SectionComponents/RenderItem.component.vue";

export default {
    props: {
        type: {
            type: String,
            required: true,
        },
    },
    components: {
        RenderItemComponent,
    },
    data() {
        return {
            entity: undefined,
            template: {},
            mode: {},
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
        editEntity(entity) {
            this.entity = entity;
            this.template = { "@type": entity["@type"] };
            this.mode = {
                disableDelete: true,
                visible: true,
                edit: true,
            };
        },
        currentChange(page) {
            this.page = page - 1;
        },
    },
};
</script>

<style lang="scss" scoped></style>
