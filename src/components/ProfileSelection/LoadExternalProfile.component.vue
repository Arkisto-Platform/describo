<template>
    <div class="flex flex-row">
        <div class="text-lg text-right pr-10 pt-12 w-1/2 border-r-2">
            Or load a custom profile.
        </div>
        <div class="flex flex-col w-1/2 pl-2 space-y-6">
            <div class="flex flex-row">
                <div class="pt-3 mr-2">
                    Load a custom profile from a local file.
                </div>
                <div class="my-2">
                    <el-button
                        type="primary"
                        round
                        @click="selectFolder"
                        size="small"
                    >
                        <i class="fas fa-folder-open"></i> select file
                    </el-button>
                </div>
            </div>
            <div class="flex flex-col my-2">
                <div>Load a custom profile from a URL.</div>
                <div class="flex flex-row space-x-2">
                    <div class="flex-grow">
                        <el-input type="text" v-model="url"></el-input>
                    </div>
                    <el-button
                        type="primary"
                        round
                        @click="loadRemoteProfile"
                        size="small"
                    >
                        <i class="fas fa-globe"></i> load profile
                    </el-button>
                </div>
            </div>
            <div class="flex flex-col">
                <div>Select a previously loaded custom profile.</div>
                <div
                    v-for="profile of profiles"
                    :key="profile.name"
                    class="cursor-pointer hover:text-orange-500"
                    @click="loadProfile(profile)"
                >
                    <i class="fas fa-chevron-right"></i>&nbsp;
                    {{ profile.name }} (version: {{ profile.version }})
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { remote } from "electron";
import { readJSON } from "fs-extra";
import { basename } from "path";
import { uniqBy, orderBy } from "lodash";
import isUrl from "validator/lib/isUrl";

export default {
    data() {
        return { url: undefined };
    },
    computed: {
        profiles: function() {
            return JSON.parse(localStorage.getItem("profiles"));
        },
    },
    methods: {
        async selectFolder() {
            let file = await remote.dialog.showOpenDialog({
                properties: ["openFile"],
            });
            if (file.filePaths.length) {
                file = file.filePaths[0];
                let profile = await readJSON(file);
                this.storeProfile({ profile, location: file });
            }
        },
        async loadRemoteProfile() {
            const checkOptions = {
                require_host: true,
                require_protocol: true,
                required_valid_protocol: true,
                require_tld:
                    process.env.NODE_ENV === "development" ? false : true,
            };
            if (!isUrl(this.url, checkOptions)) {
                this.$message({
                    showClose: true,
                    message: `That doesn't look like a valid URL.`,
                    type: "error",
                });
                return;
            }
            let response = await fetch(this.url);
            if (response.status !== 200) {
                this.$message({
                    showClose: true,
                    message: `There was an error retrieving that profile.`,
                    type: "error",
                });
                return;
            }
            const profile = await response.json();
            this.storeProfile({ profile, location: this.url });
        },
        storeProfile({ profile, location }) {
            let profiles = JSON.parse(localStorage.getItem("profiles")) || [];

            profile = {
                ...profile.metadata,
                location,
                profile,
            };
            profiles = profiles.filter((p) => p.name !== profile.name);
            profiles.push(profile);
            profiles = orderBy(profiles, ["name", "version"]);
            localStorage.setItem("profiles", JSON.stringify(profiles));
            this.$emit("store-profile", profile.name);
        },
        loadProfile(profile) {
            this.$emit("store-profile", profile.name);
        },
    },
};
</script>

<style lang="scss" scoped></style>
