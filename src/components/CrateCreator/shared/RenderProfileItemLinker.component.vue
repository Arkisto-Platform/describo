<template>
    <div class="flex flex-col" :class="{ 'p-4 bg-teal-200': showLinker }">
        <div class="flex flex-row">
            <el-button
                class="mr-2"
                @click="showLinker = !showLinker"
                type="primary"
                size="small"
            >
                <i class="fas fa-link"></i>
            </el-button>
            <div v-if="showLinker" class="mr-2">
                <el-select
                    v-model="selectedType"
                    placeholder="Select"
                    size="small"
                    class="style-select"
                >
                    <el-option
                        v-for="item in enabledTypes"
                        :key="item"
                        :label="item"
                        :value="item"
                    >
                    </el-option>
                </el-select>
            </div>
        </div>
        <select-existing-entry-component
            :type="selectedType"
            v-if="selectedType && showLinker"
            @selection="linkSelection"
        />
    </div>
</template>

<script>
import { difference, isString } from "lodash";
import SelectExistingEntryComponent from "components/CrateCreator/CoreComponents/SelectExistingEntry.component.vue";
import { SimpleTypes } from "components/CrateCreator/CoreComponents/simple/component.mixins";
import { linkParentAndItem } from "components/CrateCreator/tools";

export default {
    components: {
        SelectExistingEntryComponent,
    },
    props: {
        types: {
            type: String | Array,
            required: true,
        },
        parentId: {
            type: String,
            required: true,
        },
        property: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            showLinker: false,
            enabledTypes: [],
            selectedType: undefined,
        };
    },
    mounted() {
        this.setup();
    },
    methods: {
        setup() {
            this.selectedType = undefined;
            let types = this.types;
            if (isString(types)) types = [types];
            this.enabledTypes = difference(types, SimpleTypes);
        },
        linkSelection(selection) {
            linkParentAndItem({
                store: this.$store,
                parentId: this.parentId,
                itemId: selection.uuid,
                property: this.property,
            });
            this.$emit("done");
            this.showLinker = false;
            this.selectedType = undefined;
        },
    },
};
</script>

<style lang="scss" scoped>
.style-select {
    width: 400px;
}
</style>
