<template>
    <div class="flex flex-col">
        <div class="flex flex-row border-b-2 border-gray-400 p-1" v-if="target">
            <div>
                <el-button
                    @click="describeNewFolder"
                    type="danger"
                    size="small"
                    class="focus:outline-none focus:border-2 focus:border-red-600"
                >
                    <i class="fas fa-trash-alt"></i>
                </el-button>
            </div>
            <render-selected-target-component class="ml-2 pt-1" />
        </div>
        <div class="flex flex-col" v-if="!target">
            <div
                class="text-2xl text-center bg-yellow-200 text-gray-800 font-light py-10"
            >
                Get started by selecting the content you wish to describe.
            </div>
            <!-- <div class="text-lg text-center text-indigo-700">
                The RO-crate metadata file will be automatically saved to this
                location as you construct it.
            </div> -->
            <div class="flex flex-col">
                <el-tabs class="mt-4 p-4 style-tab-container bg-gray-200">
                    <el-tab-pane label="Local Folders">
                        <span
                            slot="label"
                            class="text-xl text-gray-700 font-light"
                        >
                            Local Folders
                        </span>
                        <local-folder-component
                            @set-target="setTarget"
                            @browse-target="setBrowseTarget"
                        />
                    </el-tab-pane>
                    <!-- <el-tab-pane label="Amazon S3">
                        <amazon-s3-component @set-target="setTarget" />
                    </el-tab-pane>
                    <el-tab-pane label="Google Drive">
                        <google-drive-component @set-target="setTarget" />
                    </el-tab-pane>
                    <el-tab-pane label="Microsoft OneDrive">
                        <microsoft-one-drive-component
                            @set-target="setTarget"
                        />
                    </el-tab-pane> -->
                </el-tabs>
                <div class="flex flex-col p-4 mt-4 border" v-if="browseTarget">
                    <div class="flex flex-row">
                        <div class="text-2xl font-light text-gray-800 pt-2">
                            Describo Target
                        </div>
                        <div class="flex-grow"></div>
                        <div>
                            <el-button
                                type="primary"
                                @click="setTarget"
                                :disabled="!this.browseTarget"
                                round
                                class="focus:outline-none focus:border-2 focus:border-blue-600"
                            >
                                describe this target
                                <i class="fas fa-long-arrow-alt-right"></i
                            ></el-button>
                        </div>
                    </div>
                    <file-tree-component
                        :browse-target="browseTarget"
                        class="style-tree-view overflow-scroll"
                    />
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
        FileTreeComponent,
    },
    computed: {
        target: function() {
            return this.$store.state.target;
        },
    },
    data() {
        return {
            browseTarget: undefined,
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
            this.$store.commit("saveProfile", {});
            this.$store.commit("setActiveProfileType", undefined);
        },
    },
};
</script>

<style lang="scss" scoped>
.style-tree-view {
    height: 400px;
}
</style>
