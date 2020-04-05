<template>
    <div class="flex flex-col mt-4">
        <div class="text-sm text-gray-500" v-if="properties.mode.create">
            Create a new contact point
        </div>
        <div class="text-sm text-gray-500" v-else>
            Update contact point
        </div>

        <el-form
            ref="form"
            :rules="rules"
            :model="properties"
            label-width="120px"
            @submit.native.prevent
        >
            <el-form-item label="Name" prop="name">
                <el-input v-model="properties.name"></el-input>
            </el-form-item>
            <el-form-item label="Contact Type">
                customer service
            </el-form-item>
            <el-form-item
                label="Email"
                prop="email"
                v-if="!properties.mode.edit"
            >
                <el-input v-model="properties.email" type="email"></el-input>
            </el-form-item>
            <el-form-item label="URL" prop="url">
                <el-input v-model="properties.url" type="url"></el-input>
            </el-form-item>
        </el-form>

        <div class="flex flex-row mt-2">
            <el-button
                @click="cancel"
                type="danger"
                v-show="!properties.mode.disableDelete"
            >
                <i class="fas fa-trash-alt"></i>
            </el-button>
            <div class="flex-grow"></div>
            <el-button @click="save" type="success">
                <i class="fas fa-check"></i>
            </el-button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        properties: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            rules: {
                name: [
                    {
                        required: true,
                        message: "Please input a person's name",
                        trigger: "change"
                    }
                ],
                email: [
                    {
                        required: true,
                        message: "Please input an email address",
                        trigger: "change"
                    }
                ]
                // url: [
                //     {
                //         required: true,
                //         message:
                //             "Please input a URL for this person - an ORCID is a great idea.",
                //         trigger: "change"
                //     }
                // ]
            }
        };
    },
    methods: {
        save() {
            this.$refs.form.validate(valid => {
                if (valid) this.$emit("save");
            });
        },
        cancel() {
            this.$emit("cancel");
        }
    }
};
</script>

<style lang="scss" scoped></style>
