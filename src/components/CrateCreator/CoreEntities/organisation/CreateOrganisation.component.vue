<template>
    <div class="flex flex-col mt-4">
        <el-form
            ref="form"
            :model="properties"
            label-width="120px"
            @submit.native.prevent
        >
            <el-form-item label="Name">
                <el-input v-model="properties.name"></el-input>
            </el-form-item>
            <el-form-item label="Description">
                <el-input
                    v-model="properties.description"
                    type="textarea"
                    rows="3"
                ></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    props: {
        properties: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {};
    },
};
</script>

<style lang="scss" scoped></style>
