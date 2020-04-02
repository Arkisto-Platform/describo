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
                :properties.sync="properties"
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
                <el-button @click="save()" type="success">
                    <i class="fas fa-check"></i>
                </el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
import { save, restore, remove } from "./person.js";
import { getParams } from "components/CrateCreator/tools";
import CreatePersonComponent from "./CreatePerson.component.vue";
import SelectExistingEntry from "../SelectExistingEntry.component.vue";

export default {
    components: {
        CreatePersonComponent,
        SelectExistingEntry
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
        }
    },
    created() {
        this.$data.properties = this.restore();
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
                uuid: this.input.uuid
            });
        },
        cancel() {
            remove({
                store: this.$store,
                person: this.properties,
                reference: this.reference
            });
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
                    person: selection
                });
            } else {
                save({
                    store: this.$store,
                    reference: this.reference,
                    person: this.properties
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
            this.properties.mode.edit = true;
        }
    }
};
</script>

<style lang="scss" scoped>
.style-card {
    width: 600px;
}
</style>
