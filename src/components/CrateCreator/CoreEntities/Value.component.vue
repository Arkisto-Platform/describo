<template>
    <div @blur="add(value)">
        {{ value }}
    </div>
</template>

<script>
export default {
    props: {
        template: {
            type: Object,
            required: true,
        },
        reference: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            value: this.template.value,
        };
    },
};
</script>

<style lang="scss" scoped></style>
