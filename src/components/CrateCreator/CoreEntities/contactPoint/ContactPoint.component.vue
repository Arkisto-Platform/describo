<template>
    <div>
        <el-tag
            class="cursor-pointer"
            type="success"
            @click="toggleEdit()"
            v-if="!properties.mode.visible"
        >
            {{ this.properties.name }} - {{ this.properties.email }}
        </el-tag>
        <el-card
            type="box-card"
            class="flex flex-col style-card"
            v-if="properties.mode.visible"
        >
            <span v-if="properties.mode.create">
                <!-- select existing -->
                <select-existing-entry type="Person" @selection="save" />
            </span>
            <!-- create / edit contact point -->
            <create-contact-point-component
                :properties.sync="properties"
                v-if="properties.mode.create || properties.mode.edit"
                @cancel="cancel"
                @save="save"
            />

            <!-- <div class="flex flex-row mt-2">
                <el-button
                    @click="cancel"
                    type="danger"
                    v-show="!properties.mode.disableDelete"
                >
                    <i class="fas fa-trash-alt"></i>
                </el-button>
                <div class="flex-grow"></div>
                <el-button @click="save()" type="success">
                    <i class="fas fa-check"></i>
                </el-button>
            </div> -->
        </el-card>
    </div>
</template>

<script>
import { save, restore, remove } from "./contact-point.js";
import { generateId } from "components/CrateCreator/tools";
import CreateContactPointComponent from "./CreateContactPoint.component.vue";
import SelectExistingEntry from "../SelectExistingEntry.component.vue";

export default {
    components: {
        CreateContactPointComponent,
        SelectExistingEntry
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
                contactPoint: this.data,
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
                    contactPoint: selection
                });
            } else {
                if (
                    this.properties.mode.edit &&
                    this.properties.email !== this.data.email
                )
                    this.cancel();
                save({
                    store: this.$store,
                    reference: {
                        uuid: this.reference,
                        property: this.template.property
                    },
                    contactPoint: this.properties
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
            this.properties.mode.edit = true;
        }
    }
};
</script>

<style lang="scss" scoped>
.style-card {
    min-width: 500px;
}
</style>
