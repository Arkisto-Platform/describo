<template>
    <div class="flex flex-col mt-4">
        <div class="text-sm text-gray-500" v-if="properties.mode.create">
            Create a new person
        </div>
        <div class="text-sm text-gray-500" v-else>
            Update person
        </div>

        <el-form
            ref="form"
            :model="properties"
            label-width="120px"
            @submit.native.prevent
        >
            <el-form-item label="Identifier">
                <el-input v-model="properties.uuid"></el-input>
            </el-form-item>
            <el-form-item label="Name">
                <el-input v-model="properties.name"></el-input>
            </el-form-item>
        </el-form>
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
        return {};
    }
};
</script>

<style lang="scss" scoped></style>
