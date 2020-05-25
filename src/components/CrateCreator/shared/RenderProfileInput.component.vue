<template>
    <div
        class="flex flex-col my-1 p-2"
        :class="{
            'border-orange-600 border-l-4 bg-red-200': showAlert(input),
            'bg-yellow-400 py-6': view.property,
            hidden: input.group !== 'important' && !show,
            'bg-green-200': saved,
            'hover:bg-gray-200': !saved,
        }"
    >
        <!-- input label -->
        <div class="my-auto text-left text-sm pr-2 flex flex-row">
            <div v-show="showAlert(input)" class="text-orange-600 mx-2">
                <i class="fas fa-asterisk"></i>
            </div>
            <div class="text-lg">
                {{ renderLabel(input) }}
            </div>
            <div
                class="text-xs text-gray-600 mx-4 pt-1"
                v-if="showAlert(input)"
            >
                This property is required.
            </div>
            <div class="flex-grow"></div>
            <div class="flex flex-row space-x-2">
                <render-profile-item-linker-component
                    v-if="showLinker(input) && input.showAddControl"
                    :types="input['@type']"
                    :parentId="container.uuid"
                    :property="input.property"
                    @done="$emit('done')"
                />
                <add-control
                    :template="input"
                    @add="add"
                    v-if="input.showAddControl"
                />
                <div>
                    <el-button
                        @click="loadPropertyDefinition(input)"
                        size="mini"
                        type="primary"
                        round
                        class="focus:outline-none focus:border-2 focus:border-blue-600"
                    >
                        <i class="fas fa-question fa-fw"></i>
                    </el-button>
                </div>
            </div>
        </div>
        <div class="text-sm text-gray-600">{{ input.help }}</div>
        <!-- end: input label -->

        <div v-if="!input.multiple">
            <!-- render simple types in place -->
            <div v-if="isSimpleType(input['@type'])">
                <render-core-component
                    class="flex-grow my-1"
                    :template="input"
                    :reference="container.uuid"
                    @saved="notifySaved"
                />
            </div>
            <!-- show tag for complex type entries -->
            <div v-else class="flex flex-row p-2">
                <render-profile-item-component
                    v-if="input.data"
                    :item="input"
                    :reference="container.uuid"
                />
            </div>
        </div>

        <div v-if="input.multiple" class="flex flex-row flex-wrap p-2">
            <div v-for="instance of input.data" :key="loopKey(instance)">
                <!-- render simple types in place -->
                <div
                    v-if="
                        isSimpleType(input['@type']) ||
                            isSimpleType(instance['@type']) ||
                            dataIsSimpleType(instance)
                    "
                >
                    <render-core-component
                        class="m-1"
                        :template="{ ...input, data: instance }"
                        :reference="container.uuid"
                        @saved="notifySaved"
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

        <!-- data inspector drawer-->
        <definition-drawer-component
            :drawer="view.definitionDrawer"
            :url="view.url"
            :definition="view.definition"
            :type="view.type"
            @close="closeDefinitionDrawer"
        />
        <!-- end: data inspector drawer-->
    </div>
</template>

<script>
import { shortName } from "src/renderer/filters";
import { isURL } from "validator";
import { isArray, isPlainObject, isString, isEmpty, difference } from "lodash";
import AddControl from "./AddControl.component.vue";
import RenderProfileItemComponent from "./RenderProfileItem.component.vue";
import RenderProfileItemLinkerComponent from "./RenderProfileItemLinker.component.vue";
import DefinitionDrawerComponent from "./DefinitionDrawer.component.vue";
import {
    SimpleTypes,
    isSimpleType,
} from "components/CrateCreator/CoreComponents/simple/component.mixins";

export default {
    components: {
        AddControl,
        RenderCoreComponent: () =>
            import("./RenderCoreComponent.component.vue"),

        RenderProfileItemComponent,
        RenderProfileItemLinkerComponent,
        DefinitionDrawerComponent,
    },
    props: {
        input: {
            type: Object,
            required: true,
        },
        container: {
            type: Object,
            required: true,
        },
        show: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            saved: false,
            showHelp: false,
            view: {
                definitionDrawer: false,
                url: undefined,
                definition: undefined,
            },
        };
    },
    methods: {
        dataIsSimpleType(input) {
            return isPlainObject(input) && input.uuid ? false : true;
        },
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
        add({ type, property }) {
            this.$emit("add", { type, property });
        },
        loadPropertyDefinition(input) {
            if (isURL(input.property)) {
                this.view.url = input.property;
            } else {
                if ("definition" in this.input) {
                    this.view.definition = this.input.definition;
                } else {
                    this.view.url = `https://schema.org/${input.property}`;
                }
            }
            this.view.definitionDrawer = true;
        },
        closeDefinitionDrawer() {
            this.view = {
                definitionDrawer: false,
                property: undefined,
            };
        },
        notifySaved() {
            this.saved = true;
            setTimeout(() => {
                this.saved = false;
            }, 500);
        },
    },
};
</script>
