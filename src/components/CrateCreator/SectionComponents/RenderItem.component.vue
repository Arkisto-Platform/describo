<template>
    <div>
        <component
            v-bind:is="component"
            :template="template"
            :reference="reference"
            :data="data"
            :mode="mode"
            @done="$emit('done')"
        ></component>
    </div>
</template>

<script>
import { components as ComponentMixins } from "./component.mixins";
export default {
    mixins: [ComponentMixins],
    props: {
        template: {
            type: Object,
            required: true,
        },
        reference: {
            type: String,
            required: true,
        },
        data: {},
        mode: {
            type: Object,
        },
    },
    data() {
        return {
            component: undefined,
        };
    },
    mounted() {
        const components = Object.keys(ComponentMixins.components);
        if (this.template["@type"]) {
            if (components.includes(`${this.template["@type"]}Component`)) {
                this.component = `${this.template["@type"]}Component`;
            } else {
                this.component = "GenericComponent";
            }
        }
    },
};
</script>

<style lang="scss" scoped></style>
