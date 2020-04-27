<template>
    <div class="flex flex-row">
        <div class="cursor-pointer bg-green-200 p-2 rounded-l-lg" @click="edit">
            <div class="flex flex-col space-y-1">
                <div class="text-gray-600 text-xs">
                    @id&nbsp;
                    {{ itemData.uuid }}
                </div>
                <div class="text-gray-800 text-lg">
                    {{ itemData["@type"] }}:
                    {{ itemData.name }}
                </div>
            </div>
        </div>
        <div class="bg-green-200 p-2 rounded-r-lg">
            <el-button @click="removeItem" size="mini" class="rounded-lg">
                <i class="fas fa-times"></i>
            </el-button>
        </div>
    </div>
</template>

<script>
import { isArray, isPlainObject } from "lodash";
import { unlinkParentAndItem } from "components/CrateCreator/tools";
export default {
    props: {
        item: {
            type: Object,
            required: true,
        },
        reference: {
            type: String,
            required: true,
        },
    },
    computed: {
        itemData: function() {
            return this.$store.getters.getItemById(this.item.data.uuid);
        },
    },
    data() {
        return {};
    },
    methods: {
        edit() {
            this.$store.commit("addNewItem", {
                itemId: this.item.data.uuid,
                parentId: this.reference,
                property: this.item.property,
            });
        },
        removeItem() {
            unlinkParentAndItem({
                store: this.$store,
                parentId: this.reference,
                itemId: this.item.data.uuid,
                property: this.item.property,
            });
        },
    },
};
</script>
