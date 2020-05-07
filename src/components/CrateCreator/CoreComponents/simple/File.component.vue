<template>
    <div>
        <div class="border-b-2 m-2 p-2">
            <div class="flex flex-row space-x-2">
                <div class="text-xl">File: {{ properties.uuid }}</div>
                <div class="flex-grow"></div>
                <div>
                    <el-button
                        @click="showContent = !showContent"
                        type="primary"
                        size="small"
                    >
                        <i class="fas fa-eye"></i>
                        <span v-show="showContent">hide</span>
                        <span v-show="!showContent">show</span>
                        content
                    </el-button>
                </div>
                <div>
                    <el-button @click="done" type="success" size="small">
                        <i class="fas fa-check"></i> done
                    </el-button>
                </div>
            </div>
        </div>

        <div class="flex flex-row">
            <div
                class="set-input-height overflow-scroll"
                :class="{ 'w-1/2': showContent, 'w-full': !showContent }"
            >
                <render-profile-component :uuid="uuid" />
            </div>
            <div class="px-2 w-1/2" v-if="showContent">
                <content-viewer-component :properties="properties" />
            </div>
        </div>
    </div>
</template>

<script>
import { save, restore } from "./file.js";
import { getParams } from "components/CrateCreator/tools";
import ContentViewerComponent from "components/CrateCreator/ContentViewer/Shell.component.vue";

export default {
    components: {
        ContentViewerComponent,
        RenderProfileComponent: () =>
            import("components/CrateCreator/shared/RenderProfile.component"),
    },
    props: {
        uuid: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            properties: {},
            showContent: true,
        };
    },
    created() {
        const properties = restore({
            store: this.$store,
            id: this.uuid,
        });
        this.$data.properties = { ...properties };
    },
    methods: {
        done() {
            this.$emit("done");
        },
    },
};
</script>

<style lang="scss" scoped>
.set-input-height {
    height: calc(100vh - 450px);
}
</style>
