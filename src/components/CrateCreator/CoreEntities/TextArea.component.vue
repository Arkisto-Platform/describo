<template>
    <div class="flex flex-row">
        <el-input
            class="style-text-input"
            @focus="focus"
            @input="debouncedSave"
            @change="save"
            type="textarea"
            rows="5"
            v-model="value"
            :required="input.required"
            v-if="input.required || enabled"
        ></el-input>
        <add-control type="Text" @add="add" v-if="!input.required && !enabled" />
        <remove-control type="Text" @cancel="cancel" v-if="!input.required && enabled" />
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
    @apply transition ease-in-out duration-1000;
    width: 500px;
}
</style>
