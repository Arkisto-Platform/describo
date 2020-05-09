<template>
    <div class="flex flex-col">
        <div class="overflow-scroll set-input-section-height">
            <render-profile-component :uuid="dataset.uuid" />
        </div>
    </div>
</template>

<script>
import RenderProfileComponent from "components/CrateCreator/shared/RenderProfile.component.vue";
import { cloneDeep } from "lodash";

export default {
    components: {
        RenderProfileComponent,
    },
    data() {
        return {};
    },
    computed: {
        dataset: function() {
            return this.$store.getters.getItemsByType("RootDataset")[0];
        },
    },
    methods: {},
};
</script>

<style lang="scss" scoped>
.set-input-section-height {
    height: calc(100vh - 210px);
}
.style-controls-row {
    width: 700px;
}
</style>
