<template>
    <div class="flex flex-col items-center">
        <div class="text-lg text-center">
            Describo has a default profile that you can use for this.
        </div>
        <div class="text-lg text-center text-orange-800 text-xl my-2">
            If you're new here you should probably use this.
        </div>
        <div class="my-6">
            <el-button type="success" @click="storeProfile">
                Use the default profile
                <i
                    class="fas fa-long-arrow-alt-right"
                    data-fa-transform="down-2"
                ></i
            ></el-button>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {};
    },
    methods: {
        storeProfile() {
            this.$emit("store-profile", "default");
        }
    }
};
</script>

<style lang="scss" scoped></style>
