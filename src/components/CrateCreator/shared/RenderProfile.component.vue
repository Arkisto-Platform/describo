<template>
    <div class="flex flex-col">
        <!-- lookup data packs -->
        <lookup-data-pack-component :uuid="uuid" />

        <div v-if="template.length">
            <render-profile-report-component
                :report="report"
                v-if="
                    !report.templateAvailable || report.extraProperties.length
                "
            />

            <div
                v-for="input in template"
                :key="input.property"
                class="my-1 p-2 hover:bg-gray-200"
                :class="{
                    'border-orange-600 border-l-4 bg-red-200': showAlert(input),
                    'bg-yellow-400 py-6':
                        view.property && view.property.match(input.property),
                    hidden: input.group !== 'important' && !showAllProperties,
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
                    <div class="flex-grow"></div>
                    <div
                        class="text-xs text-gray-600 mx-2"
                        v-if="showAlert(input)"
                    >
                        This property is required.
                    </div>
                    <div>
                        <el-button
                            @click="loadPropertyDefinition(input)"
                            size="mini"
                            type="primary"
                            round
                        >
                            <i class="fas fa-question fa-fw"></i>
                        </el-button>
                    </div>
                </div>
                <div class="text-sm text-gray-600">{{ input.help }}</div>
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
                        <render-core-component
                            class="flex-grow my-1"
                            :template="input"
                            :reference="container.uuid"
                            @done="updateTemplate"
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
                    <div
                        v-for="instance of input.data"
                        :key="loopKey(instance)"
                    >
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
            </div>

            <div class="flex flex-row justify-center my-4">
                <el-button
                    class="flex-grow"
                    type="primary"
                    @click="showAllProperties = !showAllProperties"
                    v-if="!showAllProperties"
                >
                    Show all available properties
                </el-button>
            </div>

            <!-- data inspector drawer-->
            <definition-drawer-component
                :drawer="view.definitionDrawer"
                :property="view.property"
                :type="view.type"
                @close="closeDefinitionDrawer"
            />
            <!-- end: data inspector drawer-->
        </div>
    </div>
</template>

<script>
import { shortName } from "src/renderer/filters";
import { updateTemplate } from "./describe-entry";
import { mappings } from "components/profiles/type-mappings";
import { isURL } from "validator";
import {
    cloneDeep,
    isArray,
    isPlainObject,
    isString,
    isEmpty,
    difference,
} from "lodash";
import AddControl from "./AddControl.component.vue";
import RenderProfileReportComponent from "./RenderProfileReport.component.vue";
import RenderProfileItemComponent from "./RenderProfileItem.component.vue";
import RenderProfileItemLinkerComponent from "./RenderProfileItemLinker.component.vue";
import DefinitionDrawerComponent from "./DefinitionDrawer.component.vue";
import LookupDataPackComponent from "./LookupDataPack.component.vue";
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
        RenderCoreComponent: () =>
            import("./RenderCoreComponent.component.vue"),
        RenderProfileReportComponent,
        RenderProfileItemComponent,
        RenderProfileItemLinkerComponent,
        DefinitionDrawerComponent,
        LookupDataPackComponent,
    },
    props: {
        uuid: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            typeDefinition: [],
            report: {},
            template: [],
            showAllProperties: false,
            view: {
                definitionDrawer: false,
                property: undefined,
            },
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
        uuid: function() {
            this.template = [];
            this.$nextTick(() => {
                this.loadProfileInputs();
                this.updateTemplate();
            });
        },
    },
    beforeMount() {
        this.loadProfileInputs();
        this.updateTemplate();
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
        loadProfileInputs() {
            const container = this.$store.getters.getItemById(this.uuid);
            let type = container["@type"];
            if (isArray(type)) {
                type = mappings[type.sort().join(", ")];
            }
            if (type === "RootDataset") {
                this.typeDefinition = this.$store.getters.getActiveProfileDefinition();
            } else {
                this.typeDefinition = this.$store.getters.getTypeDefinition(
                    type
                );
            }
        },
        updateTemplate() {
            // if no inputs are defined we want to just show the data pack selector
            if (
                !this.typeDefinition.inputs ||
                !this.typeDefinition.inputs.length
            )
                return;

            // otherwise if inputs are defined - assemble the template for the profile renderer
            let { template, report } = updateTemplate({
                item: this.container,
                typeDefinition: cloneDeep(this.typeDefinition),
            });
            this.report = report;
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
                        this.$emit("link-item");
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
        loadPropertyDefinition(input) {
            if (isURL(input.property)) {
                this.view.property = input.property;
            } else {
                this.view.property = `https://schema.org/${input.property}`;
            }
            this.view.definitionDrawer = true;
        },
        closeDefinitionDrawer() {
            this.view = {
                definitionDrawer: false,
                property: undefined,
            };
        },
    },
};
</script>
