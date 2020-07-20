<template>
    <div class="flex flex-row bg-yellow-200 rounded-lg p-2">
        <div
            class="flex flex-col cursor-pointer"
            v-if="item.uuid"
            @click="loadTarget"
        >
            <div class="flex flex-row text-gray-600 font-light">
                <div>@type: {{ item["@type"] }}</div>
                <div class="ml-2">
                    <i class="fas fa-long-arrow-alt-right"></i>
                    {{ property }}
                </div>
            </div>
            <div class="text-gray-800 text-xl">name: {{ item.name }}</div>
        </div>
        <div class="ml-2">
            <el-button
                @click="remove()"
                type="danger"
                class="ml-1 focus:outline-none focus:border-2 focus:border-red-600"
                size="small"
            >
                <i class="fas fa-trash-alt"></i>
            </el-button>
        </div>
    </div>
</template>

<script>
import { unlinkItemFromParentAndChildren } from "components/CrateCreator/tools";

export default {
    props: {
        property: {
            type: String,
            required: true,
        },
        itemId: {
            type: String,
            required: true,
        },
        parentId: {
            type: String,
            required: true,
        },
    },
    computed: {
        item: function() {
            return this.$store.getters.getItemById(this.parentId);
        },
    },
    data() {
        return {};
    },
    methods: {
        remove() {
            this.$emit("close");
            this.$nextTick(() => {
                unlinkItemFromParentAndChildren({
                    store: this.$store,
                    parentId: this.parentId,
                    itemId: this.itemId,
                    property: this.property,
                });
            });
        },
        loadTarget() {
            this.$emit("close");
            if (this.item["@type"] === "RootDataset") {
                this.$store.commit("addNewItem", undefined);
            } else {
                this.$store.commit("addNewItem", {
                    itemId: this.item.uuid,
                    parentId: undefined,
                    property: undefined,
                });
            }
        },
    },
};
</script>
