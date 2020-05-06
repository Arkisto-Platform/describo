<template>
    <div class="flex flex-col">
        <!-- lookup organisation -->
        <lookup-ror-component @selected-organisation="save" v-if="newItem" />

        <!-- create /edit organisation -->
        <render-profile-component :uuid="uuid" />

        <div class="flex flex-row mt-2">
            <el-button @click="remove" type="danger" v-if="enableRemove">
                <i class="fas fa-trash-alt"></i>
            </el-button>
            <div class="flex-grow"></div>
            <el-button @click="save()" type="success">
                <i class="fas fa-check"></i>
            </el-button>
        </div>
    </div>
</template>

<script>
import LookupRorComponent from "./LookupROR.component.vue";
import { generateId, unlinkItemAndRemove } from "components/CrateCreator/tools";

export default {
    components: {
        LookupRorComponent,
        RenderProfileComponent: () =>
            import("components/CrateCreator/shared/RenderProfile.component"),
    },
    props: {
        uuid: { type: String, required: true },
        enableRemove: { type: Boolean },
    },
    data() {
        return {
            editing: true,
        };
    },
    computed: {
        item: function() {
            return this.$store.getters.getItemById(this.uuid);
        },
        newItem: function() {
            return !this.item.name;
        },
    },
    created() {
        const item = this.$store.getters.getItemById(this.uuid);
    },
    methods: {
        remove() {
            this.$emit("remove");
        },
        save(selection) {
            if (selection && selection.uuid) {
                // select an org from ROR
                //  create new org with ROR info
                const newItem = {
                    uuid: selection.uuid,
                    "@type": "Organization",
                    name: selection.name,
                };
                this.$store.commit("saveToGraph", newItem);

                this.$store.commit("addNewItem", {
                    ...this.$store.state.addNewItem,
                    itemId: selection.uuid,
                });
            }
            this.$emit("save");
        },
    },
};
</script>

<style lang="scss" scoped></style>
