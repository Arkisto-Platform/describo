<template>
    <div class="flex flex-col">
        <div class="flex flex-row border-2 border-gray-400 rounded-lg p-4" v-if="folder">
            <div class="pt-2">Describing: {{folder}}</div>
            <div class="flex-grow"></div>
            <div>
                <el-button @click="describeNewFolder" type="danger">
                    <i class="fas fa-trash-alt"></i>
                </el-button>
            </div>
        </div>
        <div class="flex flex-col" v-if="!folder">
            <div>Get started by selecting a folder of content to describe.</div>
            <el-tabs tab-position="left" type="border-card" class="mt-4 style-tab-container">
                <el-tab-pane label="Local Folders">
                    <local-folder-component @folder-selected="storeFolder" />
                </el-tab-pane>
                <el-tab-pane label="Amazon S3">
                    <amazon-s3-component @folder-selected="storeFolder" />
                </el-tab-pane>
                <el-tab-pane label="Google Drive">
                    <google-drive-component @folder-selected="storeFolder" />
                </el-tab-pane>
                <el-tab-pane label="Microsoft OneDrive">
                    <microsoft-one-drive-component @folder-selected="storeFolder" />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import LocalFolderComponent from "./LocalFolder.component.vue";
import AmazonS3Component from "./AmazonS3.component.vue";
import GoogleDriveComponent from "./GoogleDrive.component.vue";
import MicrosoftOneDriveComponent from "./MicrosoftOneDrive.component.vue";
export default {
    components: {
        LocalFolderComponent,
        AmazonS3Component,
        GoogleDriveComponent,
        MicrosoftOneDriveComponent
    },
    computed: {
        folder: function() {
            return this.$store.state.folder;
        }
    },
    data() {
        return {};
    },
    methods: {
        storeFolder(folder) {
            this.$store.commit("setFolder", { folder });
        },
        describeNewFolder() {
            this.$store.commit("setFolder", { folder: null });
        }
    }
};
</script>

<style lang="scss" scoped>
.style-tab-container {
    height: 500px;
}
</style>
