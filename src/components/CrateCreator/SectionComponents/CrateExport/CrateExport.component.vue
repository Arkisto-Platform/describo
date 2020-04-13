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
                    A crate can be exported as a Zip archive or a BagIt Bag.
                </div>
                <div class="flex flex-col my-4">
                    <div>
                        <el-button @click="selectFolder">
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
                    <div>
                        <!-- <el-input :value="archiveName" :disabled="true"></el-input> -->
                        {{ archiveName }}
                    </div>
                    <div class="text-sm text-gray-600">
                        The name of the archive that will be created.
                    </div>
                </div>
                <div class="flex flex-col my-4">
                    <div class="flex flex-row">
                        <el-radio v-model="exportType" label="zip"
                            >Zip Archive</el-radio
                        >
                        <el-radio v-model="exportType" label="bag"
                            >BagIt Bag</el-radio
                        >
                    </div>
                    <div class="text-sm text-gray-600">
                        Please specify the type of archive to produce.
                    </div>
                </div>
                <div class="flex flex-col">
                    <div
                        class="flex flex-row justify-center my-4"
                        type="success"
                    >
                        <el-button
                            @click="createArchive"
                            type="success"
                            :disabled="exporting"
                            v-if="folder && archiveName"
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
            exportType: "zip",
            archiveName: `${format(new Date(), "yyyyMMddHHMM")}-ro-crate`,
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
            folder = folder.filePaths[0];
            if (
                isAcceptableTarget({
                    source: this.$store.state.target.folder,
                    target: folder,
                })
            ) {
                this.folder = folder;
                this.error = undefined;
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
            if (this.exportType === "zip") {
                this.exporting = true;
                await exporter.exportZip({
                    zipFileName: `${this.archiveName}.zip`,
                });
                this.exported = true;
                setTimeout(() => {
                    this.exported = false;
                    this.exporting = false;
                    this.aborted = false;
                    this.folder = undefined;
                    this.progressPercentage = 0;
                }, 1500);
            }
        },
        cancelExport() {
            EventBus.$emit("abort");
            this.aborted = true;
        },
        reportProgress(progress) {
            this.progressPercentage = round(
                (progress.entries.processed / progress.entries.total) * 100
            );
        },
    },
};
</script>

<style lang="scss" scoped></style>
