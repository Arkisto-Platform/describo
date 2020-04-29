<template>
    <div class="flex flex-col">
        <div
            v-for="input in template"
            :key="input.property"
            class="my-1 p-1"
            :class="{
                'border-orange-600 border-l-4 bg-red-200': showAlert(input),
            }"
        >
            <!-- input label -->
            <div class="my-auto text-left text-sm pr-2">
                <span v-if="showAlert(input)" class="text-orange-600">
                    <i class="fas fa-asterisk"></i>
                </span>
                {{ renderLabel(input) }}
                <div
                    class="float-right text-xs text-gray-600"
                    v-if="showAlert(input)"
                >
                    This property is required.
                </div>
            </div>
            <!-- end: input label -->

            <!-- add control -->
            <div class="flex flex-row">
                <render-profile-item-linker-component
                    v-if="showLinker(input) && input.showAddControl"
                    :types="input['@type']"
                    :parentId="container.uuid"
                    :property="input.property"
                    @done="updateTemplate"
                />
                <add-control
                    :template="input"
                    @add="add"
                    v-if="input.showAddControl"
                />
            </div>
            <!-- end: add control -->

            <div v-if="!input.multiple">
                <!-- render simple types in place -->
                <div v-if="isSimpleType(input['@type'])">
                    <render-item-component
                        class="flex-grow my-1"
                        :template="input"
                        :reference="container.uuid"
                        @done="updateTemplate"
                    />
                </div>
                <!-- show tag for complex type entries -->
                <div v-else class="flex flex-row">
                    <render-profile-item-component
                        :item="input"
                        :reference="container.uuid"
                    />
                </div>
            </div>

            <div v-if="input.multiple" class="flex flex-row flex-wrap">
                <div v-for="instance of input.data" :key="loopKey(instance)">
                    <!-- render simple types in place -->
                    <div
                        v-if="
                            isSimpleType(input['@type']) ||
                                isSimpleType(instance['@type'])
                        "
                    >
                        <render-item-component
                            class="m-1"
                            :template="{ ...input, data: instance }"
                            :reference="container.uuid"
                            @done="updateTemplate"
                        />
                    </div>

                    <!-- show tag for complex type entries -->
                    <div v-else>
                        <render-profile-item-component
                            class="m-1"
                            :item="{ ...input, data: instance }"
                            :reference="container.uuid"
                        />
                    </div>
                </div>
            </div>
            <div class="text-sm text-gray-600">{{ input.help }}</div>
        </div>
    </div>
</template>

<script>
import { shortName } from "src/renderer/filters";
import { updateTemplate } from "./describe-entry";
import { cloneDeep, isArray, isString, isEmpty, difference } from "lodash";
import AddControl from "./AddControl.component.vue";
import RenderProfileItemComponent from "./RenderProfileItem.component.vue";
import RenderProfileItemLinkerComponent from "./RenderProfileItemLinker.component.vue";
import {
    SimpleTypes,
    isSimpleType,
} from "components/CrateCreator/CoreComponents/simple/component.mixins";
import {
    generateId,
    linkParentAndItem,
    unlinkParentAndItem,
} from "components/CrateCreator/tools";

export default {
    components: {
        AddControl,
        RenderItemComponent: () =>
            import("./RenderCoreComponent.component.vue"),
        RenderProfileItemComponent,
        RenderProfileItemLinkerComponent,
    },
    props: {
        uuid: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            inputs: [],
            // container: {},
            template: [],
        };
    },
    computed: {
        container: function() {
            return this.$store.getters.getItemById(this.uuid);
        },
    },
    watch: {
        container: {
            handler: function() {
                this.updateTemplate();
            },
            deep: true,
        },
    },
    beforeMount() {
        this.loadProfileInputs();
        this.updateTemplate();
    },
    methods: {
        isSimpleType(type) {
            return isSimpleType(type);
        },
        showLinker(input) {
            let types = input["@type"];
            if (isString(types)) types = [types];
            return difference(types, SimpleTypes).length ? true : false;
        },
        loopKey(instance) {
            return instance.uuid ? instance.uuid : instance;
        },
        renderLabel(input) {
            return input.label || shortName(input.property);
        },
        showAlert(input) {
            return (
                input.required &&
                ((isArray(input.data) && isEmpty(input.data)) || !input.data)
            );
        },
        loadProfileInputs() {
            const container = this.$store.getters.getItemById(this.uuid);
            const type = container["@type"];
            if (type === "RootDataset") {
                this.inputs = this.$store.state.profileInputs;
            } else {
                try {
                    this.inputs = this.$store.getters.getTypeDefinition(
                        type
                    ).inputs;
                } catch (error) {
                    //no type definition
                    this.inputs = [];
                }
            }
        },
        updateTemplate() {
            let template = updateTemplate({
                item: this.container,
                inputs: cloneDeep(this.inputs),
                typeDefinitions: cloneDeep(this.$store.state.typeDefinitions),
            });
            this.template = template;
        },
        add({ type, property }) {
            this.template = this.template.map((item) => {
                if (item.property === property) {
                    if (isSimpleType(type)) {
                        if (item.multiple) {
                            item.data.push("");
                        } else {
                            item.data = "";
                        }
                        item.enabled = true;
                    } else {
                        let newItem = {
                            "@type": type,
                            uuid: generateId(),
                        };
                        this.$store.commit("saveToGraph", newItem);
                        this.$store.commit("addNewItem", {
                            itemId: newItem.uuid,
                            parentId: this.container.uuid,
                            property,
                        });
                    }
                }
                return item;
            });
        },
    },
};
</script>
