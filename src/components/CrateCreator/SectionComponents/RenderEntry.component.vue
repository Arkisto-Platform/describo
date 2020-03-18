<template>
    <div class="flex flex-col my-2">
        <div class="my-auto text-left text-sm pr-2">
            {{ label }}
        </div>

        <div
            class="flex flex-col flex-grow pl-2 border-l-2 border-gray-400"
            v-if="input.addItems"
        >
            <div class="my-2">
                <add-control :type="input['@type']" @add="add" />
            </div>
            <div class="flex flex-row flex-wrap">
                <render-item-component
                    class="m-1"
                    v-for="item of input.items"
                    :key="item['@id']"
                    :item="item"
                    :reference="generateParentId()"
                    @cancel="cancel"
                    @save="save"
                    @replace="replace"
                />
            </div>
        </div>
        <text-component
            :input="input"
            v-if="input['@type'] === 'Text'"
            @save="save"
        />
        <date-component
            class="w-full"
            :input="input"
            v-if="input['@type'] === 'Date'"
            @save="save"
        />
        <div v-if="input['@type'] === 'Value'" @blur="add(input.value)">
            {{ input.value }}
        </div>
    </div>
</template>

<script>
import AddControl from "./AddControl.component.vue";
import RenderItemComponent from "./RenderItem.component.vue";
import TextComponent from "components/CrateCreator/CoreEntities/Text.component.vue";
import DateComponent from "components/CrateCreator/CoreEntities/Date.component.vue";
import { generateId } from "components/CrateCreator/tools";
import { cloneDeep, uniqBy } from "lodash";
import { shortName } from "src/renderer/filters";

export default {
    components: {
        AddControl,
        RenderItemComponent,
        TextComponent,
        DateComponent
    },
    props: {
        input: {
            type: Object,
            required: true
        },
        reference: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            property: this.input.property,
            label: this.input.label || shortName(this.input.property)
        };
    },
    methods: {
        add(type) {
            const add = {
                uuid: generateId(),
                "@type": type
            };
            this.input.items.push(add);
            if (this.input.items.length === 1 && !this.multiple)
                this.addItems = false;
        },
        cancel(id) {
            this.input.items = this.input.items.filter(i => i.uuid !== id);
            this.$emit("save", {
                property: this.property,
                items: this.input.items
            });
        },
        save(value) {
            if (["Text", "Date"].includes(this.input["@type"])) {
                this.$emit("save", {
                    property: this.property,
                    value
                });
            } else {
                this.$emit("save", {
                    property: this.property,
                    items: this.input.items
                });
            }
        },
        replace(payload) {
            this.input.items = this.input.items.map(item => {
                if (item.uuid === payload.old) {
                    return {
                        ...item,
                        uuid: payload.new
                    };
                }
                return item;
            });
            this.input.items = uniqBy(this.input.items, "uuid");
            this.$emit("save", {
                property: this.property,
                items: this.input.items
            });
        },
        generateParentId() {
            return `${this.reference}-${this.property}`;
        }
    }
};
</script>

<style lang="scss" scoped></style>
