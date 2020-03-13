<template>
    <div class="flex flex-col justify-around">
        <target-selection-component class="border-b-2 pb-4" />
        <profile-selection-component
            v-if="folder"
            class="mt-4 border-b-2 pb-4"
        />
        <crate-creator v-if="folder && profile" class="mt-4"> </crate-creator>
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
        CrateCreator
    },
    computed: {
        folder: function() {
            return this.$store.state.folder;
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
.style-introduction {
    height: 400px;
}
</style>
