<template>
    <div class="flex flex-col justify-around">
        <target-selection-component />
    </div>
</template>

<script>
import TargetSelectionComponent from "components/TargetSelection/Shell.component.vue";
export default {
    components: {
        TargetSelectionComponent
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
