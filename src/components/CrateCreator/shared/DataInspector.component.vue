<template>
    <el-drawer
        :with-header="false"
        :visible="drawer"
        direction="rtl"
        size="50%"
        @close="close"
    >
        <div class="flex flex-col bg-gray-200 h-full">
            <div class="m-4">
                <div class="text-xl my-2">{{ title }}</div>
                <div class="flex flex-row justify-around my-2">
                    <el-button
                        ref="graphSelectionBtn"
                        @click="inspect('graph')"
                        type="primary"
                        class="hover:bg-orange-200 hover:text-gray-800"
                        :class="{
                            'bg-orange-200 text-gray-800': title === 'Graph',
                        }"
                    >
                        <i class="fas fa-eye"></i> inspect graph
                    </el-button>
                                        <el-button
                        ref="datasetSelectionBtn"
                        @click="inspect('dataset')"
                        type="primary"
                        class="hover:bg-orange-200 hover:text-gray-800"
                        :class="{
                            'bg-orange-200 text-gray-800': title === 'Dataset',
                        }"
                    >
                        <i class="fas fa-eye"></i> inspect root dataset
                    </el-button>
                    <el-button
                        ref="crateSelectionBtn"
                        @click="inspect('crate')"
                        type="primary"
                        class="hover:bg-orange-200 hover:text-gray-800"
                        :class="{
                            'bg-orange-200 text-gray-800': title === 'Crate',
                        }"
                    >
                        <i class="fas fa-eye"></i> inspect crate
                    </el-button>
                </div>
                <div>
                    <el-input
                        v-model="filter"
                        placeholder="search for id or type - case sensitive"
                        v-if="title === 'Graph'"
                        @input="debouncedFilterGraph"
                    ></el-input>
                </div>
                <div class="p-4 rounded style-content-area overflow-scroll">
                    <pre>{{ content }}</pre>
                </div>
            </div>
        </div>
    </el-drawer>
</template>

<script>
import { debounce, isString } from "lodash";
import CrateTool from "components/CrateCreator/crate-tools";
const crateTool = new CrateTool();

export default {
    props: {
        drawer: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            content: {},
            title: undefined,
            filter: undefined,
            debouncedFilterGraph: debounce(this.filterGraph, 100),
        };
    },
    watch: {
        drawer: function(n, o) {
            if (n) this.inspect("graph");
        },
    },
    methods: {
        inspect(target) {
            switch (target) {
                case "dataset":
                    this.content = {
                        ...this.$store.state.itemsByType["RootDataset"][0],
                    };
                    this.title = "Dataset";
                    break;
                case "graph":
                    this.content = [...this.$store.state.graph];
                    this.title = "Graph";
                    break;
                case "crate":
                    crateTool.assembleCrate({
                        data: this.$store.state.graph,
                    });
                    this.content = crateTool.crate;
                    this.title = "Crate";
            }
            setTimeout(() => {
                this.$refs.datasetSelectionBtn.$el.blur();
                this.$refs.graphSelectionBtn.$el.blur();
                this.$refs.crateSelectionBtn.$el.blur();
            }, 100);
        },
        filterGraph() {
            if (!this.filter) {
                this.content = [...this.$store.state.graph];
            } else {
                this.content = this.$store.state.graph.filter((item) => {
                    let uuidMatch = item.uuid.match(this.filter);
                    let type = item["@type"];
                    if (isString(type)) type = [type];
                    let typeMatch = type.join(", ").match(this.filter);
                    return uuidMatch || typeMatch;
                });
            }
        },
        close() {
            this.filter = undefined;
            this.$emit("close");
        },
    },
};
</script>

<style lang="scss" scoped>
.style-content-area {
    height: calc(100vh - 150px);
}
</style>
