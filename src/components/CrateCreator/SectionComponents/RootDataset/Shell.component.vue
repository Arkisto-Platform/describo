<template>
    <div class="flex flex-col">
        <div class="style-controls-row border-b-2 pb-2">
            <div class="flex flex-row">
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
            <div v-for="(input, idx) of crate.inputs" :key="idx">
                <render-entry-component
                    :input="input"
                    :reference="crate.dataset.uuid"
                    @save="save"
                    @cancel="cancel"
                />
            </div>
        </div>
    </div>
</template>

<script>
import RenderEntryComponent from "components/CrateCreator/SectionComponents/RenderEntry.component.vue";
import { cloneDeep } from "lodash";
import CrateTool from "components/CrateCreator/crate-tools";
const crateTool = new CrateTool();

export default {
    components: {
        RenderEntryComponent
    },
    props: {
        crate: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            saved: false,
            saving: false,
            inputs: []
        };
    },
    methods: {
        save({ property, items, value }) {
            this.updateDataset({ property, items, value });
            this.$store.commit("saveToGraph", {
                "@type": "Dataset",
                ...cloneDeep(this.crate.dataset)
            });
            this.writeCrateToDisk();
        },
        cancel({ property }) {
            delete this.crate.dataset[property];
            this.crate.dataset = { ...this.crate.dataset };
            this.$store.commit("saveToGraph", {
                "@type": "Dataset",
                ...cloneDeep(this.crate.dataset)
            });
            this.writeCrateToDisk();
        },
        updateDataset({ property, items, value }) {
            if (value)
                this.crate.dataset = {
                    ...this.crate.dataset,
                    [property]: value
                };
            if (items)
                this.crate.dataset = {
                    ...this.crate.dataset,
                    [property]: items
                };
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
