<template>
    <div class="flex flex-row">
        <el-date-picker
            v-model="value"
            type="date"
            placeholder="Pick a date"
            format="MMMM d, yyyy"
            @change="save"
            :clearable="false"
            v-if="template.required || enabled"
        >
        </el-date-picker>
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
    },
};
</script>

<style lang="scss" scoped>
.style-text-input {
    width: 500px;
}
</style>
