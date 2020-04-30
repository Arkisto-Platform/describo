<template>
    <div class="flex flex-col">
        <div class="w-full lg:w-1/2 border-b-2 pb-2">
            <div class="flex flex-row space-x-2">
                <div v-if="development" class="flex flex-row space-x-2 pr-4">
                    <div>
                        <el-button
                            @click="
                                enableCrateWriteToDisk = !enableCrateWriteToDisk
                            "
                            :type="
                                enableCrateWriteToDisk ? 'danger' : 'success'
                            "
                            size="small"
                        >
                            <span v-if="enableCrateWriteToDisk">disable</span>
                            <span v-else>enable</span>
                            save
                        </el-button>
                    </div>
                    <div
                        v-if="!enableCrateWriteToDisk"
                        class="text-black text-xl bg-red-400 px-4 rounded"
                    >
                        save to disk is disabled
                    </div>
                </div>
                <div class="flex flex-row pt-1" v-if="enableCrateWriteToDisk">
                    <div v-show="saving" class="text-orange-600 mr-10">
                        <i class="fas fa-save"></i> saving the crate
                        <span v-if="enableCrateWriteToDisk">to disk</span>
                        <span v-else>internally - changes can be lost</span>
                    </div>
                    <div v-show="saved" class="text-green-600 mr-10">
                        <i class="fas fa-check"></i> saved
                        <span v-if="enableCrateWriteToDisk">to disk</span>
                        <span v-else>internally - changes can be lost</span>
                    </div>
                </div>
                <!-- <div v-show="!valid" class="text-red-600">
                    The crate is not yet valid. Ensure you fill in all of the
                    required properties.
                </div>
                <div v-show="valid" class="text-green-600">
                    The crate is valid.
                </div> -->

                <el-alert
                    v-if="error"
                    :title="error.title"
                    :description="error.description"
                    type="error"
                    effect="dark"
                    :closable="false"
                >
                </el-alert>
            </div>
        </div>
        <div class="overflow-scroll set-input-section-height">
            <render-profile-component :uuid="dataset.uuid" />
        </div>
    </div>
</template>

<script>
import RenderProfileComponent from "components/CrateCreator/shared/RenderProfile.component.vue";
import { cloneDeep } from "lodash";
import CrateTool from "components/CrateCreator/crate-tools";
const crateTool = new CrateTool();

export default {
    components: {
        RenderProfileComponent,
    },
    data() {
        return {
            saved: false,
            saving: false,
            error: undefined,
            valid: true,
            enableCrateWriteToDisk:
                process.env.NODE_ENV === "development" ? false : true,
        };
    },
    computed: {
        development: function() {
            return process.env.NODE_ENV === "development";
        },
        dataset: function() {
            this.writeCrateToDisk();
            return this.$store.getters.getItemsByType("RootDataset")[0];
        },
        profileInputs: function() {
            return this.$store.state.profileInputs;
        },
    },
    methods: {
        async writeCrateToDisk() {
            this.error = undefined;
            this.saved = false;
            this.saving = true;
            try {
                this.valid = crateTool.verifyCrate({
                    data: this.$store.state.graph,
                    inputs: this.$store.state.profileInputs,
                });
                crateTool.assembleCrate({ data: this.$store.state.graph });
                if (this.enableCrateWriteToDisk) {
                    await crateTool.writeCrate({
                        target: this.$store.state.target,
                    });
                }
                setTimeout(() => {
                    this.saving = false;
                    this.saved = true;
                }, 1500);
            } catch (error) {
                this.error = {
                    title: "There was a problem saving the crate.",
                    description: error.message,
                };
                this.saving = false;
                this.saved = false;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.set-input-section-height {
    height: calc(100vh - 320px);
}
.style-controls-row {
    width: 700px;
}
</style>
