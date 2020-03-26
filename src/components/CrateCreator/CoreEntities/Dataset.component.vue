<template>
    <el-card type="box-card" class="flex flex-col style-card">
        <div slot="header" class="clearfix">
            <span>Dataset</span>
        </div>
        <!-- <div class="flex flex-row my-1">
            <div class="w-32 text-right mr-1 my-auto">@id:</div>
            <div>{{ properties.id }}</div>
        </div> -->
        <div class="flex flex-row my-1">
            <div class="w-32 text-right mr-1 my-auto">name:</div>
            <el-input v-model="properties.name"></el-input>
        </div>
        <div class="flex flex-row my-1">
            <div class="w-32 text-right mr-1 my-auto">description:</div>
            <el-input v-model="properties.description"></el-input>
        </div>

        <div class="flex flex-row mt-2">
            <div class="flex-grow"></div>
            <el-button @click="save" type="success">
                <i class="fas fa-check"></i>
            </el-button>
        </div>
    </el-card>
</template>

<script>
import { save, restore } from "./dataset.js";
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
        save() {
            const params = getParams({
                properties: this.properties,
                reference: this.reference
            });
            save({
                store: this.$store,
                dataset: params
            });
            this.$emit("done");
        }
    }
};
</script>

<style lang="scss" scoped>
.style-card {
    width: 600px;
}
</style>
