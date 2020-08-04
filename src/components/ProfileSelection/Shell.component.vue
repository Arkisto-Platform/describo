<template>
    <div class="flex flex-col">
        <div
            class="flex flex-row p-1 border-b-2 border-gray-400"
            v-if="profile"
        >
            <div>
                <el-button
                    @click="selectNewProfile"
                    type="primary"
                    size="small"
                    class="focus:outline-none focus:border-2 focus:border-red-600"
                >
                    <i class="fas fa-times"></i>
                </el-button>
            </div>
            <div class="ml-2 text-xl text-gray-700 font-light">
                {{ profile.metadata.name }} (v{{ profile.metadata.version }})
            </div>
        </div>
        <div v-else class="flex flex-col mt-4">
            <div
                v-if="loading"
                class="flex flex-col justify-center items-center flex-grow style-loading-pane bg-gray-200"
            >
                <div class="text-xl text-gray-700 font-light">
                    Loading the profile and data packs. Hold on - this won't
                    take long.
                </div>
                <div class="my-2">
                    <i
                        class="text-gray-700 fas fa-circle-notch fa-spin fa-3x"
                    ></i>
                </div>
            </div>
            <div v-else>
                <div class="text-lg text-center">
                    In order to describe a data folder you will need to create a
                    Research Object Crate (ROCrate) metadata file.
                </div>
                <div class="flex flex-col mt-8">
                    <select-default-profile-component
                        @store-profile="storeProfile"
                        class="p-4 py-10 border-2 border-blue-200"
                    />
                    <div class="h-10"></div>
                    <load-external-profile-component
                        @store-profile="storeProfile"
                        class="p-4 py-10 border-2 border-blue-200"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SelectDefaultProfileComponent from "./SelectDefaultProfile.component.vue";
import LoadExternalProfileComponent from "./LoadExternalProfile.component.vue";
import ProfileLoader from "./profile-loader";
import internalTypeDefinitions from "components/profiles/types";
import { cloneDeep, uniq } from "lodash";
import { mappings } from "components/profiles/type-mappings";

export default {
    components: {
        SelectDefaultProfileComponent,
        LoadExternalProfileComponent,
    },
    computed: {
        profile: function() {
            return this.$store.state.profile;
        },
    },
    data() {
        return {
            loading: false,
        };
    },
    methods: {
        async storeProfile({ profile }) {
            this.loading = true;
            // load the profile and verify it
            const profileLoader = new ProfileLoader();
            const { valid, errors } = profileLoader.verify({ profile });
            if (!valid) {
                this.$message({
                    message:
                        "There are errors in that profile and it can't be loaded.",
                    type: "error",
                    duration: 10000,
                });
            } else {
                // save default type array mappings
                this.$store.commit("saveMappings", mappings);

                // override with type array mappings from profile if defined
                if (profile.mappings) {
                    this.$store.commit("saveMappings", profile.mappings);
                }

                // load any data packs defined in the profile
                await profileLoader.loadDataPacks({
                    database: this.$store.state.database,
                    $message: this.$message,
                    dataPacks: profile.dataPacks,
                });

                // load type definitions
                let types = {};
                if (
                    profile.enabledCoreTypes &&
                    profile.enabledCoreTypes.length
                ) {
                    profile.enabledCoreTypes = uniq([
                        ...profile.enabledCoreTypes,
                        "File",
                        "Dataset",
                    ]);
                    for (let type of profile.enabledCoreTypes) {
                        types[type] = internalTypeDefinitions[type];
                    }
                } else {
                    types = cloneDeep(internalTypeDefinitions);
                }
                types = { ...types, ...profile.typeDefinitions };

                // save type definitions
                this.$store.commit("saveTypeDefinitions", types);

                // commit the profile
                this.$store.commit("saveProfile", { profile });

                // reset the internal data state
                this.$store.commit("reset");
            }
            this.loading = false;
        },
        selectNewProfile() {
            this.loading = false;
            this.$store.commit("saveProfile", { profile: undefined });
        },
    },
};
</script>

<style lang="scss" scoped>
.style-loading-pane {
    height: 500px;
}
</style>
