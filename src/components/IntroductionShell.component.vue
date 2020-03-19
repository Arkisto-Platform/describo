<template>
    <div class="flex flex-col">
        <div
            class="flex flex-col style-introduction text-xl  border-b-2 border-gray-300"
            v-if="!target && !profile"
        >
            <p class="text-3xl">Welcome to describo!</p>
            <p class="my-2">
                Describo is a tool to create and update Research Object Crates
                (RO-Crate).
            </p>
        </div>
        <div class="mt-8">
            <describe-component />
        </div>
    </div>
</template>

<script>
import DescribeComponent from "components/Describe.component.vue";

export default {
    components: {
        DescribeComponent
    },
    computed: {
        target: function() {
            return this.$store.state.target;
        },
        profile: function() {
            return this.$store.state.profile;
        }
    },
    data() {
        return {};
    }
};
</script>

<style lang="scss" scoped></style>
