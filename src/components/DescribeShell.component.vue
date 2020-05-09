<template>
    <div class="flex flex-col pt-2 pb-1">
        <div
            class="flex flex-col style-introduction text-xl text-center py-8"
            v-if="!target"
        >
            <p class="my-4 text-3xl">Welcome to Describo!</p>
            <p class="my-2 text-gray-600">
                Describo is a tool to create and update Research Object Crates
                (RO-Crate).
            </p>
        </div>
        <div class="flex flex-col">
            <div
                :class="{
                    'flex flex-row': target && profile,
                    'flex flex-col': !target || !profile,
                }"
            >
                <target-selection-component
                    :class="{
                        'w-3/5 mx-1': target && profile,
                        'w-full py-2 px-6': !target || !profile,
                    }"
                />
                <profile-selection-component
                    v-if="target"
                    :class="{
                        'w-2/5 mx-1': target && profile,
                        'w-full px-6': !target || !profile,
                    }"
                />
            </div>
            <crate-creator v-if="target && profile" class="mt-2">
            </crate-creator>
        </div>
    </div>
</template>

<script>
import TargetSelectionComponent from "components/TargetSelection/Shell.component.vue";
import ProfileSelectionComponent from "components/ProfileSelection/Shell.component.vue";
import CrateCreator from "components/CrateCreator/Shell.component.vue";

export default {
    components: {
        TargetSelectionComponent,
        ProfileSelectionComponent,
        CrateCreator,
    },
    computed: {
        target: function() {
            return this.$store.state.target;
        },
        profile: function() {
            return this.$store.state.profile;
        },
    },
    data() {
        return {};
    },
};
</script>

<style lang="scss" scoped></style>
