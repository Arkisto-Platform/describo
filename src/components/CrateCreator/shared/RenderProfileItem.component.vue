<template>
    <div class="flex flex-row shadow-lg">
        <div
            class="cursor-pointer bg-green-200 p-2 rounded-l"
            @click="edit"
            v-if="itemData"
        >
            <render-item-information-component :uuid="item.data.uuid" />
        </div>
        <div class="bg-green-200 p-2 rounded-r">
            <el-button
                type="danger"
                @click="removeItem"
                size="small"
                class="round-lg focus:outline-none focus:border-2 focus:border-red-600"
            >
                <i class="fas fa-trash-alt"></i>
            </el-button>
        </div>
    </div>
</template>

<script>
import { isArray, isPlainObject } from "lodash";
import { unlinkItemFromParentAndChildren } from "components/CrateCreator/tools";
import RenderItemInformationComponent from "./RenderItemInformation.component.vue";
import { unlink } from "fs";
export default {
    components: {
        RenderItemInformationComponent,
    },
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
