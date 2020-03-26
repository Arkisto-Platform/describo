<template>
    <div class="flex flex-col">
        <div class="flex flex-row">
            <root-dataset-selector-component
                v-if="showRootDatasetSelector"
                @load-selection="loadSelection"
            />
            <div
                class="flex flex-row w-full px-4"
                v-if="!showRootDatasetSelector"
            >
                <el-button @click="dataInspector = true" type="primary">
                    <i class="fas fa-eye"></i> inspect data
                </el-button>
                <div class="flex-grow"></div>
                <el-button @click="loadProfile" type="danger">
                    <i class="fas fa-trash-alt"></i>
                </el-button>
            </div>
        </div>
        <data-inspector-component
            :drawer="dataInspector"
            @close="dataInspector = false"
        />
        <el-tabs
            v-model="activeTab"
            tab-position="left"
            class="mt-4 border-t-2 pt-4"
            v-if="ready && !showRootDatasetSelector"
        >
            <el-tab-pane
                label="RO-Crate Root Dataset"
                name="crate"
                class="overflow-scroll set-tab-height m-2"
            >
                <!-- <root-dataset-component
                    :profile="rootDatasetProfile"
                    v-if="activeTab === 'crate'"
                /> -->
                <root-dataset-component :crate.sync="crate" />
            </el-tab-pane>
            <el-tab-pane label="Contents" name="parts">
                <crate-parts-component v-if="activeTab === 'parts'" />
            </el-tab-pane>
            <el-tab-pane label="People" name="people"></el-tab-pane>
            <el-tab-pane
                label="Organisations"
                name="organisations"
            ></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { cloneDeep, isObject } from "lodash";
import { generateId } from "components/CrateCreator/tools";
import ProfileLoader from "./profile-loader";
import RootDatasetComponent from "./SectionComponents/RootDataset/Shell.component.vue";
import CratePartsComponent from "./SectionComponents/CrateParts/Shell.component.vue";
import RootDatasetSelectorComponent from "./RootDatasetSelector.component.vue";
import DataInspectorComponent from "components/CrateCreator/SectionComponents/DataInspector.component.vue";
import CrateTool from "components/CrateCreator/crate-tools";
const crateTool = new CrateTool();

export default {
    components: {
        RootDatasetComponent,
        CratePartsComponent,
        RootDatasetSelectorComponent,
        DataInspectorComponent
    },
    data() {
        return {
            dataInspector: false,
            profile: {},
            rootDatasetProfile: {},
            showRootDatasetSelector: false,
            activeTab: "crate",
            ready: false,
            crate: {}
        };
    },
    beforeMount() {
        this.loadProfile();
    },
    methods: {
        async loadProfile() {
            const profileLoader = new ProfileLoader({
                name: this.$store.state.profile
            });
            const { profile } = await profileLoader.load();
            this.profile = cloneDeep(profile);
            const DatasetTypes = Object.keys(profile);
            if (DatasetTypes.length > 1) {
                this.showRootDatasetSelector = true;
            } else {
                const selection = DatasetTypes.pop();
                this.loadSelection(selection);
            }
        },
        async loadSelection(selection) {
            if (!selection) return;

            let rootDatasetName = {};
            let inputs = [];
            this.$store.commit("reset");
            const profile = cloneDeep(this.profile[selection]);
            this.crate = await this.loadCrate({ profile });
            this.showRootDatasetSelector = false;
            this.ready = true;
        },
        async loadCrate({ profile }) {
            let dataset = {
                "@type": "RootDataset",
                uuid: generateId()
            };
            let inputs = cloneDeep(profile.inputs);

            const crate = await crateTool.readCrate({
                target: this.$store.state.target
            });
            if (crate) {
                crate.forEach(element => {
                    this.$store.commit("saveToGraph", element);
                });

                const rootDataset = crate.filter(
                    e => e["@type"] === "RootDataset"
                )[0];
                dataset.uuid = rootDataset.uuid;
                inputs = inputs.map(input => {
                    if (input["@type"] === "Value") return input;

                    const item = rootDataset[input.property];
                    if (isObject(item)) {
                        input.items = cloneDeep(item);
                        dataset = { ...dataset, [input.property]: item };
                    } else {
                        input.value = item;
                        dataset = { ...dataset, [input.property]: input.value };
                    }
                    return input;
                });
            }
            return { dataset, inputs };
        }
    }
};
</script>

<style lang="scss" scoped>
.set-tab-height {
    height: calc(100vh - 400px);
}
</style>
