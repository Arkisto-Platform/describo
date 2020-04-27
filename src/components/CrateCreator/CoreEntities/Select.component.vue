<template>
    <div class="flex flex-row">
        <el-select
            class="w-full"
            v-model="value"
            placeholder="Select"
            @change="save"
            v-if="template.required || enabled"
        >
            <el-option
                v-for="(option, idx) in template.options"
                :key="idx"
                :label="option"
                :value="option"
            >
            </el-option>
        </el-select>
    </div>
</template>

<script>
import SimpleComponentMixins from "./SimpleComponentMixins";
export default {
    mixins: [SimpleComponentMixins],
};
</script>

<style lang="scss" scoped></style>
