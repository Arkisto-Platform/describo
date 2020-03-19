<template>
    <div class="flex flex-col">
        <div class="flex flex-col style-introduction text-xl" v-if="!target && !profile">
            <p class="text-3xl">Welcome to describo!</p>
            <p class="my-2">
                Describo is a tool to create and update Research Object Crates
                (RO-Crate).
            </p>
            <p class="my-2">
                You have some data and you wish to describe it in a standard way
                such that others can discover and use it. Describo is the tool for
                the job!
            </p>
        </div>
        <describe-component />
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

<style lang="scss" scoped>
</style>
