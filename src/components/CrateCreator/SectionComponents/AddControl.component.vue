<template>
    <div>
        <el-button
            @click="add(type)"
            type="success"
            size="small"
            v-for="(type, idx) of types"
            :key="idx"
        >
            <i class="fas fa-plus"></i>&nbsp;{{ type }}
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
        add(type) {
            this.$emit("add", type);
        }
    }
};
</script>

<style lang="scss" scoped></style>
