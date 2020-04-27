<template>
    <div class="flex flex-col">
        <div>
            <el-button @click="toggleFullScreen" type="primary">
                <i class="fas fa-expand"></i>
            </el-button>
        </div>
        <div class="mt-2">
            <img :src="filePath" class="object-fill m-auto" />
        </div>
    </div>
</template>

<script>
import { orderBy, compact, cloneDeep } from "lodash";
const { FullScreenViewer } = require("iv-viewer");

export default {
    props: {
        path: {
            type: String,
            required: true,
        },
    },
    data() {
        return {};
    },
    computed: {
        filePath: function() {
            return `file:${this.path}`;
        },
    },
    methods: {
        toggleFullScreen() {
            const viewer = new FullScreenViewer({});
            viewer.show(this.filePath);
        },
    },
};
</script>

<style lang="scss" scoped></style>
