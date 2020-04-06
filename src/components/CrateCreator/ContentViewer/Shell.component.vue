<template>
    <div>
        <component v-bind:is="component" :path="filePath"></component>
        <div class="text-center">
            There is currently no viewer available to display this content.
        </div>
    </div>
</template>

<script>
import path from "path";
import { readFile } from "fs-extra";

export default {
    components: {
        RenderImageComponent: () => import("./RenderImage.component.vue"),
        RenderAudioComponent: () => import("./RenderAudio.component.vue"),
        RenderVideoComponent: () => import("./RenderVideo.component.vue"),
    },
    props: {
        properties: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            component: undefined,
            imageTypes: ["jpg", "jpeg", "png", "gif", "svg"],
            audioTypes: ["mp3"],
            videoTypes: ["mov", "mp4"],
            documentFileExtensions: [
                "pdf",
                "doc",
                "docx",
                "xls",
                "xlsx",
                "ppt",
                "pptx",
            ],
            transcriptionFileExtensions: ["eaf", "trs", "ixt", "flextext"],
        };
    },
    computed: {
        filePath: function () {
            if (this.$store.state.target.type === "local") {
                return path.join(
                    "file://",
                    this.$store.state.target.folder,
                    this.properties.uuid
                );
            } else {
                return undefined;
            }
        },
    },
    mounted() {
        this.displayContent();
    },
    methods: {
        displayContent() {
            const extension = this.properties.uuid.split(".").pop();
            if (this.imageTypes.includes(extension)) {
                this.component = `RenderImageComponent`;
            } else if (this.audioTypes.includes(extension)) {
                this.component = `RenderAudioComponent`;
            } else if (this.videoTypes.includes(extension)) {
                this.component = `RenderVideoComponent`;
            }
        },
    },
};
</script>

<style lang="scss" scoped></style>
