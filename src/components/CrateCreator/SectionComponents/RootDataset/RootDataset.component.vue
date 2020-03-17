<template>
    <div class="flex flex-col">
        <div class="style-controls-row border-b-2 pb-2">
            <div class="flex flex-row">
                <!-- <el-button @click="destroy" type="danger">
                    <i class="fas fa-trash-alt"></i>
                </el-button> -->
                <div class="flex-grow"></div>
                <el-button @click="dataInspector = true" type="primary">
                    <i class="fas fa-eye"></i> inspect data
                </el-button>
                <!-- <el-button @click="done" type="success">
                    <i class="fas fa-check"></i>&nbsp;done
                </el-button> -->
            </div>
        </div>
        <div class="flex flex-col flex-grow">
            <div v-for="(input, idx) of inputs" :key="idx">
                <!-- <pre>{{ input }}</pre> -->
                <render-entry-component
                    :input="input"
                    :reference="dataset.uuid"
                    @save="save"
                />
            </div>
        </div>
        <data-inspector-component
            :drawer="dataInspector"
            :data="dataset"
            @close="dataInspector = false"
        />
    </div>
</template>

<script>
import { generateId } from "components/CrateCreator/tools";
import RenderEntryComponent from "components/CrateCreator/SectionComponents/RenderEntry.component.vue";
import DataInspectorComponent from "components/CrateCreator/SectionComponents/DataInspector.component.vue";
import { cloneDeep } from "lodash";

export default {
    components: {
        RenderEntryComponent,
        DataInspectorComponent
    },
    props: {
        id: {
            type: String
        },
        inputs: {
            type: Array | undefined,
            required: true
        }
    },
    data() {
        return {
            dataInspector: false,
            dataset: {
                uuid: this.id || generateId()
            }
        };
    },
    mounted() {
        this.inputs.forEach(input => {
            this.updateDataset({
                property: input.property,
                items: input.items,
                value: input.value
            });
        });
    },
    methods: {
        save({ property, items, value }) {
            this.updateDataset({ property, items, value });
            this.$store.commit("saveToGraph", {
                "@type": "Dataset",
                ...cloneDeep(this.dataset)
            });
        },
        updateDataset({ property, items, value }) {
            if (value) this.dataset = { ...this.dataset, [property]: value };
            if (items) this.dataset = { ...this.dataset, [property]: items };
        }
        // done() {
        //     this.$emit("done");
        // },
        // destroy() {
        //     this.$emit("destroy", this.dataset);
        // }
    }
};
</script>

<style lang="scss" scoped>
.style-controls-row {
    width: 700px;
}
</style>
