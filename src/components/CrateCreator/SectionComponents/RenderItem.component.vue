<template>
    <component
        v-bind:is="component"
        :input="item"
        :reference="reference"
        @cancel="cancel"
        @save="save"
        @replace="replace"
    ></component>
</template>

<script>
import ComponentMixins from "components/CrateCreator/CoreEntities/component.mixins";
export default {
    mixins: [ComponentMixins],
    props: {
        item: {
            type: Object,
            required: true
        },
        reference: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            component: undefined
        };
    },
    mounted() {
        if (this.item["@type"])
            this.component = `${this.item["@type"]}Component`;
    },
    methods: {
        cancel(id) {
            this.$emit("cancel", id);
        },
        save(payload) {
            this.$emit("save", payload);
        },
        replace(payload) {
            this.$emit("replace", payload);
        }
    }
};
</script>

<style lang="scss" scoped></style>
