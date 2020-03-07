<template>
    <div class="flex flex-col justify-around">
        <target-selection-component class="border-b-2 pb-4" />
        <profile-selection-component
            v-if="folder"
            class="mt-4 border-b-2 pb-4"
        />
    </div>
</template>

<script>
import TargetSelectionComponent from "components/TargetSelection/Shell.component.vue";
import ProfileSelectionComponent from "components/ProfileSelection/Shell.component.vue";
export default {
    components: {
        TargetSelectionComponent,
        ProfileSelectionComponent
    },
    computed: {
        folder: function() {
            return this.$store.state.folder;
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
