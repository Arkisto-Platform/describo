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
import { generateId } from "components/CrateCreator/tools";
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
        template: {
            type: Object,
            required: true
        },
        reference: {
            type: String
        },
        data: {},
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
    created() {
        this.$data.properties = this.restore();
        if (!this.data) this.$data.properties.uuid = generateId();
    },
    mounted() {
        if (this.mode) {
            this.properties.mode = { ...this.properties.mode, ...this.mode };
        }
    },
    methods: {
        restore() {
            return restore({
                store: this.$store,
                uuid: (this.data && this.data.uuid) || undefined
            });
        },
        cancel() {
            remove({
                store: this.$store,
                organisation: this.data,
                reference: {
                    uuid: this.reference,
                    property: this.template.property
                }
            });
            this.properties.mode = {
                edit: false,
                create: false,
                visible: false
            };
            this.$emit("done");
        },
        save(selection) {
            if (selection) {
                save({
                    store: this.$store,
                    reference: {
                        uuid: this.reference,
                        property: this.template.property
                    },
                    organisation: selection
                });
            } else {
                if (
                    this.properties.mode.edit &&
                    this.properties.uuid !== this.data.uuid
                )
                    this.cancel();
                save({
                    store: this.$store,
                    reference: {
                        uuid: this.reference,
                        property: this.template.property
                    },
                    organisation: this.properties
                });
            }
            this.properties.mode = {
                edit: false,
                create: false,
                visible: false
            };
            this.$emit("done");
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
