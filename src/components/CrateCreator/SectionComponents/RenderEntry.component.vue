<template>
    <div
        class="flex flex-col my-1 pl-2 border-l-2 border-gray-400 py-2"
        :class="{ 'border-orange-600': template.required }"
    >
        <div class="my-auto text-left text-sm pr-2">
            <span v-if="template.required" class="text-orange-600"
                ><i class="fas fa-asterisk"></i
            ></span>
            {{ label }}
        </div>
        <div class="my-2" v-if="enableAdd">
            <add-control :template="template" @add="add" />
        </div>

        <!-- Dialog to add something  -->
        <render-item-component
            class="border-2 border-gray-200 p-4 bg-teal-100"
            v-if="addItem"
            :template="addItem.template"
            :reference="reference"
            @done="addItem = false"
        />

        <!-- View: Simple entry type -->
        <div v-if="isSimpleType">
            <render-item-component
                :template="template"
                :reference="reference"
                :data="data"
            />
        </div>

        <!-- View: Compound simple type -->
        <div v-if="isCompoundType">
            <compound-component
                :template="template"
                :reference="reference"
                :data="data"
            />
        </div>

        <!-- View: Custom (entity) types -->
        <div v-if="!isSimpleType && !isCompoundType">
            <div class="flex flex-row flex-wrap">
                <render-item-component
                    class="m-1"
                    v-for="item of data"
                    :key="item.uuid"
                    :template="{ ...template, '@type': item['@type'] }"
                    :reference="reference"
                    :data="item"
                />
            </div>
        </div>

        <div class="text-sm text-gray-600" v-if="template.help">
            {{ template.help }}
        </div>
    </div>
</template>

<script>
import AddControl from "./AddControl.component.vue";
import RenderItemComponent from "./RenderItem.component.vue";
import CompoundComponent from "components/CrateCreator/CoreEntities/Compound.component.vue";
import { generateId } from "components/CrateCreator/tools";
import { cloneDeep, uniqBy, isArray, isString, isEmpty } from "lodash";
import { shortName } from "src/renderer/filters";
import { SimpleTypes } from "./component.mixins";

export default {
    components: {
        AddControl,
        RenderItemComponent,
        CompoundComponent,
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
        data: {},
    },
    data() {
        return {
            // property: this.input.property,
            label: this.template.label || shortName(this.template.property),
            addItem: false,
        };
    },
    computed: {
        enableAdd: function() {
            if (this.template["@type"] === "Value") {
                return false;
            } else if (this.template.multiple) {
                return true;
            } else if (
                (isArray(this.data) && isEmpty(this.data)) ||
                !this.data
            ) {
                return true;
            } else {
                return false;
            }
        },
        isSimpleType: function() {
            return (
                SimpleTypes.includes(this.template["@type"]) &&
                !this.template.multiple
            );
        },
        isCompoundType: function() {
            return (
                SimpleTypes.includes(this.template["@type"]) &&
                this.template.multiple
            );
        },
    },
    methods: {
        add(payload) {
            const item = {
                template: {
                    ...payload.template,
                    "@type": payload.type,
                    enabled: true,
                },
            };
            // console.log(JSON.stringify(item, null, 2));
            this.addItem = item;
        },
    },
};
</script>

<style lang="scss" scoped></style>
