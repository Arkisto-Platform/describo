<template>
    <div class="flex flex-row">
        <el-input
            class="style-text-input w-full"
            @focus="focus"
            @input="debouncedSave"
            type="textarea"
            rows="5"
            v-model="value"
            :required="template.required"
            v-if="template.required || enabled"
        ></el-input>
        <remove-control
            type="Text"
            @cancel="cancel"
            v-if="!template.required && enabled"
        />
        <div v-if="saved" class="ml-2 text-green-600 pt-1">
            <i class="far fa-check-circle fa-2x"></i>
        </div>
    </div>
</template>

<script>
import SimpleComponentMixins from "./SimpleComponentMixins";
import { debounce } from "lodash";

export default {
    mixins: [SimpleComponentMixins],
    data() {
        return {
            debouncedSave: debounce(this.save, 2000),
        };
    },
};
</script>

<style lang="scss" scoped></style>
