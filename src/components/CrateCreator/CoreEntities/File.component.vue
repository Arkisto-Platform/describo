<template>
    <el-card type="box-card" class="flex flex-col">
        <div slot="header" class="clearfix">
            <span>File: {{ properties.uuid }}</span>
        </div>

        <el-form :model="properties" label-width="120px">
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
            <el-form-item label="Size">{{
                properties.contentSize
            }}</el-form-item>
            <el-form-item label="Date Modified">{{
                properties.dateModified | date
            }}</el-form-item>
        </el-form>

        <div class="flex flex-row mt-2">
            <el-button @click="cancel" type="danger">
                <i class="fas fa-trash-alt"></i>
            </el-button>
            <div class="flex-grow"></div>
            <el-button @click="save" type="success">
                <i class="fas fa-check"></i>
            </el-button>
        </div>
    </el-card>
</template>

<script>
import { save, restore } from "./file.js";
import { getParams } from "components/CrateCreator/tools";

export default {
    props: {
        uuid: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            properties: {}
        };
    },
    created() {
        const properties = restore({
            store: this.$store,
            id: this.uuid
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
                reference: this.reference
            });
            save({
                store: this.$store,
                file: params
            });
            this.$emit("done");
        }
    }
};
</script>

<style lang="scss" scoped></style>
