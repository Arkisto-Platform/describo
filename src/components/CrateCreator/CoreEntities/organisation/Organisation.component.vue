<template>
    <div>
        <el-tag
            class="cursor-pointer"
            type="success"
            @click="editing = !editing"
            v-if="!editing"
        >
            {{ this.properties.name }}
        </el-tag>
        <el-card type="box-card" class="flex flex-col" v-if="editing">
            <!-- lookup organisation -->
            <lookup-ror-component @selected-organisation="update" />

            <!-- select existing -->
            <!-- <select-existing-entry type="Organisation" @selection="save" /> -->
            <!-- </span> -->

            <!-- create /edit organisation -->
            <create-organisation-component :properties.sync="properties" />

            <div class="flex flex-row mt-2">
                <el-button @click="cancel" type="danger">
                    <i class="fas fa-trash-alt"></i>
                </el-button>
                <div class="flex-grow"></div>
                <el-button @click="save()" type="success">
                    <i class="fas fa-check"></i>
                </el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
import { save, restore, remove } from "./organisation.js";
import { unlinkParentAndItem } from "components/CrateCreator/tools";
import CreateOrganisationComponent from "./CreateOrganisation.component.vue";
import SelectExistingEntry from "../SelectExistingEntry.component.vue";
import LookupRorComponent from "./LookupROR.component.vue";

export default {
    components: {
        CreateOrganisationComponent,
        SelectExistingEntry,
        LookupRorComponent,
    },
    props: {
        template: {
            type: Object,
            required: true,
        },
        reference: {
            type: String,
        },
    },
    data() {
        return {
            editing: true,
            properties: {},
        };
    },
    created() {
        this.$data.properties = this.restore();
    },
    mounted() {},
    methods: {
        restore() {
            return restore({
                store: this.$store,
                uuid: this.template.data.uuid,
            });
        },
        cancel() {
            remove({
                store: this.$store,
                organisation: this.properties,
                parentId: this.reference,
                property: this.template.property,
            });
            this.editing = false;
            this.$emit("remove", {
                uuid: this.properties.uuid,
                property: this.template.property,
                type: this.template["@type"],
            });
        },
        update(selection) {
            this.$store.commit("removeFromGraph", {
                uuid: this.properties.uuid,
            });
            unlinkParentAndItem({
                store: this.$store,
                parentId: this.reference,
                itemId: this.properties.uuid,
                property: this.template.property,
            });
            this.properties.uuid = selection.uuid;
            this.properties.name = selection.name;
            this.save();
        },
        save() {
            save({
                store: this.$store,
                parentId: this.reference,
                property: this.template.property,
                organisation: this.properties,
            });
            this.editing = false;
            this.$emit("done");
        },
    },
};
</script>

<style lang="scss" scoped></style>
