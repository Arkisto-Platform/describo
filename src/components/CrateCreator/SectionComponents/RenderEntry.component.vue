<template>
    <div class="flex flex-col mt-1 mb-4 pl-2 border-l-2 border-gray-400">
        <div class="my-auto text-left text-sm pr-2">{{ label }}</div>
        <div class="my-2" v-if="enableAdd">
            <add-control :template="template" @add="add" />
        </div>
        <render-item-component
            class="border-2 border-gray-200 p-4 bg-teal-100"
            v-if="addItem"
            :template="addItem.template"
            :reference="reference"
            @done="addItem = false"
        />

        <!-- Simple entry type -->
        <div v-if="isSimpleType">
            <render-item-component
                :template="template"
                :reference="reference"
                :data="data"
            />
        </div>

        <!-- Compound simple type -->
        <div v-if="isCompoundType">
            <compound-component
                :template="template"
                :reference="reference"
                :data="data"
            />
        </div>

        <!-- Custom (entity) types -->
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
import { cloneDeep, uniqBy, isArray, isString } from "lodash";
import { shortName } from "src/renderer/filters";
import { SimpleTypes } from "./component.mixins";

export default {
    components: {
        AddControl,
        RenderItemComponent,
        CompoundComponent
    },
    props: {
        template: {
            type: Object,
            required: true
        },
        reference: {
            type: String,
            required: true
        },
        data: {}
    },
    data() {
        return {
            // property: this.input.property,
            label: this.template.label || shortName(this.template.property),
            addItem: false
        };
    },
    computed: {
        enableAdd: function() {
            if (this.template["@type"] === "Value") return false;
            if (
                this.template.multiple ||
                (!this.template.multiple && !this.data)
            )
                return true;
            return false;
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
        }
    },
    methods: {
        // generateParentId() {
        //     return { property: this.property, uuid: this.reference };
        // },
        // cancel(payload) {
        //     console.log("cancel", JSON.stringify(payload, null, 2));
        // },
        // save(payload) {
        //     console.log("save", JSON.stringify(payload, null, 2));
        // },
        add(payload) {
            const item = {
                template: {
                    ...payload.template,
                    "@type": payload.type,
                    enabled: true
                }
            };
            // console.log(JSON.stringify(item, null, 2));
            this.addItem = item;
        }
        // add(type) {
        //     const add = {
        //         uuid: generateId(),
        //         "@type": type
        //     };
        //     this.input.items.push(add);
        //     if (
        //         !this.input.multiple &&
        //         this.input.items &&
        //         this.input.items.length === 1
        //     ) {
        //         this.input.disableAdd = true;
        //     }
        // },
        // cancel(id) {
        //     if (!id) {
        //         this.$emit("cancel", { property: this.property });
        //     } else {
        //         this.input.items = this.input.items.filter(i => i.uuid !== id);
        //         this.$emit("save", {
        //             property: this.property,
        //             items: this.input.items
        //         });
        //     }
        //     if (
        //         !this.input.multiple &&
        //         !this.isSimpleType &&
        //         this.input.items.length === 0
        //     )
        //         this.input.disableAdd = false;
        // },
        // save(value) {
        //     console.log("@type", value);
        //     if (
        //         ["Text", "TextArea", "Date", "Select"].includes(
        //             this.input["@type"]
        //         )
        //     ) {
        //         this.$emit("save", {
        //             property: this.property,
        //             value
        //         });
        //     } else {
        //         this.$emit("save", {
        //             property: this.property,
        //             items: this.input.items
        //         });
        //     }
        // },
        // replace(payload) {
        //     this.input.items = this.input.items.map(item => {
        //         if (item.uuid === payload.old) {
        //             return {
        //                 ...item,
        //                 uuid: payload.new
        //             };
        //         }
        //         return item;
        //     });
        //     this.input.items = uniqBy(this.input.items, "uuid");
        //     this.$emit("save", {
        //         property: this.property,
        //         items: this.input.items
        //     });
        // },
    }
};
</script>

<style lang="scss" scoped></style>
