<template>
    <div class="flex flex-col">
        <el-alert
            :title="error"
            type="error"
            effect="dark"
            v-if="error"
        ></el-alert>
        <div class="style-controls-row border-b-2 pb-2" v-if="!error">
            <div class="flex flex-row">
                <el-button @click="dataInspector = true" type="primary">
                    <i class="fas fa-eye"></i> inspect data
                </el-button>
                <div class="flex-grow"></div>
                <div v-show="saving" class="text-orange-600 pt-2">
                    <i class="fas fa-save"></i> saving the crate
                </div>
                <div v-show="saved" class="text-green-600 pt-2">
                    <i class="fas fa-check"></i> saved
                </div>
            </div>
        </div>
        <div class="flex flex-col flex-grow">
            <div v-for="(input, idx) of inputs" :key="idx">
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
import { cloneDeep, isObject } from "lodash";
import CrateTool from "components/CrateCreator/crate-tools";
const crateTool = new CrateTool();

export default {
    components: {
        RenderEntryComponent,
        DataInspectorComponent
    },
    props: {
        profile: {
            type: Object | undefined,
            required: true
        }
    },
    data() {
        return {
            error: false,
            saved: false,
            saving: false,
            inputs: [],
            dataInspector: false,
            dataset: {}
        };
    },
    async beforeMount() {
        this.loadCrate();
    },
    methods: {
        async loadCrate() {
            this.dataset = {
                "@type": "RootDataset"
            };

            const crate = await crateTool.readCrate({
                target: this.$store.state.target
            });
            if (!crate) {
                this.inputs = cloneDeep(this.profile.inputs);
                this.dataset.uuid = generateId();
                return;
            }
            crate.forEach(element =>
                this.$store.commit("saveToGraph", element)
            );

            const rootDataset = crate.filter(
                e => e["@type"] === "RootDataset"
            )[0];
            if (!rootDataset) {
                this.error(`Can't find root dataset in that crate`);
            } else {
                this.dataset.uuid = rootDataset.uuid;
                this.inputs = cloneDeep(this.profile.inputs).map(input => {
                    if (input["@type"] === "Value") return input;

                    const item = rootDataset[input.property];
                    if (isObject(item)) {
                        input.items = cloneDeep(item);
                        this.updateDataset({
                            property: input.property,
                            items: item
                        });
                    } else {
                        input.value = item;
                        this.updateDataset({
                            property: input.property,
                            value: item
                        });
                    }
                    return input;
                });
            }
        },
        save({ property, items, value }) {
            this.updateDataset({ property, items, value });
            this.$store.commit("saveToGraph", {
                "@type": "Dataset",
                ...cloneDeep(this.dataset)
            });
            this.writeCrateToDisk();
        },
        updateDataset({ property, items, value }) {
            if (value) this.dataset = { ...this.dataset, [property]: value };
            if (items) this.dataset = { ...this.dataset, [property]: items };
        },
        writeCrateToDisk() {
            this.saved = false;
            this.saving = true;
            crateTool.assembleCrate({ data: this.$store.state.graph });
            crateTool.writeCrate({ target: this.$store.state.target });
            setTimeout(() => {
                this.saving = false;
                this.saved = true;
            }, 1000);
        }
    }
};
</script>

<style lang="scss" scoped>
.style-controls-row {
    width: 700px;
}
</style>
