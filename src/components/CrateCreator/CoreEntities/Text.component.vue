<template>
    <div class="flex flex-row">
        <el-input
            class="style-text-input"
            @focus="focus"
            @input="debouncedSave"
            @change="save"
            v-model="value"
            :required="input.required"
            v-if="input.required || enabled"
        ></el-input>
        <div v-if="saved" class="ml-2 text-green-600 pt-1">
            <i class="far fa-check-circle fa-2x"></i>
        </div>
        <add-control
            type="Text"
            @add="add"
            v-if="!input.required && !enabled"
        />
    </div>
</template>

<script>
import AddControl from "components/CrateCreator/SectionComponents/AddControl.component.vue";
import { debounce } from "lodash";

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
            this.$emit("save", this.value);
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
