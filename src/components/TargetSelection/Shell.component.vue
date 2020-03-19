<template>
    <div class="flex flex-col">
        <div
            class="flex flex-row border-2 border-gray-400 rounded-lg p-4"
            v-if="target"
        >
            <div class="pt-2">Describing: {{ target }}</div>
            <div class="flex-grow"></div>
            <div>
                <el-button @click="describeNewFolder" type="danger">
                    <i class="fas fa-trash-alt"></i>
                </el-button>
            </div>
        </div>
        <div class="flex flex-col" v-if="!target">
            <div class="text-lg text-center">
                Get started by selecting the content you wish to describe.
                <span class="text-indigo-700">
                    The RO-crate metadata file will be automatically saved to
                    this location as you construct it.
                </span>
            </div>
            <el-tabs
                tab-position="left"
                type="border-card"
                class="mt-4 style-tab-container"
            >
                <el-tab-pane label="Local Folders">
                    <local-folder-component @set-target="setTarget" />
                </el-tab-pane>
                <el-tab-pane label="Amazon S3">
                    <amazon-s3-component @set-target="setTarget" />
                </el-tab-pane>
                <el-tab-pane label="Google Drive">
                    <google-drive-component @set-target="setTarget" />
                </el-tab-pane>
                <el-tab-pane label="Microsoft OneDrive">
                    <microsoft-one-drive-component @set-target="setTarget" />
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
        target: function() {
            return this.$store.state.target;
        }
    },
    data() {
        return {};
    },
    methods: {
        setTarget(target) {
            this.$store.commit("setTarget", target);
        },
        describeNewFolder() {
            this.$store.commit("setTarget", null);
        }
    }
};
</script>

<style lang="scss" scoped>
.style-tab-container {
    height: 500px;
}
</style>
