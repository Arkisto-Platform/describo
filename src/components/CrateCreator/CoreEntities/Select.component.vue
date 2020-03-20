<template>
    <div class="flex flex-row">
        <el-select
            v-model="value"
            placeholder="Select"
            @change="save"
            v-if="input.required || enabled"
        >
            <el-option
                v-for="(option, idx) in input.options"
                :key="idx"
                :label="option"
                :value="option"
            >
            </el-option>
        </el-select>
        <add-control
            type="Select"
            @add="add"
            v-if="!input.required && !enabled"
        />
        <remove-control
            type="Text"
            @cancel="cancel"
            v-if="!input.required && enabled"
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
