<template>
    <div class="flex flex-row">
        <div class="flex flex-col w-1/2 text-right pr-2 border-r-2">
            <div class="text-lg">
                Describo has a default profile that you can use for this.
            </div>
            <div class="text-lg text-orange-800 text-xl my-2">
                If you're new here you should probably use this.
            </div>
        </div>
        <div class="w-1/2 pt-3 pl-2">
            <el-button type="primary" @click="storeProfile" round>
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
import defaultProfile from "components/profiles/default";

export default {
    components: {},
    data() {
        return {};
    },
    methods: {
        storeProfile() {
            this.$emit("store-profile", { profile: defaultProfile });
        },
    },
};
</script>

<style lang="scss" scoped></style>
