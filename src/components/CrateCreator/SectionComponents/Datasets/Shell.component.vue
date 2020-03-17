<template>
    <div class="flex flex-col">
        <!-- <div class="flex flex-row my-2">
            <el-button
                @click="addDataset"
                type="success"
                v-if="!createDataset"
                size="small"
            >
                <i class="fas fa-plus"></i>&nbsp;Add Dataset
            </el-button>
        </div> -->
        <!-- <div class="flex flex-row">
            <div class="flex flex-col">
                <list-datasets-component
                    v-if="!createDataset"
                    @edit-dataset="editDataset"
                /> -->
        <dataset-component class="flex-grow" :id="id" :inputs="inputs" />
        <!-- </div> -->
        <!-- </div> -->
    </div>
</template>

<script>
import DatasetComponent from "./Dataset.component.vue";
// import ListDatasetsComponent from "./ListsDatasets.component.vue";
import { cloneDeep } from "lodash";
export default {
    components: {
        DatasetComponent
        // ListDatasetsComponent
    },
    props: {
        profile: {
            type: Object | undefined,
            required: true
        }
    },
    data() {
        return {
            inputs: cloneDeep(this.profile.DataTypes.Dataset),
            id: undefined
        };
    },
    computed: {
        graph: function() {
            return this.$store.state.graph;
        }
    },
    methods: {
        // addDataset() {
        //     this.inputs = cloneDeep(this.profile.DataTypes.Dataset);
        //     this.createDataset = true;
        // },
        // editDataset(dataset) {
        //     dataset = cloneDeep(dataset);
        //     const inputs = cloneDeep(this.profile.DataTypes.Dataset);
        //     this.inputs = inputs.map(input => {
        //         if (["Text"].includes(input["@type"])) {
        //             input.value = dataset[input.property];
        //         } else {
        //             input.items = dataset[input.property];
        //         }
        //         return input;
        //     });
        //     this.id = dataset["@id"];
        //     this.createDataset = true;
        // },
        // done() {
        //     this.createDataset = false;
        //     this.inputs = [];
        // },
        //     destroy(dataset) {
        //         this.$store.commit("removeFromGraph", dataset);
        //         this.createDataset = false;
        //         this.inputs = [];
        //     }
    }
};
</script>

<style lang="scss" scoped></style>
