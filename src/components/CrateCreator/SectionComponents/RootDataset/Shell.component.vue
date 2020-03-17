<template>
    <div>
        <root-dataset-component class="flex-grow" :id="id" :inputs="inputs" />
    </div>
</template>

<script>
import RootDatasetComponent from "./RootDataset.component.vue";
import { cloneDeep } from "lodash";
import { generateId } from "components/CrateCreator/tools";
export default {
    components: {
        RootDatasetComponent
    },
    props: {
        profile: {
            type: Object | undefined,
            required: true
        }
    },
    data() {
        return {
            inputs: cloneDeep(this.profile.DataTypes.RootDataset),
            id: generateId()
        };
    },
    computed: {
        graph: function() {
            return this.$store.state.graph;
        }
    }
};
</script>

<style lang="scss" scoped></style>
