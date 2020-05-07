<template>
    <div class="flex flex-row shadow-lg">
        <div
            class="cursor-pointer bg-green-200 p-2 rounded-l"
            @click="edit"
            v-if="itemData"
        >
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
        <div class="bg-green-200 p-2 rounded-r">
            <el-button
                type="danger"
                @click="removeItem"
                class="rounded-lg"
                size="small"
            >
                <i class="fas fa-trash-alt"></i>
            </el-button>
        </div>
    </div>
</template>

<script>
import { isArray, isPlainObject } from "lodash";
import { unlinkItemFromParentAndChildren } from "components/CrateCreator/tools";
import { unlink } from "fs";
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
            const item = this.$store.getters.getItemById(this.item.data.uuid);
            if (!item) {
                console.log(
                    `Oops - can't get data for property: '${this.item.property}'`
                );
                console.log(this.item);
            }
            return item;
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
            unlinkItemFromParentAndChildren({
                store: this.$store,
                parentId: this.reference,
                itemId: this.item.data.uuid,
                property: this.item.property,
            });
        },
    },
};
</script>
