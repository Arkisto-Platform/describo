<template>
    <div class="flex flex-col">
        <!-- lookup organisation -->
        <lookup-ror-component @selected-organisation="save" v-if="newItem" />

        <!-- create /edit organisation -->
        <create-organisation-component :properties.sync="properties" />

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
import CreateOrganisationComponent from "./CreateOrganisation.component.vue";
import LookupRorComponent from "./LookupROR.component.vue";

export default {
    components: {
        CreateOrganisationComponent,
        LookupRorComponent,
    },
    props: {
        uuid: { type: String, required: true },
        enableRemove: { type: Boolean },
    },
    data() {
        return {
            editing: true,
            properties: {
                name: undefined,
                description: undefined,
            },
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
        if (item) {
            this.properties.name = item.name;
            this.properties.description = item.description;
        }
    },
    methods: {
        remove() {
            this.$emit("remove");
        },
        save(selection) {
            if (selection && selection.uuid) {
                // select an org from ROR
                //  delete current org
                this.$store.commit("removeFromGraph", this.item);

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
            } else {
                const item = {
                    ...this.item,
                    name: this.properties.name,
                    description: this.properties.description,
                };
                this.$store.commit("saveToGraph", item);
            }
            this.$emit("save");
        },
    },
};
</script>

<style lang="scss" scoped></style>
