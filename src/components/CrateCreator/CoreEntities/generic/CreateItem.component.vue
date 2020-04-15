<template>
    <div class="flex flex-col mt-4">
        <div class="text-sm text-gray-500" v-if="properties.mode.create">
            Create a new item
        </div>
        <div class="text-sm text-gray-500" v-else>
            Update this item
        </div>

        <el-form
            ref="form"
            :rules="rules"
            :model="properties"
            label-width="120px"
            @submit.native.prevent
        >
            <el-form-item label="Identifier" prop="uuid">
                <el-input
                    v-model="properties.uuid"
                    @input="$emit('update:uuid', properties.uuid)"
                ></el-input>
            </el-form-item>
            <el-form-item label="Name" prop="name">
                <el-input
                    v-model="properties.name"
                    @input="$emit('update:name', properties.name)"
                ></el-input>
            </el-form-item>
            <el-form-item label="Description" prop="description">
                <el-input
                    type="textarea"
                    rows="5"
                    v-model="properties.description"
                    @input="$emit('update:description', properties.description)"
                ></el-input>
            </el-form-item>
            <pre class="bg-green-200">@type: {{ type }}</pre>
            <pre class="bg-green-200">{{ properties }}</pre>
        </el-form>
    </div>
</template>

<script>
import { debounce } from "lodash";
export default {
    props: {
        properties: {
            type: Object,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
    },
    watch: {
        "properties.name": function() {
            this.debouncedValidate();
        },
        "properties.uuid": function() {
            this.debouncedValidate();
        },
    },
    data() {
        return {
            debouncedValidate: debounce(this.validate, 300),
            rules: {
                name: [
                    {
                        required: true,
                        message: "Please input a name.",
                        trigger: "change",
                    },
                ],
                uuid: [
                    {
                        required: true,
                        message: "Please input an identifier for this item.",
                        trigger: "change",
                    },
                ],
            },
        };
    },
    mounted() {
        this.validate();
    },
    methods: {
        async validate() {
            const valid = await new Promise((resolve) => {
                this.$refs.form.validate((valid) => resolve(valid));
            });
            this.$emit("update:isValid", valid);
        },
    },
};
</script>

<style lang="scss" scoped></style>
