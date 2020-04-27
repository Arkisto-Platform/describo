<template>
    <div class="flex flex-row">
        <el-tag class="cursor-pointer" type="success" @click="edit">
            <div class="flex flex-row">
                <div class="text-gray-800 text-lg">
                    {{ itemData["@type"] }}:
                    {{ itemData.name }}
                </div>
                <div class="w-10"></div>
                <div class="text-gray-600 text-base">
                    @id&nbsp;
                    {{ itemData.uuid }}
                </div>
            </div>
        </el-tag>
    </div>
</template>

<script>
import { isArray, isPlainObject } from "lodash";
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
    },
};
</script>
