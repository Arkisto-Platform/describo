<template>
    <div class="p-4 flex flex-col">
        <div>
            <el-button type="primary">
                <router-link to="onboarding" class="mx-2">
                    View Help
                </router-link>
            </el-button>
        </div>
        <el-tabs class="">
            <el-tab-pane label="">
                <span slot="label" class="text-xl text-gray-700 font-light">
                    Manage Stored Entities
                </span>
                <managed-stored-entities-component />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import ManagedStoredEntitiesComponent from "./ManageStoredEntities.component.vue";
export default {
    components: {
        ManagedStoredEntitiesComponent,
    },
    data() {
        return {};
    },
};
</script>
