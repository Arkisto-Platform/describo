<template>
    <div class="flex flex-row">
        <el-input
            class="style-text-input"
            @focus="focus"
            @input="debouncedSave"
            v-model="value"
            :required="template.required"
            v-if="template.required || enabled"
        ></el-input>
        <add-control
            type="Text"
            @add="add"
            v-if="!template.required && !enabled"
        />
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

<style lang="scss" scoped>
.style-text-input {
    width: 500px;
}
</style>
