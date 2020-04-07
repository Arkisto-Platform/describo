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
                <!-- select existing -->
                <select-existing-entry type="Person" @selection="save" />
            </span>

            <!-- create /edit person -->
            <create-person-component
                :properties="properties"
                @update:name="properties.name = $event"
                @update:uuid="properties.uuid = $event"
                @update:isValid="isValid = $event"
                v-if="properties.mode.create || properties.mode.edit"
            />
            <div v-else class="mb-4">
                {{ properties.name }} ({{ properties.uuid }})
            </div>

            <div class="flex flex-row mt-2">
                <el-button
                    @click="cancel"
                    type="danger"
                    v-show="!properties.mode.disableDelete"
                >
                    <i class="fas fa-trash-alt"></i>
                </el-button>
                <div class="flex-grow"></div>
                <el-button @click="save()" type="success" :disabled="!isValid">
                    <i class="fas fa-check"></i>
                </el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
import { save, restore, remove } from "./person.js";
import { generateId } from "components/CrateCreator/tools";
import CreatePersonComponent from "./CreatePerson.component.vue";
import SelectExistingEntry from "../SelectExistingEntry.component.vue";

export default {
    components: {
        CreatePersonComponent,
        SelectExistingEntry,
    },
    props: {
        template: {
            type: Object,
            required: true,
        },
        reference: {
            type: String,
        },
        data: {},
        mode: {
            type: Object,
        },
    },
    data() {
        return {
            isValid: false,
            properties: {
                visible: false,
            },
        };
    },
    created() {
        this.$data.properties = this.restore();
        // if (!this.data) this.$data.properties.uuid = generateId();
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
                uuid: (this.data && this.data.uuid) || undefined,
            });
        },
        cancel() {
            remove({
                store: this.$store,
                person: this.data,
                reference: {
                    uuid: this.reference,
                    property: this.template.property,
                },
            });
            this.properties.mode = {
                edit: false,
                create: false,
                visible: false,
            };
            this.$emit("done");
        },
        save(selection) {
            if (selection) {
                save({
                    store: this.$store,
                    reference: {
                        uuid: this.reference,
                        property: this.template.property,
                    },
                    person: selection,
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
                        property: this.template.property,
                    },
                    person: this.properties,
                });
            }
            this.properties.mode = {
                edit: false,
                create: false,
                visible: false,
            };
            this.$emit("done");
        },
        toggleEdit() {
            this.properties.mode.visible = true;
            this.properties.mode.create = false;
            this.properties.mode.edit = true;
        },
    },
};
</script>

<style lang="scss" scoped>
.style-card {
    min-width: 500px;
}
</style>
