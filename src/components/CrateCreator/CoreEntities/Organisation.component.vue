<template>
    <div>
        <!-- <el-tag
            type="success"
            :closable="true"
            @click="properties.visible = true"
            @close="cancel"
            v-if="!properties.visible"
            >{{ this.properties.name }}</el-tag
        > -->
        <el-card
            type="box-card"
            class="flex flex-col style-card"
            v-if="properties.visible"
        >
            <pre>{{ input }}</pre>
            <!-- <div class="flex flex-row">
                <div class="w-20 text-right mr-1 my-auto">@id:</div>
                <el-input v-model="properties.id"></el-input>
            </div>
            <div class="flex flex-row mt-2">
                <div class="w-20 text-right mr-1 my-auto">id type:</div>
                <el-select v-model="properties.idType" placeholder="Select">
                    <el-option
                        v-for="(type, idx) in idTypes"
                        :key="idx"
                        :label="type"
                        :value="type"
                    >
                    </el-option>
                </el-select>
            </div>
            <div class="flex flex-row mt-2">
                <div class="w-20 text-right mr-1 my-auto">name:</div>
                <el-input v-model="properties.name"></el-input>
            </div> -->
            <div class="flex flex-row mt-2">
                <el-button @click="cancel" type="danger"
                    ><i class="fas fa-trash-alt"></i
                ></el-button>
                <div class="flex-grow"></div>
                <!-- <el-button @click="save" type="success" 
                    ><i class="fas fa-check"></i
                ></el-button> -->
            </div>
        </el-card>
    </div>
</template>

<script>
import { save, restore } from "./organisation.js";
import apiMixins from "./api.mixins";

export default {
    mixins: [apiMixins],
    props: {
        input: {
            type: Object,
            required: true
        },
        created() {
            const properties = restore({
                store: this.$store,
                id: this.input["@id"]
            });
            console.log(properties);
            this.$data.properties = { ...properties };
        },
        methods: {
            save() {
                const params = Object.keys(this.$data.properties).map(p => {
                    return { k: p, v: this.properties[p] };
                });
                save({
                    store: this.$store,
                    params
                });
                this.$emit("save", this.properties.id);
                this.properties.visible = false;
            }
        }
    },
    data() {
        return {};
    }
};
</script>

<style lang="scss" scoped></style>
