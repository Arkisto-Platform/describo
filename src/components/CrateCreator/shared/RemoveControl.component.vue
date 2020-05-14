<template>
    <el-button
        @click="remove()"
        type="danger"
        class="ml-1 focus:outline-none focus:border-2 focus:border-red-600"
    >
        <i class="fas fa-trash-alt"></i>
    </el-button>
</template>

<script>
export default {
    props: {
        template: {
            type: Object,
            required: true,
        },
        uuid: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            types: [],
        };
    },
    methods: {
        remove() {
            this.$emit("remove", {
                property: this.template.property,
                uuid: this.uuid,
                type: this.template["@type"],
            });
        },
    },
};
</script>

<style lang="scss" scoped></style>
