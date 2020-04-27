<template>
    <div class="flex flex-col">
        <div class="flex flex-row">
            <component
                class="flex-grow"
                v-bind:is="component"
                :template="template"
                :reference="reference"
                @done="done"
            ></component>
            <div v-if="saved" class="ml-2 text-green-600 pt-1">
                <i class="far fa-check-circle fa-2x"></i>
            </div>
            <remove-control
                v-if="enableRemoveControl()"
                :template="template"
                :uuid="reference"
                @remove="remove"
            />
        </div>
    </div>
</template>

<script>
import { uniq, isArray, isPlainObject, isString, isEmpty } from "lodash";
import RemoveControl from "./RemoveControl.component.vue";
import { components as SimpleComponentMixins } from "components/CrateCreator/CoreComponents/simple/component.mixins";
export default {
    mixins: [SimpleComponentMixins],
    components: {
        RemoveControl,
    },
    props: {
        template: {
            type: Object,
            required: true,
        },
        reference: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            component: undefined,
            saved: false,
        };
    },
    mounted() {
        const component = `${this.template["@type"]}Component`;
        this.component = component;
    },
    methods: {
        enableRemoveControl() {
            return (
                !this.template.required &&
                this.template["@type"] !== "Value" &&
                this.template.enabled
            );
        },
        remove(payload) {
            const item = this.$store.getters.getItemById(this.reference);
            const property = payload.property;
            if (isArray(item[property])) {
                item[property] = item[property].filter((v) => {
                    if (isPlainObject(v) && v.uuid) {
                        v.uuid !== this.template.data.uuid;
                    } else if (isString(v)) {
                        return v !== this.template.data;
                    } else {
                        console.log(
                            `RenderItem remove error from array: ${v} ${this.template.data}`
                        );
                    }
                });
                item[property] = uniq(item[property]);
                if (isEmpty(item[property])) delete item[property];
            } else {
                delete item[property];
            }
            this.$store.commit("saveToGraph", item);
            this.$emit("remove", payload);
        },
        done() {
            this.saved = true;
            setTimeout(() => {
                this.saved = false;
                this.$emit("done");
            }, 1000);
        },
    },
};
</script>

<style lang="scss" scoped></style>
