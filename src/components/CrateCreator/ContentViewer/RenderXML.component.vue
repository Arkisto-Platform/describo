<template>
    <pre class="xml style-preview overflow-scroll bg-black">
            <code v-html="fileContent"></code>
        </pre>
</template>

<script>
import { readFile } from "fs-extra";
import hljs from "highlight.js";
import xml from "highlight.js/lib/languages/xml";
hljs.registerLanguage("xml", xml);
import "highlight.js/styles/vs2015.css";

export default {
    props: {
        path: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            fileContent: undefined,
        };
    },
    mounted() {
        this.loadDocument();
    },
    methods: {
        async loadDocument() {
            this.fileContent = hljs.highlight(
                "xml",
                await readFile(this.path, "utf-8")
            ).value;
        },
    },
};
</script>

<style lang="scss" scoped>
.style-preview {
    height: 500px;
}
</style>
