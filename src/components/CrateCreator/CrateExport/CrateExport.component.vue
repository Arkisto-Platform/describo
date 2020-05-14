<template>
    <el-drawer
        :with-header="false"
        :visible="drawer"
        direction="rtl"
        size="50%"
        @close="$emit('close')"
    >
        <div class="flex flex-col p-4 bg-blue-100 h-full" v-if="drawer">
            <div v-if="localCrateFolder">
                <div class="text-lg">Export my RO-Crate</div>
                <div class="mt-6 mb-4">
                    A crate can be exported as a plain Zip archive or a BagIt
                    Bag.
                </div>
                <div class="flex flex-col my-4">
                    <div>
                        <el-button
                            @click="selectFolder"
                            type="primary"
                            round
                            class="focus:outline-none focus:border-2 focus:border-blue-600"
                        >
                            <i class="fas fa-folder-open"></i> select folder
                        </el-button>
                    </div>
                    <div class="text-sm text-gray-600">
                        Please select a location to save the export. You can't
                        save the export to the same folder you're archiving or a
                        subpath of it.
                    </div>
                    <el-alert
                        :title="error"
                        type="error"
                        effect="dark"
                        :center="true"
                        :closable="false"
                        v-if="error"
                    >
                    </el-alert>
                </div>

                <div class="flex flex-col my-4">
                    <div class="flex flex-row">
                        <el-checkbox v-model="bagIt" label="bag">
                            BagIt
                        </el-checkbox>
                    </div>
                    <div class="text-sm text-gray-600">
                        Should a BagIt bag be created?
                    </div>
                </div>
                <div class="flex flex-col my-4" v-if="archiveName">
                    <div>
                        {{ archiveName }}
                    </div>
                    <div class="text-sm text-gray-600">
                        The name of the archive that will be created.
                    </div>
                </div>
                <div class="flex flex-col">
                    <div
                        class="flex flex-row justify-center my-4"
                        type="success"
                    >
                        <el-button
                            @click="createArchive"
                            type="primary"
                            :disabled="exporting"
                            round
                            class="focus:outline-none focus:border-2 focus:border-blue-600"
                            v-if="folder"
                            >Create Archive at {{ folder }}</el-button
                        >
                    </div>
                    <div class="flex flex-row" v-if="exporting">
                        <el-progress
                            :percentage="progressPercentage"
                            type="line"
                            class="pt-2 flex-grow"
                        ></el-progress>
                        <div>
                            <el-button
                                @click="cancelExport"
                                type="danger"
                                :disabled="aborted"
                                class="focus:outline-none focus:border-2 focus:border-red-600"
                            >
                                <i class="far fa-stop-circle"></i> Stop Export
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                It's not currently possible to export a crate from a remote
                datasource.
            </div>
        </div>
    </el-drawer>
</template>

<script>
import { debounce, round } from "lodash";
import { remote } from "electron";
import CrateExporter from "./crate-export";
import { isAcceptableTarget } from "./crate-export";
import { format } from "date-fns";
import EventBus from "./eventbus";
import path from "path";

export default {
    props: {
        drawer: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            folder: undefined,
            bagIt: false,
            archiveName: undefined,
            exported: false,
            exporting: false,
            progressPercentage: 0,
            aborted: false,
            error: undefined,
        };
    },
    computed: {
        localCrateFolder: function() {
            return this.$store.state.target.type === "local";
        },
    },
    mounted() {
        EventBus.$on("progress", this.reportProgress);
    },
    methods: {
        async selectFolder() {
            let folder = await remote.dialog.showOpenDialog({
                properties: ["openDirectory"],
            });
            if (folder.canceled) return;
            folder = folder.filePaths[0];
            if (
                isAcceptableTarget({
                    source: this.$store.state.target.folder,
                    target: folder,
                })
            ) {
                this.folder = folder;
                this.error = undefined;
                const basename = path.basename(this.$store.state.target.folder);
                this.archiveName = `${basename}-${format(
                    new Date(),
                    "yyyy-MM-dd-HH-MM"
                )}.ro-crate`;
            } else {
                this.error = `You can't export the archive to the path that you're archiving.`;
                this.folder = undefined;
            }
        },
        async createArchive() {
            const exporter = new CrateExporter({
                source: this.$store.state.target.folder,
                target: this.folder,
            });

            this.exporting = true;
            await exporter.export({
                zipFileName: `${this.archiveName}.zip`,
                bagIt: this.bagIt,
            });
            this.exported = true;
            setTimeout(() => {
                this.exported = false;
                this.exporting = false;
                this.aborted = false;
                this.folder = undefined;
                this.progressPercentage = 0;
                this.archiveName = undefined;
            }, 1500);
        },
        cancelExport() {
            EventBus.$emit("abort");
            this.aborted = true;
        },
        reportProgress(progress) {
            this.progressPercentage = round(
                (progress.fs.processedBytes / progress.fs.totalBytes) * 100
            );
        },
    },
};
</script>

<style lang="scss" scoped></style>
