<template>
    <div class="flex flex-col">
        <div
            class="flex flex-row border-b-2 border-gray-400 p-1"
            v-if="profile"
        >
            <div>
                <el-button @click="selectNewProfile" type="danger" size="small">
                    <i class="fas fa-trash-alt"></i>
                </el-button>
            </div>
            <div class="ml-2 pt-1">Profile: {{ profile }}</div>
        </div>
        <div v-else>
            <div class="text-lg text-center">
                In order to describe a data folder you will need to create a
                Research Object Crate (ROCrate) metadata file.
            </div>
            <select-default-profile-component
                @store-profile="storeProfile"
                class="m-4"
            />
            <load-external-profile-component
                @store-profile="storeProfile"
                class="m-4"
            />
        </div>
    </div>
</template>

<script>
import SelectDefaultProfileComponent from "./SelectDefaultProfile.component.vue";
import LoadExternalProfileComponent from "./LoadExternalProfile.component.vue";

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
        return {};
    },
    methods: {
        storeProfile(profile) {
            this.$store.commit("setProfile", { profile });
        },
        selectNewProfile() {
            this.$store.commit("setProfile", { profile: null });
        },
    },
};
</script>

<style lang="scss" scoped></style>
