<template>
    <el-drawer
        :with-header="false"
        :visible="drawer"
        direction="rtl"
        size="50%"
        @close="$emit('close')"
    >
        <div class="flex flex-col bg-gray-200 h-full">
            <div class="m-4">
                <div class="text-xl my-2">{{ title }}</div>
                <div class="flex flex-row my-2">
                    <el-button
                        ref="datasetSelectionBtn"
                        @click="inspect('dataset')"
                        type="primary"
                        class="hover:bg-orange-200 hover:text-gray-800"
                        :class="{
                            'bg-orange-200 text-gray-800': title === 'Dataset'
                        }"
                    >
                        <i class="fas fa-eye"></i> inspect dataset
                    </el-button>
                    <el-button
                        ref="graphSelectionBtn"
                        @click="inspect('graph')"
                        type="primary"
                        class="hover:bg-orange-200 hover:text-gray-800"
                        :class="{
                            'bg-orange-200 text-gray-800': title === 'Graph'
                        }"
                    >
                        <i class="fas fa-eye"></i> inspect graph
                    </el-button>
                    <el-button
                        ref="crateSelectionBtn"
                        @click="inspect('crate')"
                        type="primary"
                        class="hover:bg-orange-200 hover:text-gray-800"
                        :class="{
                            'bg-orange-200 text-gray-800': title === 'Crate'
                        }"
                    >
                        <i class="fas fa-eye"></i> inspect crate
                    </el-button>
                </div>
                <div>
                    <el-input
                        v-model="filterId"
                        placeholder="search for id"
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
import { debounce } from "lodash";
import CrateTool from "components/CrateCreator/crate-tools";
const crateTool = new CrateTool();

export default {
    props: {
        data: {
            type: Object
        },
        drawer: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            content: {},
            title: undefined,
            filterId: undefined,
            debouncedFilterGraph: debounce(this.filterGraph, 100)
        };
    },
    watch: {
        drawer: function(n, o) {
            if (n) this.data ? this.inspect("dataset") : this.inspect("graph");
        }
    },
    methods: {
        inspect(target) {
            switch (target) {
                case "dataset":
                    this.content = { ...this.data };
                    this.title = "Dataset";
                    break;
                case "graph":
                    this.content = [...this.$store.state.graph];
                    this.title = "Graph";
                    break;
                case "crate":
                    crateTool.assembleCrate({
                        data: this.$store.state.graph
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
            if (!this.filterId) {
                this.content = [...this.$store.state.graph];
            } else {
                this.content = this.$store.state.graph.filter(item =>
                    item.uuid.match(this.filterId)
                );
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.style-content-area {
    height: calc(100vh - 150px);
}
</style>
