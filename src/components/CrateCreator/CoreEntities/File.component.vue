<template>
    <div>
        <div class="border-b-2 m-2 p-2">
            <div class="flex flex-row">
                <span>File: {{ properties.uuid }}</span>
                <div class="flex-grow"></div>
                <el-button @click="showContent = !showContent" type="primary">
                    <i class="fas fa-eye"></i>
                    <span v-show="showContent">hide</span>
                    <span v-show="!showContent">show</span>
                    content
                </el-button>
            </div>
        </div>

        <div class="flex flex-row">
            <div
                class="flex flex-col"
                :class="{ 'w-1/2': showContent, 'w-full': !showContent }"
            >
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
                        <i class="fas fa-trash-alt"></i> discard changes
                    </el-button>
                    <div class="flex-grow"></div>
                    <el-button @click="save" type="success">
                        <i class="fas fa-check"></i>
                    </el-button>
                </div>
            </div>
            <div class="px-2 w-1/2" v-if="showContent">
                <content-viewer-component :properties="properties" />
            </div>
        </div>
    </div>
</template>

<script>
import { save, restore } from "./file.js";
import { getParams } from "components/CrateCreator/tools";
import ContentViewerComponent from "components/CrateCreator/ContentViewer/Shell.component.vue";

export default {
    components: {
        ContentViewerComponent
    },
    props: {
        uuid: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            properties: {},
            showContent: true
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
