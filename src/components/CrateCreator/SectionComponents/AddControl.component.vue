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
        template: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            types: []
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
            this.$emit("add", {
                template: this.template,
                type
            });
        }
    }
};
</script>

<style lang="scss" scoped></style>
