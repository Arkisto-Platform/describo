<template>
    <el-drawer
        :with-header="false"
        :visible="drawer"
        direction="rtl"
        size="50%"
        :modal="false"
        @close="$emit('close')"
    >
        <iframe
            :src="property"
            class="w-full h-full style-frame overflow-scroll"
        ></iframe>
    </el-drawer>
</template>

<script>
export default {
    props: {
        drawer: {
            type: Boolean,
            required: true,
        },
        property: {
            type: String,
        },
        type: {
            type: String,
        },
    },
    data() {
        return {};
    },
    methods: {},
};
</script>

<style lang="scss" scoped>
.style-frame {
    height: 100vh;
    width: 100%;
}
</style>
