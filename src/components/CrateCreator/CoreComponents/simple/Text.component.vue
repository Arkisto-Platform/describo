<template>
    <div class="flex flex-col">
        <div class="flex flex-row">
            <el-input
                class="w-full"
                @focus="focus"
                @input="debouncedSave"
                v-model="value"
                v-if="template.enabled || template.required"
            ></el-input>
        </div>
    </div>
</template>

<script>
import SimpleComponentMixins from "./SimpleComponentMixins";
export default {
    mixins: [SimpleComponentMixins],
};
</script>

<style lang="scss" scoped></style>
