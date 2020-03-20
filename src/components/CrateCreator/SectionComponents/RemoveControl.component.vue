<template>
    <div class="mx-2">
        <el-button
            @click="cancel(type)"
            type="danger"
            v-for="(type, idx) of types"
            :key="idx"
        >
            <i class="fas fa-trash-alt"></i>
        </el-button>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String | Array,
            required: true
        }
    },
    data() {
        return {
            types: []
        };
    },
    mounted() {
        this.types = this.type;
        if (typeof this.type === "string") {
            this.types = [this.type];
        }
    },
    methods: {
        cancel() {
            this.$emit("cancel");
        }
    }
};
</script>

<style lang="scss" scoped></style>
