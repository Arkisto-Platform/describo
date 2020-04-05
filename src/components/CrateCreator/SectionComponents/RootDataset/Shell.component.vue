<template>
    <div class="flex flex-col">
        <div class="w-full lg:w-1/2 border-b-2 pb-2">
            <div class="flex flex-row">
                <div v-show="saving" class="text-orange-600 pt-2">
                    <i class="fas fa-save"></i> saving the crate
                </div>
                <div v-show="saved" class="text-green-600 pt-2">
                    <i class="fas fa-check"></i> saved
                </div>
                <el-alert
                    v-if="error"
                    :title="error.title"
                    :description="error.description"
                    type="error"
                    effect="dark"
                    :closable="false"
                >
                </el-alert>
            </div>
        </div>
        <div v-for="(template, idx) of profileInputs" :key="idx">
            <render-entry-component
                :template="template"
                :reference="dataset.uuid"
                :data="dataset[template.property]"
            />
        </div>
    </div>
</template>

<script>
import RenderEntryComponent from "components/CrateCreator/SectionComponents/RenderEntry.component.vue";
import RenderItemComponent from "components/CrateCreator/SectionComponents/RenderItem.component.vue";
import { cloneDeep } from "lodash";
import CrateTool from "components/CrateCreator/crate-tools";
const crateTool = new CrateTool();

export default {
    components: {
        RenderEntryComponent,
        RenderItemComponent
    },
    data() {
        return {
            saved: false,
            saving: false,
            error: undefined
        };
    },
    computed: {
        dataset: function() {
            this.writeCrateToDisk();
            return this.$store.getters.getItemsByType("RootDataset")[0];
        },
        profileInputs: function() {
            return this.$store.state.profileInputs;
        }
    },
    methods: {
        async writeCrateToDisk() {
            this.error = undefined;
            this.saved = false;
            this.saving = true;
            try {
                crateTool.assembleCrate({ data: this.$store.state.graph });
                await crateTool.writeCrate({
                    target: this.$store.state.target
                });
                setTimeout(() => {
                    this.saving = false;
                    this.saved = true;
                }, 1500);
            } catch (error) {
                this.error = {
                    title: "There was a problem saving the crate.",
                    description: error.message
                };
                this.saving = false;
                this.saved = false;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.style-controls-row {
    width: 700px;
}

.blinking {
    animation: blinkingText 1s infinite;
}
@keyframes blinkingText {
    50% {
        opacity: 0;
    }
}
</style>
