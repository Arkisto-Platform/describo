<template>
    <div class="flex flex-row">
        <el-date-picker
            v-model="value"
            type="date"
            placeholder="Pick a date"
            format="MMMM d, yyyy"
            @change="save"
            :clearable="false"
            v-if="input.required || enabled"
        >
        </el-date-picker>
        <add-control
            type="Date"
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
import { startOfDay } from "date-fns";

export default {
    mixins: [SimpleComponentMixins],
    save() {
        this.$emit("save", startOfDay(this.value).toISOString());
        this.saved = true;
        setTimeout(() => {
            this.saved = false;
        }, 1000);
    }
};
</script>

<style lang="scss" scoped>
.style-text-input {
    @apply transition ease-in-out duration-1000;
    width: 500px;
}
</style>
