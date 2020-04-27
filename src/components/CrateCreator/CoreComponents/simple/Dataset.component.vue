<template>
    <div>
        <div class="border-b-2 m-2 p-2">
            <span>Folder: {{ properties.uuid }}</span>
        </div>

        <el-form :model="properties" label-width="120px" @submit.native.prevent>
            <el-form-item label="Name">
                <el-input v-model="properties.name"></el-input>
            </el-form-item>
            <el-form-item label="Description">
                <el-input
                    v-model="properties.description"
                    type="textarea"
                    rows="5"
                ></el-input>
            </el-form-item>
            <el-form-item label="Date Modified">{{
                properties.dateModified | date
            }}</el-form-item>
        </el-form>

        <div class="flex flex-row mt-2">
            <el-button @click="cancel" type="danger">
                <i class="fas fa-trash-alt"></i>
                discard changes
            </el-button>
            <div class="flex-grow"></div>
            <el-button @click="save" type="success">
                <i class="fas fa-check"></i>
            </el-button>
        </div>
    </div>
</template>

<script>
import { save, restore } from "./dataset";
import { getParams } from "components/CrateCreator/tools";

export default {
    props: {
        uuid: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            properties: {},
        };
    },
    created() {
        const properties = restore({
            store: this.$store,
            id: this.uuid,
        });
        this.$data.properties = { ...properties };
    },
    methods: {
        cancel() {
            this.$emit("cancel");
        },
        save() {
            const params = getParams({
                properties: this.properties,
                reference: this.reference,
            });
            save({
                store: this.$store,
                dataset: params,
            });
            this.$emit("done");
        },
    },
};
</script>

<style lang="scss" scoped></style>
