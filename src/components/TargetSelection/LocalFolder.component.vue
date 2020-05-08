<template>
    <div class="flex flex-col items-center">
        <!-- <div class="text-xl font-bold mr-2">
                Select a folder on this computer
            </div> -->
        <div class="my-4">
            <el-button type="primary" @click="selectFolder" round>
                <i class="fas fa-folder-open"></i> Select a folder on this
                computer
            </el-button>
        </div>
        <div class="my-4 text-gray-600">
            This includes remote resources like Dropbox and corporate file
            shares which are connected to this machine.
        </div>
    </div>
</template>

<script>
import { remote } from "electron";

export default {
    data() {
        return {
            folder: undefined,
            data: [],
        };
    },
    methods: {
        async selectFolder() {
            let folder = await remote.dialog.showOpenDialog({
                properties: ["openDirectory"],
            });
            this.folder = folder.filePaths[0];
            this.$emit("browse-target", { type: "local", folder: this.folder });
        },
    },
};
</script>
