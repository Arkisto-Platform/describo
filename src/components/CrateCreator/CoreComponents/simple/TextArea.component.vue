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
