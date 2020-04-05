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
export default {
    mixins: [SimpleComponentMixins]
};
</script>

<style lang="scss" scoped></style>
