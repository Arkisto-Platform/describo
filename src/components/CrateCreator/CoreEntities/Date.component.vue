<template>
    <div class="flex flex-row">
        <el-date-picker
            v-model="value"
            type="date"
            placeholder="Pick a date"
            format="MMMM d, yyyy"
            @change="save"
            v-if="input.required || enabled"
        >
        </el-date-picker>
        <div v-if="saved" class="ml-2 text-green-600 pt-1">
            <i class="far fa-check-circle fa-2x"></i>
        </div>
        <add-control
            type="Date"
            @add="add"
            v-if="!input.required && !enabled"
        />
    </div>
</template>

<script>
import AddControl from "components/CrateCreator/SectionComponents/AddControl.component.vue";
import { debounce } from "lodash";
import { startOfDay } from "date-fns";

export default {
    components: {
        AddControl
    },
    props: {
        input: {
            type: Object
        }
    },
    data() {
        return {
            debouncedSave: debounce(this.save, 500),
            saved: false,
            value: this.input.value,
            enabled: this.input.value ? true : false
        };
    },
    methods: {
        save() {
            this.$emit("save", startOfDay(this.value).toISOString());
            this.saved = true;
        },
        focus() {
            this.saved = false;
        },
        add() {
            this.enabled = true;
        }
    }
};
</script>

<style lang="scss" scoped>
.style-text-input {
    @apply transition ease-in-out duration-1000;
    width: 500px;
}
</style>
