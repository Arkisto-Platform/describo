<template>
    <div class="flex flex-col">
        <header-component />
    </div>
</template>

<script>
import HeaderComponent from "./Header.component.vue";
import FolderSelectionComponent from "./FolderSelection.component.vue";

export default {
    components: {
        HeaderComponent,
        FolderSelectionComponent
    },
    data() {
        return {};
    },
    methods: {}
};
</script>

<style scoped lang="scss"></style>
