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
                        :filterable="true"
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
            </div>

            <div v-if="addNewItem">
                <div class="text-xl my-4">
                    Edit: {{ item["@type"] }} - {{ item.name }}
                </div>

                <div class="overflow-scroll style-content-area flex flex-col">
                    <div v-if="customComponent">
                        <component
                            class="flex-grow"
                            v-bind:is="customComponent"
                            :uuid="item.uuid"
                            :enable-remove="enableRemove"
                            @save="done"
                            @remove="remove"
                        ></component>
                    </div>
                    <div v-else class="flex flex-col">
                        <render-profile-component
                            :uuid="item.uuid"
                            @link-item="linkItem"
                        />
                        <div class="flex flex-row mt-1">
                            <el-button
                                @click="remove()"
                                type="danger"
                                class="ml-1"
                                v-if="enableRemove"
                            >
                                <i class="fas fa-trash-alt"></i>
                            </el-button>
                            <div class="flex flex-grow"></div>
                            <el-button
                                @click="done()"
                                type="success"
                                size="small"
                                :disabled="item && !item.name"
                            >
                                <i class="fas fa-check"></i>&nbsp;save
                            </el-button>
                        </div>
                    </div>
                    <render-profile-reverse-component
                        :uuid="item.uuid"
                        class="mt-8"
                    />
                </div>
            </div>
        </div>
    </el-drawer>
</template>

<script>
import {
    CustomComponents,
    isCustomComponent,
    components as CustomComponentMixins,
} from "components/CrateCreator/CoreComponents/custom/component.mixins";

import {
    generateId,
    linkItemToParent,
    unlinkItemFromParentAndChildren,
} from "components/CrateCreator/tools";

import RenderProfileReverseComponent from "./RenderProfileReverse.component.vue";

export default {
    mixins: [CustomComponentMixins],
    components: {
        RenderProfileReverseComponent,
        RenderProfileComponent: () => import("./RenderProfile.component"),
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
            const item = this.$store.getters.getItemById(
                this.addNewItem.itemId
            );
            return !item["@reverse"] ||
                Object.keys(item["@reverse"]).length === 1
                ? true
                : false;
        },
        typeDefinitions: function() {
            const typeDefinitions = Object.keys(
                this.$store.state.typeDefinitions
            );
            return [...typeDefinitions, ...CustomComponents].sort();
        },
        addNewItem: function() {
            const item = this.$store.state.addNewItem;
            if (item && item.itemId) {
                this.item = this.$store.getters.getItemById(item.itemId);
            }
            return item;
        },
        customComponent: function() {
            return isCustomComponent(this.item["@type"])
                ? `${this.item["@type"]}Component`
                : undefined;
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
            this.$store.commit("addNewItem", {
                itemId: item.uuid,
                parentId: undefined,
                property: undefined,
            });
        },
        remove() {
            if (this.addNewItem && this.addNewItem.parentId) {
                unlinkItemFromParentAndChildren({
                    store: this.$store,
                    parentId: this.addNewItem.parentId,
                    itemId: this.addNewItem.itemId,
                    property: this.addNewItem.property,
                });
            }
            try {
                this.$store.commit("removeFromGraph", {
                    uuid: this.addNewItem.itemId,
                });
                this.item = {};
                this.$store.commit("addNewItem", undefined);
                this.$refs.drawer.closeDrawer();
            } catch (error) {
                this.$message({
                    type: "error",
                    showClose: true,
                    duration: 6000,
                    message: `The item can't be deleted until all references to it and from it have been deleted first.`,
                });
            }
        },
        linkItem() {
            if (this.addNewItem && this.addNewItem.parentId) {
                linkItemToParent({
                    store: this.$store,
                    parentId: this.addNewItem.parentId,
                    itemId: this.addNewItem.itemId,
                    property: this.addNewItem.property,
                });
            }
        },
        done(drawerDoneHandler) {
            this.linkItem();
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
