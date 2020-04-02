<template>
    <div>
        <el-tag
            class="cursor-pointer"
            type="success"
            @click="toggleEdit()"
            v-if="!properties.mode.visible"
        >
            {{ this.properties.name }}
        </el-tag>
        <el-card
            type="box-card"
            class="flex flex-col style-card"
            v-if="properties.mode.visible"
        >
            <span v-if="properties.mode.create">
                <!-- lookup organisation -->
                <lookup-ror-component @selected-organisation="save" />

                <!-- select existing -->
                <select-existing-entry type="Organisation" @selection="save" />
            </span>

            <!-- create /edit organisation -->
            <create-organisation-component
                :properties.sync="properties"
                v-if="properties.mode.create || properties.mode.edit"
            />
            <div v-else class="mb-4">
                {{ properties.name }} ({{ properties.uuid }})
            </div>

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
import { getParams } from "components/CrateCreator/tools";
import CreateOrganisationComponent from "./CreateOrganisation.component.vue";
import SelectExistingEntry from "../SelectExistingEntry.component.vue";
import LookupRorComponent from "./LookupROR.component.vue";

export default {
    components: {
        CreateOrganisationComponent,
        SelectExistingEntry,
        LookupRorComponent
    },
    props: {
        input: {
            type: Object,
            required: true
        },
        reference: {
            type: Object
        },
        mode: {
            type: Object
        }
    },
    data() {
        return {
            properties: {
                visible: false
            }
        };
    },
    computed: {
        itemInStore: function() {
            return this.$store.getters.getItemById(this.properties.uuid);
        }
    },
    watch: {
        itemInStore: function() {
            const properties = this.restore({ uuid: this.properties.uuid });
            this.properties.name = properties.name;
            this.properties.description = properties.description;
        }
    },
    created() {
        this.$data.properties = this.restore({ uuid: this.input.uuid });
    },
    methods: {
        restore({ uuid }) {
            return restore({
                store: this.$store,
                uuid
            });
        },
        cancel() {
            // remove object from the store
            remove({
                store: this.$store,
                organisation: this.properties,
                reference: this.reference
            });

            // tell the dataset to remove the object
            this.$emit("cancel", this.properties.uuid);
            this.properties.mode = {
                edit: false,
                create: false,
                visible: false
            };
        },
        save(selection) {
            if (selection) {
                // tell the dataset to replace the ref and save
                this.$emit("replace", {
                    old: this.properties.uuid,
                    new: selection.uuid
                });
                save({
                    store: this.$store,
                    reference: this.reference,
                    organisation: selection
                });
            } else {
                save({
                    store: this.$store,
                    reference: this.reference,
                    organisation: this.properties
                });
                // tell the dataset to save
                this.$emit("save", this.properties.uuid);
            }
            this.properties.mode = {
                edit: false,
                create: false,
                visible: false
            };
        },
        toggleEdit() {
            this.properties.mode.visible = true;
            this.properties.mode.create = false;
            this.properties.mode.edit = this.properties.uuid.match(
                "https://ror.org"
            )
                ? false
                : true;
        }
    }
};
</script>

<style lang="scss" scoped>
.style-card {
    width: 600px;
}
</style>
