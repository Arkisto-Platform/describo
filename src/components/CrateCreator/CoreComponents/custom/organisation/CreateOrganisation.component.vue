<template>
    <div class="flex flex-col mt-4">
        <div class="my-2">
            <div class="my-auto text-left text-sm pr-2">
                name
            </div>
            <div>
                <el-input v-model="properties.name"></el-input>
            </div>
        </div>
        <div class="my-2">
            <div class="my-auto text-left text-sm pr-2">
                description
            </div>
            <div>
                <el-input v-model="properties.description"></el-input>
            </div>
        </div>
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
