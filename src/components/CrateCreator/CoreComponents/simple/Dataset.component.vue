<template>
    <div>
        <div class="flex flex-row border-b-2 m-2 p-2">
            <div class="text-xl">Folder: {{ item.uuid }}</div>
            <div class="flex-grow"></div>
            <el-button @click="$emit('done')" type="success" size="small">
                <i class="fas fa-check"></i> done
            </el-button>
        </div>

        <div class="set-input-height overflow-scroll">
            <render-profile-component :uuid="uuid" />
        </div>
    </div>
</template>

<script>
import { save, restore } from "./dataset";
import { getParams } from "components/CrateCreator/tools";

export default {
    components: {
        RenderProfileComponent: () =>
            import("components/CrateCreator/shared/RenderProfile.component"),
    },
    props: {
        uuid: {
            type: String,
            required: true,
        },
    },
    computed: {
        item: function() {
            return this.$store.getters.getItemById(this.uuid);
        },
    },
    data() {
        return {};
    },
};
</script>

<style lang="scss" scoped>
.set-input-height {
    height: calc(100vh - 450px);
}
</style>
