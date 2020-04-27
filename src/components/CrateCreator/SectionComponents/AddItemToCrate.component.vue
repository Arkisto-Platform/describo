<template>
    <el-drawer
        ref="drawer"
        :with-header="false"
        :visible="drawer"
        :destroy-on-close="true"
        direction="ltr"
        size="80%"
        @close="done"
    >
        <div class="flex flex-col bg-gray-200 p-4 h-full">
            <div v-if="!addNewItem">
                <div class="text-xl">Add an item to the crate.</div>
                <div class="my-2">
                    <!-- select item to add to crate -->
                    <el-select
                        v-model="type"
                        placeholder="Select an item type to add to the crate"
                        class="w-full"
                        @change="loadComponent"
                    >
                        <el-option
                            v-for="item in typeDefinitions"
                            :key="item"
                            :label="item"
                            :value="item"
                        >
                        </el-option>
                    </el-select>
                    <!-- end: select item to add to crate -->
                </div>

                <div v-if="item.uuid">
                    <div class="text-xl my-4">Add: {{ type }}</div>
                    <div class="overflow-scroll style-content-area">
                        <div class="flex flex-col">
                            <describe-item-component
                                :uuid="item.uuid"
                                :enable-remove="true"
                                v-if="item.uuid"
                                @save="done"
                                @remove="done"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="addNewItem">
                <div class="text-xl my-4">
                    Edit: {{ item["@type"] }} - {{ item.name }}
                </div>

                <div class="overflow-scroll style-content-area">
                    <div class="flex flex-col">
                        <describe-item-component
                            :uuid="item.uuid"
                            :enable-remove="enableRemove"
                            @save="done"
                            @remove="remove"
                        />
                    </div>
                    <!-- <pre>{{ addNewItem }}</pre> -->
                    <!-- <pre>{{ item }}</pre> -->
                </div>
            </div>
        </div>
    </el-drawer>
</template>

<script>
import DescribeItemComponent from "./DescribeItem.component.vue";
import {
    generateId,
    linkParentAndItem,
    unlinkParentAndItem,
} from "components/CrateCreator/tools";

export default {
    components: {
        DescribeItemComponent,
    },
    props: {
        drawer: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            type: undefined,
            profileInputs: [],
            item: {},
        };
    },
    computed: {
        enableRemove: function() {
            if (this.addNewItem) {
                return this.addNewItem.parentId ? true : false;
            } else {
                return true;
            }
        },
        typeDefinitions: function() {
            return Object.keys(this.$store.state.typeDefinitions).sort();
        },
        addNewItem: function() {
            const item = this.$store.state.addNewItem;
            if (item && item.itemId) {
                this.item = this.$store.getters.getItemById(item.itemId);
            }
            return item;
        },
    },
    methods: {
        loadComponent() {
            // by definition we're adding a new item - create it and commit it
            const item = {
                "@type": this.type,
                uuid: generateId(),
            };
            this.$store.commit("saveToGraph", item);

            this.item = item;
        },
        remove() {
            unlinkParentAndItem({
                store: this.$store,
                parentId: this.addNewItem.parentId,
                itemId: this.addNewItem.itemId,
                property: this.addNewItem.property,
            });
            this.$store.commit("removeFromGraph", {
                uuid: this.addNewItem.itemId,
            });
            this.$store.commit("addNewItem", undefined);
            this.$refs.drawer.closeDrawer();
        },
        done(drawerDoneHandler) {
            if (this.addNewItem && this.addNewItem.parentId) {
                linkParentAndItem({
                    store: this.$store,
                    parentId: this.addNewItem.parentId,
                    itemId: this.addNewItem.itemId,
                    property: this.addNewItem.property,
                });
            }
            this.item = {};
            this.type = undefined;
            this.$store.commit("addNewItem", undefined);
            this.$emit("close");
        },
    },
};
</script>

<style lang="scss" scoped>
.style-content-area {
    height: calc(100vh - 150px);
}
</style>
