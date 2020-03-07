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
            <div>
                <el-button
                    type="success"
                    @click="describeThisFolder"
                    :disabled="!this.folder"
                >
                    <div class="pb-2 text-2xl inline-block">
                        describe this folder
                    </div>

                    <i
                        class="fas fa-long-arrow-alt-right fa-2x"
                        data-fa-transform="down-2"
                    ></i
                ></el-button>
            </div>
        </div>
        <div class="flex flex-col my-4" v-if="folder">
            <file-tree-component :folder="folder" />
        </div>
    </div>
</template>

<script>
import FileTreeComponent from "./FileTree.component.vue";
import { remote } from "electron";

export default {
    components: {
        FileTreeComponent
    },
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
        },
        describeThisFolder() {
            this.$emit("folder-selected", this.folder);
        }
    }
};
</script>
