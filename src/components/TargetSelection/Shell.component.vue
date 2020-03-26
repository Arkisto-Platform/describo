<template>
    <div class="flex flex-col">
        <div
            class="flex flex-row border-2 border-gray-400 rounded-lg p-4"
            v-if="target"
        >
            <div class="pt-2"><render-selected-target-component /></div>
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
            </div>
            <div class="text-lg text-center text-indigo-700">
                The RO-crate metadata file will be automatically saved to this
                location as you construct it.
            </div>
            <div class="flex flex-col">
                <el-tabs
                    tab-position="left"
                    type="border-card"
                    class="mt-4 style-tab-container"
                >
                    <el-tab-pane label="Local Folders">
                        <local-folder-component
                            @set-target="setTarget"
                            @browse-target="setBrowseTarget"
                        />
                    </el-tab-pane>
                    <el-tab-pane label="Amazon S3">
                        <amazon-s3-component @set-target="setTarget" />
                    </el-tab-pane>
                    <el-tab-pane label="Google Drive">
                        <google-drive-component @set-target="setTarget" />
                    </el-tab-pane>
                    <el-tab-pane label="Microsoft OneDrive">
                        <microsoft-one-drive-component
                            @set-target="setTarget"
                        />
                    </el-tab-pane>
                </el-tabs>
                <div class="flex flex-col p-4" v-if="browseTarget">
                    <div class="text-lg">Describo Target</div>
                    <file-tree-component
                        :browse-target="browseTarget"
                        class="style-tree-view overflow-scroll"
                    />
                    <div class="flex flex-row">
                        <div class="flex-grow"></div>
                        <el-button
                            type="success"
                            @click="setTarget"
                            :disabled="!this.browseTarget"
                        >
                            describe this target
                            <i class="fas fa-long-arrow-alt-right"></i
                        ></el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import LocalFolderComponent from "./LocalFolder.component.vue";
import AmazonS3Component from "./AmazonS3.component.vue";
import GoogleDriveComponent from "./GoogleDrive.component.vue";
import MicrosoftOneDriveComponent from "./MicrosoftOneDrive.component.vue";
import RenderSelectedTargetComponent from "./RenderSelectedTarget.component.vue";
import FileTreeComponent from "components/FileTree/FileTree.component.vue";
export default {
    components: {
        RenderSelectedTargetComponent,
        LocalFolderComponent,
        AmazonS3Component,
        GoogleDriveComponent,
        MicrosoftOneDriveComponent,
        FileTreeComponent
    },
    computed: {
        target: function() {
            return this.$store.state.target;
        }
    },
    data() {
        return {
            browseTarget: undefined
        };
    },
    methods: {
        setTarget() {
            this.$store.commit("setTarget", this.browseTarget);
            this.browseTarget = undefined;
        },
        setBrowseTarget(target) {
            this.browseTarget = undefined;
            setTimeout(() => {
                this.browseTarget = { ...target };
            }, 100);
        },
        describeNewFolder() {
            this.$store.commit("setTarget", null);
        }
    }
};
</script>

<style lang="scss" scoped>
.style-tab-container {
}

.style-tree-view {
    height: 400px;
}
</style>
