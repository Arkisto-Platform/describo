<template>
    <div>
        <el-tag
            class="cursor-pointer"
            type="success"
            @click="properties.visible = true"
            v-if="!properties.visible"
            >{{ this.properties.name }}</el-tag
        >
        <el-card
            type="box-card"
            class="flex flex-col style-card"
            v-if="properties.visible"
        >
            <div class="flex flex-col my-4">
                <div class="text-sm text-gray-500">
                    lookup an organisation
                </div>
                <lookup-ror-component @selected-organisation="saveSelection" />
            </div>
            <div class="flex flex-col my-4">
                <div class="text-sm text-gray-500">
                    or select an existing organisation
                </div>
                <select-existing-entry
                    type="Organisation"
                    @selection="mergeSelection"
                />
            </div>
            <div class="flex flex-col mt-4">
                <div class="text-sm text-gray-500">
                    or create a new organisation
                </div>

                <div class="flex flex-row mt-2">
                    <div class="w-20 text-right mr-1 my-auto">id type:</div>
                    <el-select
                        v-model="properties.idType"
                        placeholder="Select"
                        class="w-full"
                    >
                        <el-option
                            v-for="(type, idx) in idTypes"
                            :key="idx"
                            :label="type"
                            :value="type"
                        ></el-option>
                    </el-select>
                </div>
                <div class="flex flex-row mt-2">
                    <div class="w-20 text-right mr-1 my-auto">name:</div>
                    <el-input v-model="properties.name"></el-input>
                </div>
                <div class="flex flex-row mt-2">
                    <el-button @click="cancel" type="danger">
                        <i class="fas fa-trash-alt"></i>
                    </el-button>
                    <div class="flex-grow"></div>
                    <el-button @click="save" type="success">
                        <i class="fas fa-check"></i>
                    </el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
import { save, restore, remove } from "./organisation.js";
import { getParams } from "components/CrateCreator/tools";
import SelectExistingEntry from "./SelectExistingEntry.component.vue";
import LookupRorComponent from "./LookupROR.component.vue";

export default {
    components: {
        SelectExistingEntry,
        LookupRorComponent
    },
    props: {
        input: {
            type: Object,
            required: true
        },
        reference: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            properties: {
                visible: false
            },
            idTypes: ["Research Organisation Registry (ROR)", "other"]
        };
    },
    created() {
        const properties = restore({
            store: this.$store,
            id: this.input.uuid
        });
        this.$data.properties = { ...properties };
    },
    methods: {
        cancel() {
            const params = getParams({
                properties: this.properties,
                reference: this.reference
            });
            remove({
                store: this.$store,
                params
            });
            this.$emit("cancel", this.properties.uuid);
            this.properties.visible = false;
        },
        save() {
            const params = getParams({
                properties: this.properties,
                reference: this.reference
            });
            save({
                store: this.$store,
                params
            });
            this.$emit("save", this.properties.uuid);
            this.properties.visible = false;
        },
        saveSelection(selection) {
            this.$emit("replace", {
                old: this.properties.uuid,
                new: selection.id
            });
            this.cancel();
            const properties = {
                ...this.properties,
                name: selection.name,
                uuid: selection.id
            };
            this.properties = { ...properties };
            this.save();
        },
        mergeSelection(selection) {
            this.$emit("replace", {
                old: this.properties.uuid,
                new: selection.uuid
            });
            const properties = restore({
                store: this.$store,
                id: selection.uuid
            });
            this.properties = { ...properties };
            this.properties.visible = false;
            this.save();
        }
    }
};
</script>

<style lang="scss" scoped>
.style-card {
    width: 600px;
}
</style>
