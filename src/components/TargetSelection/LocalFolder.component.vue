<template>
    <div class="flex flex-col">
        <div>Select a folder on this computer.</div>
        <div class="my-4">
            This includes remote resources like Dropbox and corporate file
            shares which are connected to this machine.
        </div>
        <div class="flex flex-row">
            <div>
                <el-button @click="selectFolder">
                    <i class="fas fa-folder-open"></i> select folder
                </el-button>
            </div>
            <div class="flex-grow"></div>
        </div>
    </div>
</template>

<script>
import { remote } from "electron";

export default {
    data() {
        return {
            folder: undefined,
            data: []
        };
    },
    methods: {
        async selectFolder() {
            let folder = await remote.dialog.showOpenDialog({
                properties: ["openDirectory"]
            });
            this.folder = folder.filePaths[0];
            this.$emit("browse-target", { type: "local", folder: this.folder });
        }
    }
};
</script>
