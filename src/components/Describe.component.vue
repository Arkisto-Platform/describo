<template>
    <div class="flex flex-col justify-around">
        <div
            :class="{
                'flex flex-row': target && profile,
                'flex flex-col': !target || !profile,
            }"
        >
            <target-selection-component
                :class="{
                    'w-4/5 mx-1': target && profile,
                    'w-full': !target || !profile,
                }"
            />
            <profile-selection-component
                v-if="target"
                :class="{
                    'w-1/5 mx-1': target && profile,
                    'w-full mt-2 border-b-2 border-gray-400':
                        !target || !profile,
                }"
            />
        </div>
        <crate-creator v-if="target && profile" class="mt-4"> </crate-creator>
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

<style lang="scss" scoped>
.style-introduction {
    height: 400px;
}
</style>
