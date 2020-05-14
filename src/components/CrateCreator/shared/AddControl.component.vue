<template>
    <div>
        <el-button
            @click="add(type)"
            type="success"
            round
            size="mini"
            v-for="(type, idx) of types"
            :key="idx"
            class="focus:outline-none focus:border-2 focus:border-green-600"
        >
            <i class="fas fa-plus"></i>&nbsp;{{ type }}
        </el-button>
    </div>
</template>

<script>
export default {
    props: {
        template: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            types: [],
        };
    },
    mounted() {
        this.types = this.template["@type"];
        if (typeof this.template["@type"] === "string") {
            this.types = [this.template["@type"]];
        }
    },
    methods: {
        add(type) {
            this.$emit("add", { type, property: this.template.property });
        },
    },
};
</script>

<style lang="scss" scoped></style>
